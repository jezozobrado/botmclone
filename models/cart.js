const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  books: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Book",
    // required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
