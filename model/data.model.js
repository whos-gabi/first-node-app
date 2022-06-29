import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    //article id
    // _id: mongoose.Schema.Types.ObjectId,
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    link: {
      type: String,
      // default: "article/", 
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
