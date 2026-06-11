const axios = require('axios');

async function getNews(searchQuery) {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: searchQuery,
        apiKey: process.env.NEWS_API_KEY,
        pageSize: 12,
        language: 'ru',
      },
    });

    if (response.data.status === 'error') {
      throw new Error(`NewsAPI Error: ${response.data.message}`);
    }

    return response.data.articles;
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data);
      throw new Error(`Ошибка API: ${error.response.status} - ${error.response.data.message || error.message}`);
    }
    throw new Error(`Не удалось загрузить новости: ${error.message}`);
  }
}

module.exports = { getNews };