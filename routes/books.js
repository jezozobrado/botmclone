const express = require("express");
const router = express.Router();
const lodash = require("lodash");
const { Book, validate } = require("../models/book");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const books = await Book.find({
    defaultCategory: new RegExp(".*" + req.query.defaultCategory + ".*", "i"),
  })
    .or([
      { title: new RegExp(".*" + req.query.searchText + ".*", "i") },
      { mainGenre: new RegExp(".*" + req.query.searchText + ".*", "i") },
      { author: new RegExp(".*" + req.query.searchText + ".*", "i") },
    ])
    .sort(req.query.ordering)
    .skip((req.query.pageNumber - 1) * req.query.pageSize)
    .limit(req.query.pageSize);

  const count = await Book.find({
    defaultCategory: new RegExp(".*" + req.query.defaultCategory + ".*", "i"),
  })
    .or([
      { title: new RegExp(".*" + req.query.searchText + ".*", "i") },
      { mainGenre: new RegExp(".*" + req.query.searchText + ".*", "i") },
      { author: new RegExp(".*" + req.query.searchText + ".*", "i") },
    ])
    .count();

  if (!books) return res.status(400).send("Books do not exist.");

  res.send({
    books: books,
    hasNextPage: parseInt(req.query.pageSize * req.query.pageNumber) < count,
    hasPreviousPage: parseInt(req.query.pageNumber) !== 1,
  });
});

router.get("/:slug", async (req, res) => {
  const book = await Book.find({ slug: req.params.slug });
  if (!book) return res.status(404).send("Book does not exist.");
  res.send(book);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  book = new Book(
    lodash.pick(req.body, [
      "title",
      "slug",
      "abstract",
      "author",
      "price",
      "defaultCategory",
      "description",
      "image",
      "isInStock",
      "mainGenre",
      "synopsis",
    ])
  );

  await book.save();
  res.send(lodash.pick(book, ["title", "abstract"]));
});

module.exports = router;
