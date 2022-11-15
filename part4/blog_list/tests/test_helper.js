const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Gabes cool blog",
    author: "Gabe Grieve",
    url: "http://gabegrieve.com",
    likes: 90,
  },
  {
    title: "How to get good at code",
    author: "Codes McGee",
    url: "http://envato.com",
    likes: 65,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: "willremovethissoon" });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
