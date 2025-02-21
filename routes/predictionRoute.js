const express = require("express");
const axios = require("axios");
const router = express.Router();
const multer = require("multer");
const FormData = require("form-data");

const translateMiddleware = require("./../controllers/translationController");
const FLASK_SERVER_URL = "http://127.0.0.1:5000/";

// Middleware to apply translation only if `lang` query parameter exists
const conditionalTranslateMiddleware = (req, res, next) => {
  if (req.query.lang) {
    translateMiddleware(req, res, next);
  } else {
    next();
  }
};

// Apply middleware only for routes that should support translation
router.get("/infopredict", conditionalTranslateMiddleware, (req, res) => {
  const inputData = req.query.data.map(parseFloat);
  axios
    .post(`${FLASK_SERVER_URL}/withinfo_predict_crop`, { data: inputData })
    .then((response) => {
      res.json({
        crop: response.data.prediction[0],
        nitrogen: { description: response.data.n_desc },
        phosphorus: { description: response.data.p_desc },
        potassium: { description: response.data.k_desc },
        message: response.data.message,
      });
    })
    .catch((error) => {
      console.error("Prediction Error:", error);
      res.status(500).json({ error: "Prediction failed" });
    });
});

router.get("/predict", conditionalTranslateMiddleware, (req, res) => {
  const inputData = req.query.data.map(parseFloat);
  axios
    .post(`${FLASK_SERVER_URL}/predict_crop`, { data: inputData })
    .then((response) => res.json({ prediction: response.data }))
    .catch((error) => {
      console.error("Prediction Error:", error);
      res.status(500).json({ error: "Prediction failed" });
    });
});

router.get("/singlecrop", conditionalTranslateMiddleware, (req, res) => {
  const inputData = req.query.data.map(parseFloat);
  axios
    .post(`${FLASK_SERVER_URL}/singlecrop`, { data: inputData })
    .then((response) => res.json({ prediction: response.data }))
    .catch((error) => {
      console.error("Prediction Error:", error);
      res.status(500).json({ error: "Prediction failed" });
    });
});

router.get("/predictfertilizer", conditionalTranslateMiddleware, (req, res) => {
  const inputData = req.query.data.map(parseFloat);
  axios
    .post(`${FLASK_SERVER_URL}/predict_fertilizer`, { data: inputData })
    .then((response) => res.json({ prediction: response.data.prediction }))
    .catch((error) => {
      console.error("Prediction Error:", error);
      res.status(500).json({ error: "Prediction failed" });
    });
});

const upload = multer();

// Crop disease detection with translation check
router.post(
  "/detect-crop-disease",
  conditionalTranslateMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const formData = new FormData();
      formData.append("image", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const response = await axios.post(
        `${FLASK_SERVER_URL}/detect_crop_disease`,
        formData,
        {
          headers: { ...formData.getHeaders() },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error("Crop Disease Detection Error:", error);
      res.status(500).json({
        error: "Crop disease detection failed",
        details: error.message,
      });
    }
  }
);

module.exports = router;
