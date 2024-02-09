const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const url = "mongodb://localhost:27017/blog_db";

const schema = mongoose.Schema({
  title: String,
  content: String,
  author: String,
  publication_date: String,
});

const Blog = new mongoose.model("blog", schema, "blog");

try {
  mongoose.connect(url);

  listDatabases();
} catch (e) {
  console.error(e);
  console.log(2);
}

app.use(express.json());

async function listDatabases() {
  try {
    const result = await Blog.find({});
    return result;
  } catch (e) {
    console.log(e);
  }
}

app.get("/blogs", (req, res) => {
  listDatabases().then((result) => res.json(result));
});

app.get("/blogs/:id", async (req, res) => {
  const result = await Blog.find({ _id: req.params.id });
  res.status(201).json(result);
});

app.post("/blogs", async (req, res) => {
  const body = new Blog(req.body);

  try {
    const newBlog = await body.save();
    res.status(201).json(newBlog);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.delete("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    res.status(201).json(blog);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.put("/blogs", async (req, res) => {
  const newBlog = {
    title: req.body.title,
    author: req.body.author,
    content: req.body.content,
  };
  try {
    const blog = await Blog.findByIdAndUpdate(req.body.id, newBlog, {
      new: true,
    });
    res.status(201).json(blog);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
