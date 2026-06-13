# NewsFlow

Сайт с новостями

![Аркади Алехно](images/arkadialehno.jpg)

## Запуск

```bash
git clone https://github.com/yuokkotsu/NewsFlow.git
cd NewsFlow
npm install
```

![без вопросов.](images/bratroberta.jpg)

## Ключ для новостей

1. Зарегистрируйся на https://newsapi.org/register
2. Скопируй API ключ из личного кабинета
3. Создай в корне проекта файл `.env`
4. Вставь туда:

```bash
NEWS_API_KEY=твой_скопированный_ключ
PORT=3000
```

![да](images/....jpg)

## Открыть сайт

```bash
npm run dev 
```
http://localhost:3000

Ну или по ссылке:https://newsflow-9p9o.onrender.com

![владоса добавить захотелось](images/vlad.jpg)

## Структура сайта

```bash
- `src/services/`    - запросы к NewsAPI
- `src/controllers/` - обработка запросов
- `src/routes/`      - маршруты
- `public/`          - HTML, CSS, JS
- `.env.example`     - пример переменных окружения
```