const GeminiService = require("../services/gemini.service");

const geminiService = new GeminiService(process.env.GEMINI_API_KEY);

// Disease-specific handler
// In controllers/gemini.controller.js - Update disease handler
exports.handleDiseaseQuery = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message format" });
    }

    const rawResponse = await geminiService.getDiseaseResponse(message);

    // Add JSON cleaning and validation
    const cleanedResponse = rawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleanedResponse);
      res.json(parsed); // Direct JSON response without wrapping
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      res.status(500).json({
        error: "Invalid response format",
        details: {
          rawResponse: cleanedResponse,
          systemPrompt: systemPrompt,
        },
      });
    }
  } catch (error) {
    console.error("Disease Controller Error:", error);
    res.status(500).json({
      error: "Disease query processing failed",
      technicalDetails: error.message,
    });
  }
};
// General agriculture handler with JSON response
// exports.handleGeneralQuery = async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message || typeof message !== "string") {
//       return res.status(400).json({ error: "Invalid message format" });
//     }

//     const response = await geminiService.getGeneralResponse(message);

//     try {
//       // Parse Gemini's response into JSON
//       const parsedResponse = JSON.parse(response);
//       res.json(parsedResponse);
//     } catch (jsonError) {
//       console.warn(
//         "JSON parsing failed, attempting to extract JSON from text response"
//       );

//       // Advanced JSON extraction - try to find JSON within the text
//       const jsonMatch = response.match(/\{[\s\S]*\}/);
//       if (jsonMatch) {
//         try {
//           const extractedJson = JSON.parse(jsonMatch[0]);
//           return res.json(extractedJson);
//         } catch (extractError) {
//           console.error("JSON extraction failed:", extractError);
//         }
//       }

//       // Fallback to structured error response
//       res.json({
//         type: "Error",
//         overview: "Response format error",
//         details: {
//           rawResponse: response,
//           errorMessage: "Failed to parse response as JSON",
//         },
//         timestamp: new Date().toISOString(),
//       });
//     }
//   } catch (error) {
//     console.error("General Controller Error:", error);
//     res.status(500).json({
//       type: "Error",
//       overview: "Processing error",
//       details: {
//         errorMessage: error.message,
//         errorType: error.name,
//       },
//       timestamp: new Date().toISOString(),
//     });
//   }
// };
exports.handleGeneralQuery = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message format" });
    }

    const response = await geminiService.getGeneralResponse(message);

    // Directly return the text response with proper formatting
    res.set("Content-Type", "text/plain");
    res.send(response);
  } catch (error) {
    console.error("General Controller Error:", error);
    res.status(500).json({
      errorType: "AgriculturalProcessingError",
      technicalDetails: {
        errorCode: "AGPROC-502",
        component: "GeneralQueryHandler",
        failedInput: message,
        stackTrace: error.stack.split("\n").slice(0, 5),
      },
      userMessage:
        "Failed to process agricultural query. Technical team has been alerted.",
    });
  }
};
