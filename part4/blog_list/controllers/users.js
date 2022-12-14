const bcyrpt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    likes: 1,
    url: 1,
  });
  response.json(users);
});

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return response.status(400).json({
      error: "username must be unique",
    });
  }

  if (password.length <= 2) {
    return response.status(400).json({
      error: "passwords must be at least 3 characters long",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcyrpt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });
  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;
