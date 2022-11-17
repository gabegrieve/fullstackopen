const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("secret", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });

  test("creation succeeds with new user", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "gabegrieve",
      name: "Gabe Grieve",
      password: "gaberules",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails if the new username already exists", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "root",
      name: "Sneaky boi",
      password: "1234",
    };
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("username must be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});
