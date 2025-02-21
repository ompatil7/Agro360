const express = require("express");
const {
  handleDiseaseQuery,
  handleGeneralQuery,
} = require("../controllers/chatbotController");

const router = express.Router();

router.post("/chat", handleDiseaseQuery);
router.post("/general", handleGeneralQuery);

module.exports = router;
