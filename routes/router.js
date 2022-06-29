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

// router.get('/:name',async (req,res)=>{
//     const categories= await Category.find()
//     try {
//         const articles= await Article.find({category:req.params.name}).sort({createdAt:"desc"})
//         let current=req.params.name;
//         let currentId=await Category.find({name:current});
//         currentId=String(currentId[0]._id);
//         res.render('category',{articles:articles,categories:categories,current:current,currentId:currentId})
//     } catch (error) {
//         res.render('error',{categories:categories})
//     }
// })

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

router.patch("/:id", async (req, res) => {
  try {
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );
    if (article) {
      res.redirect(`/read/${article._id}`);
    } else res.status(404).send();
  } catch (error) {
    // const categories = await Category.find();
    res.render("error");
  }
});

// router.patch("/category/:id", async (req, res) => {
//   try {
//     const currentCategory = await Category.find({ _id: req.params.id });
//     const currentName = currentCategory[0].name;
//     const category = await Category.findOneAndUpdate(
//       { _id: req.params.id },
//       req.body
//     );
//     if (category) {
//       let articles = await Article.find({ category: currentName });
//       for (let i = 0; i < articles.length; i++) {
//         articles[i].category = String(req.body.name);
//         articles[i] = await articles[i].save();
//       }
//       res.redirect("/");
//     } else res.status(404).send();
//   } catch (error) {
//     const categories = await Category.find();
//     res.render("error", { categories: categories });
//   }
//   /*const categories= await Category.find()
//     try {
//         const category=await Category.findOneAndUpdate({_id:req.params.id},req.params)
//         for(let i=0;i<=categories.length;i++){
//             const article=await Article.findOneAndUpdate({category:category.name},req.params)
//         }
//         if(category){
//             res.redirect('/')
//         }
//         else{
//             res.status(404)
//         }
//     } catch (error) {
//         res.render('error',{categories:categories})
//     }*/
// });

router.delete("/:id", async (req, res) => {
  try {
    const article = await Article.findOneAndDelete({ _id: req.params.id });
    if (article) {
      res.redirect("/");
    } else {
      res.status(404);
    }
  } catch (error) {
    // const categories = await Category.find();
    res.render("error");
  }
});

// router.delete("/category/:id", async (req, res) => {
//   const categories = await Category.find();
//   try {
//     const category = await Category.findOneAndDelete({ _id: req.params.id });
//     for (let i = 0; i < categories.length; i++) {
//       const article = await Article.findOneAndDelete({
//         category: category.name,
//       });
//     }
//     if (category) {
//       res.redirect("/");
//     } else {
//       res.status(404);
//     }
//   } catch (error) {
//     res.render("error", { categories: categories });
//   }
// });

export default router;
