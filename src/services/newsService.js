const axios = require('axios');

async function getNews(searchQuery) {
  const response = await axios.get('https://newsapi.org/v2/everything', {
    params: {
      q: searchQuery,
      apiKey: process.env.NEWS_API_KEY,
      pageSize: 12,
      language: 'ru',
      sortBy: 'publishedAt'
    }
  });
  
  return response.data.articles;
}

module.exports = { getNews };