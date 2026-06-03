import express from "express";
import { AskAI } from "../controllers/aiController.js";
import { generatePdf } from "../controllers/aiController.js";
const router = express.Router();

router.post("/ask-ai", AskAI);
router.post("/generate-pdf", generatePdf);
export default router;
