const { getNews } = require('../services/newsService');

async function searchNews(req, res) {
  try {
    const searchQuery = req.query.q;
    
    if (!searchQuery) {
      return res.status(400).json({ error: 'Введите текст для поиска' });
    }
    
    const articles = await getNews(searchQuery);
    res.json(articles);
    
  } catch (error) {
    console.error('Ошибка:', error.message);
    res.status(500).json({ error: 'Не удалось загрузить новости' });
  }
}

module.exports = { searchNews };