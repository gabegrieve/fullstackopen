const { forEach } = require("lodash");
const _ = require("lodash");

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

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => {
    return blog.author;
  });

  const countedBlogs = _.countBy(authors);
  const sortedBlogs = _(countedBlogs)
    .toPairs()
    .orderBy(1, "desc")
    .fromPairs()
    .value();

  const authorWithMostBlogs = {
    author: Object.keys(sortedBlogs)[0],
    blogs: Object.values(sortedBlogs)[0],
  };
  console.log(authorWithMostBlogs);

  return authorWithMostBlogs;
};

const mostLikes = (blogs) => {
  const authors = blogs.map((blog) => {
    return blog.author;
  });
  const uniqAuthors = _.uniq(authors);

  const authorLikes = uniqAuthors.map((author) => {
    const likes = blogs.reduce((sum, blog) => {
      if (blog.author === author) {
        return (sum += blog.likes);
      } else {
        return sum;
      }
    }, 0);
    return {
      author: author,
      likes: likes,
    };
  });

  const authorWithMostLikes = authorLikes.reduce((initial, author) => {
    if (initial.likes >= author.likes) {
      return initial;
    } else {
      return author;
    }
  });

  return authorWithMostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
