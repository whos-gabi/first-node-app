import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { Article } from "../model/data.model.js";
dotenv.config();
const api_key = process.env.NEWS_API_KEY;
const router = express.Router();

router.get("/", async (req, res) => {
  // const articles = await Article.find().sort({ createdAt: "desc" });
  //   const categories = await Category.find();
  var url =
    "https://newsapi.org/v2/everything?q=Apple&sortBy=popularity&apiKey=" +
    api_key;
  //get dat afrom api in node
  const response = await fetch(url);
  const data = await response.json();

  // console.log(data);
  res.render("index", { data: data.articles });
});

router.get("/new", async (req, res) => {
  //   const categories = await Category.find();
  res.render("new", { article: new Article() });
});
//get /profile render profile.ejs
router.get("/profile", async (req, res) => {
  // parse all artilces from db
  const articles = await Article.find();
  // render profile.ejs
  // console.log(articles);
  res.render("profile", { articles: articles });
});

router.get("/edit/:id", async (req, res) => {
  //   const categories = await Category.find();
  try {
    const article = await Article.findById(req.params.id);
    res.render("edit", { article: article });
  } catch (error) {
    res.render("error");
  }
});

//router for profile page
router.get("/profile", async (req, res) => {
  res.render("profile");
});

router.get("/read/:id", async (req, res) => {
  //   const categories = await Category.find();
  try {
    const article = await Article.find({ _id: req.params.id });
    if (article) {
      res.render("show", { article: article[0] });
    }
  } catch (error) {
    res.render("error");
  }
});

router.post("/", async (req, res) => {
  let article = new Article({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    content: req.body.content,
    link: req.body.link,
    createdAt: new Date(),
    image: req.body.image,
  });
  try {
    article = await article.save();
    res.redirect(`/read/${article.id}`);
  } catch (error) {
    res.redirect("/new", { article: article });
  }
});

router.post("/new-article", async (req, res) => {
  let article = new Article(req.body);
  try {
    article = await article.save();
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.patch("/edit/:id", async (req, res) => {
  // console.log(req.body);
  try {
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );
    //?update=true
    if (article) {
      // res.redirect(`/profile/`);
      res.redirect(`/profile/#${article._id}`);
    } else res.status(404).send();
  } catch (error) {
    res.render("error");
  }
});



router.delete("/delete/:id", async (req, res) => {
  // console.log(req.params.id);
  try {
    const article = await Article.findOneAndDelete({ _id: req.params.id });
    if (article) {
      res.redirect("/profile");
    } else {
      res.status(404);
    }
  } catch (error) {
    // const categories = await Category.find();
    res.render("error");
  }
});


export default router;
