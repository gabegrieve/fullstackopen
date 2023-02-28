import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
      blogService.setToken(user.token);
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

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    try {
      const newBlogObject = {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl,
        likes: 0,
      };
      blogService.setToken(user.token);
      const response = await blogService.create(newBlogObject);
      setSuccessMessage("Blog created successfully.");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (exception) {
      setErrorMessage(exception.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const Notification = ({ message, color }) => {
    const style = {
      color: color,
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

  const LoginForm = () => {
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
  };

  const BlogForm = () => {
    return (
      <div>
        <h2>Create a new blog</h2>
        <Notification message={errorMessage} color="red" />
        <Notification message={successMessage} color="green" />
        <form onSubmit={handleBlogSubmit}>
          <div>
            <span>Title:</span>
            <input
              type="text"
              value={blogTitle}
              name="title"
              onChange={({ target }) => setBlogTitle(target.value)}
            />
          </div>
          <div>
            <span>Author:</span>
            <input
              type="text"
              value={blogAuthor}
              name="author"
              onChange={({ target }) => setBlogAuthor(target.value)}
            />
          </div>
          <div>
            <span>Url:</span>
            <input
              type="text"
              value={blogUrl}
              name="url"
              onChange={({ target }) => setBlogUrl(target.value)}
            />
          </div>
          <button type="submit">Create new blog</button>
        </form>
      </div>
    );
  };

  const BlogList = () => {
    return (
      <>
        <h2>Blogs</h2>
        <UserMessage name={user.name} />
        <button onClick={handleLogout}>Log out</button>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </>
    );
  };

  return (
    <>
      {user !== null && BlogList()}
      {user === null ? LoginForm() : BlogForm()}
    </>
  );
};

export default App;
