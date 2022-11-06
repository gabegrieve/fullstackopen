const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => {
    return (sum += blog.likes);
  }, 0);
  return total;
};

const favouriteBlog = (blogs) => {
  const reducer = (previousBlog, currentBlog) => {
    if (currentBlog.likes >= previousBlog.likes) {
      return currentBlog;
    } else {
      return previousBlog;
    }
  };
  const reducedOutput = blogs.reduce(reducer);
  const formattedBlog = {
    title: reducedOutput.title,
    author: reducedOutput.author,
    likes: reducedOutput.likes,
  };
  return formattedBlog;
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
};
