import moongoose from "mongoose";

const knowledgeSchema = new moongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  },
);

const Knowledge = moongoose.model("Knowledge", knowledgeSchema);
export default Knowledge;
