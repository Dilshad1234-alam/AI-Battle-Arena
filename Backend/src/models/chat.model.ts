import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    problem: String,

    solution_1: String,

    solution_2: String,

    judge: {
      solution_1_score: Number,
      solution_2_score: Number,
      solution_1_reasoning: String,
      solution_2_reasoning: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chat", chatSchema);



