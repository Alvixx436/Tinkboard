import express from "express";
import { getNotes } from "../controllers/notesController.js";
import { createNote } from "../controllers/notesController.js";
import { updateNote } from "../controllers/notesController.js";
import { deleteNote } from "../controllers/notesController.js";
import { getNoteById } from "../controllers/notesController.js";
const router = express.Router();

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
export default router;
