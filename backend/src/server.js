import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import notesRoutes from "./routes/notesRoutes.js";
import knowledgeRoutes from "./routes/knowledgeRoute.js";
import rateLimiter from "./middleware/rateLimiter.js";
import aiRoutes from "./routes/aiRoutes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON bodies
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(rateLimiter);
app.use("/api/notes", notesRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/knowledge", knowledgeRoutes);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
