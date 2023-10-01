const express = require('express');
const axios = require('axios'); // We'll use Axios for making HTTP requests
const _ = require('lodash'); // Lodash is a utility library for working with data

const app = express(); // Initialize an Express application
const PORT = process.env.PORT || 3000; // Define the port for the server

// Middleware for fetching and analyzing blog data
app.get('/api/blog-stats', async (req, res) => {
  try {
    // Make a request to a third-party blog API to fetch data
    const response = await axios.get('https://api.example.com/blogs');
    const blogData = response.data; // Store the fetched blog data in a variable

    // Calculate analytics using Lodash
    const totalBlogs = blogData.length; // Count the total number of blogs
    const longestBlog = _.maxBy(blogData, 'title'); // Find the blog with the longest title
    const blogsWithPrivacy = _.filter(blogData, (blog) =>
      _.includes(_.toLower(blog.title), 'privacy')
    ); // Determine the number of blogs with titles containing "privacy"
    const uniqueTitles = _.uniq(_.map(blogData, 'title')); // Create an array of unique blog titles

    // Respond with analytics as JSON
    res.json({
      totalBlogs,
      longestBlog: longestBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueTitles,
    });
  } catch (error) {
    // Handle errors, e.g., if the API is unavailable
    console.error('Error fetching or analyzing blog data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Blog search endpoint
app.get('/api/blog-search', (req, res) => {
  const { query } = req.query; // Get the query parameter from the request URL

  if (!query) {
    // Check if the query parameter is missing
    return res.status(400).json({ error: 'Query parameter "query" is required' });
  }

  try {
    // Filter blogs based on the query (case-insensitive)
    const filteredBlogs = _.filter(blogData, (blog) =>
      _.includes(_.toLower(blog.title), _.toLower(query))
    );

    res.json(filteredBlogs); // Respond with the filtered blogs
  } catch (error) {
    console.error('Error performing blog search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Start the server and log the port
});
