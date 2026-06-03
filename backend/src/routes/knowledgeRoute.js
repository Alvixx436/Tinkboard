import express from "express";
import { getKnowledge } from "../controllers/knowledgeController.js";
import { addKnowledge } from "../controllers/knowledgeController.js";
const router = express.Router();

router.get("/", getKnowledge);
router.post("/", addKnowledge);
export default router;
