import Knowledge from "../models/Knowledge.js";

export async function getKnowledge(_, res) {
  try {
    const knowledge = await Knowledge.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json({ knowledge });
  } catch (error) {
    console.error("Error fetching knowledge:", error);
    res.status(500).json({ message: "Failed to fetch knowledge" });
  }
}

export async function addKnowledge(req, res) {
  const { title, content } = req.body;
  try {
    const newKnowledge = new Knowledge({ title, content });
    await newKnowledge.save();
    res.status(201).json({ message: "Knowledge added successfully" });
  } catch (error) {
    console.error("Error adding knowledge:", error);
    res.status(500).json({ message: "Failed to add knowledge" });
  }
}
