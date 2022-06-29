import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    link: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // image: {
    //   type: String,
    // },
  },
  { collection: "articles" }
);

export const Article = mongoose.model("Article", articleSchema);
