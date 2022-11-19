const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");

// const getTokenFrom = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
//     return authorization.substring(7);
//   }
//   return null;
// };

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const token = request.token;

  if (!token) {
    return response.status(400).json({
      error: "Missing token",
    });
  }
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({
      error: "token invalid",
    });
  }
  const user = await User.findById(decodedToken.id);

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  try {
    const savedBlog = await newBlog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  const token = request.token;
  const user = request.user;

  if (!token) {
    return response.status(400).json({
      error: "Missing token",
    });
  }

  if (!user) {
    return response.status(400).json({
      error: "No user",
    });
  }

  try {
    const blog = await Blog.findById(request.params.id).populate("user", {
      username: 1,
      name: 1,
    });
    if (blog.user.id === user) {
      try {
        await Blog.findByIdAndRemove(request.params.id);
        response.status(204).end();
      } catch (exception) {
        next(exception);
      }
    } else {
      response.status(400).json({
        error: "Unauthorized",
      });
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    });
    response.json(updatedBlog);
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
