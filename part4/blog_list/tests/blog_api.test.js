const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

let token = "";

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("secret", 10);
  const user = new User({ username: "root", passwordHash });
  await user.save();
  const response = await api
    .post("/api/login/")
    .send({ username: "root", password: "secret" });
  token = response.body.token;
});

describe("when there are some initial blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("a specific blog is returned", async () => {
    const response = await api.get("/api/blogs");
    const titles = response.body.map((r) => r.title);
    expect(titles).toContain("Gabes cool blog");
  });

  test("all blog posts have the id property", async () => {
    const response = await api.get("/api/blogs");
    const id = response.body.map((r) => expect(r.id).toBeDefined());
  });
});

describe("Adding a new blog post", () => {
  test("creating a blog without authentication returns 401", async () => {
    const newBlog = {
      title: "A new blog post",
      author: "Billy Bob",
      url: "https://google.com",
      likes: 0,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "A new blog post",
      author: "Billy Bob",
      url: "https://google.com",
      likes: 0,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const titles = blogsAtEnd.map((n) => n.title);
    expect(titles).toContain("A new blog post");
  });

  test("a blog with no title cannot be added", async () => {
    const newBlog = {
      author: "Some Guy",
      url: "http://google.com",
      likes: 80,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("a blog with no url cannot be added", async () => {
    const newBlog = {
      title: "Blog with no URL",
      author: "Some Guy",
      likes: 80,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("a blog with no likes defaults to 0", async () => {
    const newBlog = {
      title: "Test blog no likes",
      url: "http://google.com",
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(201);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toEqual(0);
  });
});

describe("interacting with an existing blog item", () => {
  test("A specific blog can be viewed", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];
    const resultNote = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));
    expect(resultNote.body).toEqual(processedBlogToView);
  });

  test("A blog can be deleted", async () => {
    const newBlog = {
      title: "A new blog post",
      author: "Root User",
      url: "https://google.com",
      likes: 0,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAfterCreate = await helper.blogsInDb();
    const blogToDelete = blogsAfterCreate[blogsAfterCreate.length - 1];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(204);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAfterCreate.length - 1);
  });

  test("A blog can be updated", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const initialLikes = blogToUpdate.likes;
    const updatedBlog = {
      likes: initialLikes + 1,
    };
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `bearer ${token}`)
      .send(updatedBlog)
      .expect(200);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0].likes).toEqual(initialLikes + 1);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
