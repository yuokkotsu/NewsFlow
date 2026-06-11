// DOM элементы
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const newsContainer = document.getElementById('newsContainer');
const savedContainer = document.getElementById('savedContainer');

// Функция показа уведомления
function showNotification(message, isError = false) {
    // Создаём элемент уведомления
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${isError ? '#ef4444' : '#22c55e'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    // Через 2 секунды удаляем
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Получить избранное из localStorage
function getFavorites() {
    const saved = localStorage.getItem('favoriteNews');
    return saved ? JSON.parse(saved) : [];
}

// Сохранить в избранное
function addToFavorites(article) {
    const favorites = getFavorites();
    const exists = favorites.some(fav => fav.url === article.url);
    
    if (!exists) {
        favorites.push(article);
        localStorage.setItem('favoriteNews', JSON.stringify(favorites));
        showNotification('✅ Новость сохранена в избранное!');
        renderFavorites();
        
        // Подсветка новой новости в избранном
        setTimeout(() => {
            const firstArticle = savedContainer?.firstElementChild;
            if (firstArticle) {
                firstArticle.style.transition = 'background 0.5s';
                firstArticle.style.background = '#fef9c3';
                setTimeout(() => {
                    firstArticle.style.background = 'white';
                }, 1000);
            }
        }, 100);
    } else {
        showNotification('⚠️ Эта новость уже в избранном', true);
    }
}

// Удалить из избранного
function removeFromFavorites(articleUrl) {
    let favorites = getFavorites();
    const wasRemoved = favorites.some(fav => fav.url === articleUrl);
    
    favorites = favorites.filter(fav => fav.url !== articleUrl);
    localStorage.setItem('favoriteNews', JSON.stringify(favorites));
    
    if (wasRemoved) {
        showNotification('🗑 Новость удалена из избранного');
    }
    
    renderFavorites();
}

// Отобразить избранное
function renderFavorites() {
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
        savedContainer.innerHTML = '<div class="empty-message">⭐ Нет сохранённых новостей</div>';
        return;
    }
    
    savedContainer.innerHTML = favorites.map(article => `
        <div class="article">
            <h3>${escapeHtml(article.title) || 'Без заголовка'}</h3>
            <p>${escapeHtml(article.description) || 'Описание отсутствует'}</p>
            ${article.url ? `<a href="${article.url}" target="_blank">Читать →</a>` : ''}
            <button onclick="window.removeFromFavorites('${article.url}')">🗑 Удалить</button>
        </div>
    `).join('');
}

// Вспомогательная функция для защиты от XSS
function escapeHtml(text) {
    if (!text) return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Поиск новостей
searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('Введите текст для поиска');
        return;
    }
    
    newsContainer.innerHTML = '<div class="empty-message">⏳ Загрузка...</div>';
    
    try {
        const response = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error('Ошибка сервера');
        }
        
        const articles = await response.json();
        
        if (articles.length === 0) {
            newsContainer.innerHTML = '<div class="empty-message">😕 Ничего не найдено</div>';
            return;
        }
        
        newsContainer.innerHTML = articles.map(article => `
            <div class="article">
                <h3>${escapeHtml(article.title) || 'Без заголовка'}</h3>
                <p>${escapeHtml(article.description) || 'Описание отсутствует'}</p>
                ${article.url ? `<a href="${article.url}" target="_blank">Читать →</a>` : ''}
                <button onclick='window.addToFavorites(${JSON.stringify(article).replace(/'/g, "&#39;")})'>⭐ Сохранить</button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Ошибка:', error);
        newsContainer.innerHTML = '<div class="empty-message">❌ Ошибка загрузки. Проверьте интернет и ключ API</div>';
    }
});

// Делаем функции глобальными для вызова из HTML
window.addToFavorites = addToFavorites;
window.removeFromFavorites = removeFromFavorites;

// Загружаем избранное при старте
renderFavorites();