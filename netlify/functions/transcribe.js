// netlify/functions/transcribe.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // You can get the API key from Netlify's environment variables
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const body = JSON.parse(event.body);
    const { audioData, mimeType } = body;

    const audio = {
      inlineData: {
        data: audioData.split(',')[1],
        mimeType: mimeType,
      },
    };

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = "Transcribe the following audio content into text.";

    const result = await model.generateContent([prompt, audio]);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ transcript: text }),
    };
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to transcribe audio.' }),
    };
  }
};