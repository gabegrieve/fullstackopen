import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem("loggedInBlogUser");
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      setUsername("");
      setPassword("");
      window.localStorage.setItem("loggedInBlogUser", JSON.stringify(user));
      console.log("Logged in");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    setUser(null);
    window.localStorage.removeItem("loggedInBlogUser");
  };

  const Notification = ({ message }) => {
    const style = {
      color: "red",
    };
    return (
      <>
        <div style={style}>{message}</div>
      </>
    );
  };

  const UserMessage = ({ name }) => {
    return (
      <>
        <div>Logged in as {name}</div>
      </>
    );
  };

  if (user === null) {
    return (
      <div>
        <h2>Login</h2>
        <Notification message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            <span>Username</span>
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <span>Password</span>
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <UserMessage name={user.name} />
      <button onClick={handleLogout}>Log out</button>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
