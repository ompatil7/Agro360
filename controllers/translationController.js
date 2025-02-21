const axios = require("axios");

const translateMiddleware = async (req, res, next) => {
  if (res.isTranslated) {
    return next();
  }

  const originalJson = res.json;
  res.json = async function (data) {
    try {
      res.isTranslated = true;
      const targetLanguage = req.query.lang || "en";

      const translationResponse = await axios.post(
        "http://127.0.0.1:5000/translate",
        {
          text: JSON.stringify(data),
          lang: targetLanguage,
        }
      );

      const translatedData = JSON.parse(
        translationResponse.data.translated_text
      );
      originalJson.call(this, translatedData);
    } catch (error) {
      originalJson.call(this, data);
    }
  };

  next();
};

module.exports = translateMiddleware;
