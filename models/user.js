const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, min: 5, max: 50 },
  lastName: { type: String, required: true, min: 5, max: 50 },
  email: { type: String, required: true, unique: true, min: 5, max: 50 },
  password: { type: String, required: true, min: 5, max: 50 },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, firstName: this.firstName },
    process.env.SECRET_KEY
  );
};

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().min(5).max(50).required(),
    lastName: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(user);
};

exports.User = User;
exports.validate = validateUser;
