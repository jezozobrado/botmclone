const express = require("express");
const Cart = require("../models/cart");
const { User } = require("../models/user");
const { Book } = require("../models/book");
const router = express.Router();

//get all carts
router.get("/", async (req, res) => {
  const carts = await Cart.find()
    .populate("books", "title -_id")
    .populate("customer", "firstName")
    .select("books customer");

  res.send(carts);
});

//retrieving items
router.get("/:customerId", async (req, res) => {
  if (!req.params.customerId) return res.status(400).send("No cart.");

  let cart = await Cart.findOne({ customer: req.params.customerId })
    .populate("books", "title author image _id slug")
    .populate("customer", "firstName")
    .select("books customer");

  if (!cart) {
    cart = new Cart({
      customer: req.params.customerId,
      books: [],
    });
    await cart.save();
  }

  res.send(cart);
});

//adding item
router.post("/", async (req, res) => {
  //check if customer is authenticated.
  const customer = await User.findOne({ _id: req.body.customer });
  if (!customer) return res.status(400).send("Customer does not exist!");

  //check if book is valid
  let book = await Book.findOne({ _id: req.body.book._id });
  if (!book) return res.status(400).send("Book does not exist!");

  //retrieve cart
  const cart = await Cart.findOne({ customer: req.body.customer })
    .populate("books", "title author image _id")
    .populate("customer", "firstName")
    .select("books customer");

  if (cart.books && cart.books.length < 3) {
    //check if more than 3 books
    cart.books.push(book);
    await cart.save();
    res.send(cart);
  } else {
    res.status(400).send("Cart exceeds 3 books.");
  }
});

//removing item
router.post("/:customerId/:bookId", async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { customer: req.params.customerId },
    { $pull: { books: req.params.bookId } },
    { new: true }
  );

  res.status(200).send(cart);
});

module.exports = router;
