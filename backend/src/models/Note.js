import moongoose from "mongoose";

const noteSchema = new moongoose.Schema(
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

const Note = moongoose.model("Note", noteSchema);
export default Note;
