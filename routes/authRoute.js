const express = require("express");
const bycrpt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/users");
const router = express.Router();
router.post("/", async (req, res) => {
  const body = req.body;
  const { error } = validateAuth(body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: body.email });
  if (!user) return res.status(400).send("Invalid Email");
  const validPassword = await bycrpt.compare(body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Password");
  const token = user.getAuthToken();
  res.status(200).send(token);
});
function validateAuth(user) {
  const schema = {
    email: Joi.string()
      .email()
      .max(255)
      .required(),
    password: Joi.string()
      .min(3)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}
module.exports = router;
