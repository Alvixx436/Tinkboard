import Knowledge from "../models/Knowledge.js";
import PDFDocument from "pdfkit";
import fs from "fs";
export const AskAI = async (req, res) => {
  const { prompt } = req.body;

  try {
    // Split prompt into keywords
    const keywords = prompt
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2);

    // Search knowledge base
    const result = await Knowledge.find({
      $or: [
        {
          title: {
            $regex: keywords.join("|"),
            $options: "i",
          },
        },
        {
          content: {
            $regex: keywords.join("|"),
            $options: "i",
          },
        },
      ],
    }).limit(5);

    // Build context
    let knowledgeContext = "No relevant knowledge found.";

    if (result.length > 0) {
      knowledgeContext = result
        .map((item) => `Title: ${item.title}\nContent: ${item.content}`)
        .join("\n\n");
    }

    const fullPrompt = `
You are Alvin Gerolao's AI Portfolio Assistant.

IMPORTANT:
- Answer ONLY using the knowledge base below.
- If information is missing, say "I don't have information about that."
- Never say you are an AI model.
- Never mention training data.
- Speak as Alvin's portfolio assistant.

Knowledge Base:
${knowledgeContext}

User Question:
${prompt}

Instructions:
- Use the knowledge base when relevant.
- If the answer is not in the knowledge base, say so and answer using general knowledge.
- Be concise and accurate.
`;

    // Call Ollama
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: fullPrompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();

    return res.status(200).json({
      reply: data.response,
      knowledgeFound: result.length,
    });
  } catch (error) {
    console.error("AI Error:", error);

    return res.status(500).json({
      message: "AI request failed",
      error: error.message,
    });
  }
};

export const generatePdf = async (req, res) => {
  const { prompt } = req.body;

  try {
    const knowledge = await Knowledge.find().limit(10);

    const knowledgeContext = knowledge
      .map((item) => `Title: ${item.title}\nContent: ${item.content}`)
      .join("\n\n");

    const fullPrompt = `
You are a senior corporate report writer.

Write a PROFESSIONAL A4 ONE-PAGE REPORT.

HARD RULES:
- Must be STRICTLY 1 PAGE (A4)
- Maximum 250–300 words only
- No markdown (** no stars, no asterisks, no symbols)
- No bullet emojis
- No AI phrases like "as an AI"
- No unnecessary text
- Use clean business English
- Format must be simple and structured

LAYOUT FORMAT:

TITLE: [CENTERED, ALL CAPS]

1. OVERVIEW
Write 3–4 short sentences only.

2. KEY DETAILS
Use clean bullet points like:
- Item: Value
- Item: Value

3. CONCLUSION
2–3 short sentences only.

CONTENT:
${knowledgeContext}

TOPIC:
${prompt}

Return ONLY the report.
`;

    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: fullPrompt,
        stream: false,
      }),
    });

    const data = await ollamaResponse.json();

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

    doc.pipe(res);

    doc.font("Helvetica");

    doc.fontSize(16).text("AI GENERATED REPORT", {
      align: "center",
    });

    doc.moveDown(1);

    doc.fontSize(11).text(data.response, {
      align: "left",
      lineGap: 3,
    });

    doc.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate PDF",
    });
  }
};
