import os
import json
import numpy as np
import cv2
import base64
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from sklearn.exceptions import InconsistentVersionWarning
import warnings
from googletrans import Translator
import pandas as pd
from typing import Union, List, Dict, Any
import google.generativeai as genai
from PIL import Image
import logging
from moviepy.video.io.VideoFileClip import VideoFileClip
import tempfile
# Suppress warnings
warnings.simplefilter("ignore", InconsistentVersionWarning)

app = Flask(__name__)
CORS(app)
translator = Translator()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# Load machine learning models
RF_model = joblib.load('crop.joblib')
lg_model = joblib.load('logistic_regression_model.joblib')

df = pd.read_csv('Crop_recommendation.csv')
desired = pd.read_csv('Crop_NPK.csv')

disease_model = YOLO('best.pt')  # Crop disease detection model
with open('description.json', 'r') as file:
    fertilizer_dict = json.load(file)

# Load disease information
with open('diseasedescription.json', 'r') as file:
    disease_info = json.load(file)

@app.route('/detect_crop_disease_video', methods=['POST'])
def detect_crop_disease_video():
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video provided', 'message': 'No video uploaded'}), 400
        
        video_file = request.files['video']
        temp_video = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
        video_file.save(temp_video.name)
        temp_video.close()

        cap = cv2.VideoCapture(temp_video.name)
        if not cap.isOpened():
            return jsonify({'error': 'Failed to open video', 'message': 'Invalid video file'}), 400

        unique_diseases = {}  # Track count, max confidence, and info
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            results = disease_model.predict(source=frame, conf=0.25)

            for result in results:
                for box in result.boxes:
                    disease_class = disease_model.names[int(box.cls)]
                    confidence = box.conf.item()
                    disease_info = get_disease_info(disease_class)

                    # Update count and max confidence
                    if disease_class in unique_diseases:
                        unique_diseases[disease_class]['count'] += 1
                        if confidence > unique_diseases[disease_class]['max_confidence']:
                            unique_diseases[disease_class]['max_confidence'] = confidence
                    else:
                        unique_diseases[disease_class] = {
                            'count': 1,
                            'max_confidence': confidence,
                            'info': disease_info
                        }

        cap.release()
        os.unlink(temp_video.name)

        # Convert to list and sort by count (descending), then confidence (descending)
        unique_predictions = [
            {
                'disease': disease,
                'count': details['count'],
                'confidence': details['max_confidence'],
                'info': details['info']
            }
            for disease, details in unique_diseases.items()
        ]

        # Sort by most frequent, then by highest confidence
        sorted_predictions = sorted(
            unique_predictions,
            key=lambda x: (-x['count'], -x['confidence'])
        )

        return jsonify({
            'predictions': sorted_predictions,
            'message': 'Crop disease detection from video completed'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e), 'message': 'Crop disease detection from video failed'}), 500

def translate_batch(texts: Union[str, List[str]], dest: str = 'mr') -> Union[str, List[str]]:
    """
    Translate a single text or list of texts to the target language.
    
    Args:
        texts: Single string or list of strings to translate
        dest: Target language code (default: 'mr' for Marathi)
    
    Returns:
        Translated string or list of translated strings
    """
    try:
        if isinstance(texts, str):
            translation = translator.translate(texts, dest=dest)
            return translation.text
        elif isinstance(texts, list):
            if not texts:  # Handle empty list
                return texts
            translations = translator.translate(texts, dest=dest)
            # Handle both single and multiple translations
            if isinstance(translations, list):
                return [t.text for t in translations]
            else:
                return [translations.text]
    except Exception as e:
        print(f"Translation error: {e}")
        return texts

def translate_recursive(obj: Any, dest: str = 'mr') -> Any:
    """
    Recursively translate all strings in a nested structure.
    
    Args:
        obj: Object to translate (dict, list, or string)
        dest: Target language code
    
    Returns:
        Translated object maintaining the original structure
    """
    if isinstance(obj, dict):
        return {k: translate_recursive(v, dest) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [translate_recursive(item, dest) for item in obj]
    elif isinstance(obj, str):
        if len(obj) > 1 and not obj.isupper() and not obj.isdigit():
            return translate_batch(obj, dest)
    return obj


@app.route('/translate', methods=['POST'])
def translate_endpoint():
    try:
        data = request.json.get('text')
        target_language = request.json.get('lang', 'en')
        
        # Parse JSON if it's a JSON string
        try:
            parsed_data = json.loads(data)
        except:
            parsed_data = data
        
        # Translate the data
        translated_data = translate_recursive(parsed_data, dest=target_language)
        
        return jsonify({
            'original_text': data,
            'translated_text': json.dumps(translated_data)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Load disease information
with open('diseasedescription.json', 'r') as file:
    disease_info = json.load(file)

def get_disease_info(disease_name):
    # Normalize the disease name for comparison
    disease_name = disease_name.strip().lower()
    for disease in disease_info:
        if disease['name'].strip().lower() == disease_name:
            return disease
    return None

@app.route('/detect_crop_disease', methods=['POST'])
def detect_crop_disease():
    try:
        # Receive base64 encoded image or file upload
        if 'image' in request.files:
            # File upload method
            file = request.files['image']
            img_bytes = file.read()
            nparr = np.frombuffer(img_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        elif request.json and 'image' in request.json:
            # Base64 encoded image method
            image_base64 = request.json.get('image')
            image_bytes = base64.b64decode(image_base64)
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        else:
            return jsonify({'error': 'No image provided', 'message': 'No image uploaded'}), 400
        
        # Run inference (assuming disease_model is defined elsewhere)
        results = disease_model.predict(source=image, conf=0.25)
        
        # Prepare response
        disease_predictions = []
        for result in results:
            for box in result.boxes:
                disease_class = disease_model.names[int(box.cls)]
                confidence = box.conf.item()
                disease_info = get_disease_info(disease_class)
                disease_predictions.append({
                    'disease': disease_class,
                    'confidence': float(confidence),
                    'info': disease_info
                })
        
        return jsonify({
            'predictions': disease_predictions,
            'message': 'Crop disease detection completed'
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e), 'message': 'Crop disease detection failed'}), 500

@app.route('/withinfo_predict_crop', methods=['POST'])
def withinfo_predict_crop():
    try:
        if 'data' not in request.json or len(request.json['data']) < 7:
            return jsonify({
                'error': 'Insufficient input data',
                'message': 'Provide at least 7 input features'
            }), 400

        input_data = np.array(request.json['data']).reshape(1, -1)
        prediction = RF_model.predict(input_data)
        predicted_crop = prediction[0]

        crop_data = desired[desired['Crop'] == predicted_crop]
        
        if crop_data.empty:
            return jsonify({
                'error': 'Crop data not found',
                'message': f'No data available for crop: {predicted_crop}'
            }), 404

        n_diff = crop_data['N'].values[0] - input_data[0][0]
        p_diff = crop_data['P'].values[0] - input_data[0][1]
        k_diff = crop_data['K'].values[0] - input_data[0][2]

        def get_nutrient_description(diff, nutrient):
            if diff < 0:
                return fertilizer_dict.get(f'{nutrient}High', '')
            elif diff > 0:
                return fertilizer_dict.get(f'{nutrient}low', '')
            else:
                return fertilizer_dict.get(f'{nutrient}No', '')

        n_desc = get_nutrient_description(n_diff, 'N')
        p_desc = get_nutrient_description(p_diff, 'P')
        k_desc = get_nutrient_description(k_diff, 'K')

        return jsonify({
            'prediction': prediction.tolist(),
            'n_desc': n_desc,
            'p_desc': p_desc,
            'k_desc': k_desc,
            'message': 'Crop prediction and fertilizer recommendation completed'
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Crop prediction failed'
        }), 500


@app.route('/predict_crop', methods=['POST'])
def predict_crop():
    try:
        input_data = np.array(request.json['data']).reshape(1, -1)
        prediction = RF_model.predict(input_data)
        return jsonify({
            'prediction': prediction.tolist(),
            'message': 'Crop prediction completed'
        }), 200
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Crop prediction failed'
        }), 500

@app.route('/singlecrop', methods=['POST'])
def single_crop():
    try:
        input_data = np.array(request.json['data']).reshape(1, -1)
        prediction = RF_model.predict(input_data)
        return jsonify({
            'prediction': prediction.tolist(),
            'message': 'Single crop prediction completed'
        }), 200
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Single crop prediction failed'
        }), 500

@app.route('/predict_fertilizer', methods=['POST'])
def predict_fertilizer():
    try:
        input_data = np.array(request.json['data']).reshape(1, -1)
        prediction = lg_model.predict(input_data)
        return jsonify({
            'prediction': prediction.tolist(),
            'message': 'Fertilizer prediction completed'
        }), 200
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Fertilizer prediction failed'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)