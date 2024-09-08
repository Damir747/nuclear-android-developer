class Article {
	constructor(date, popularity, quartile, author) {
		this.date = new Date(date); // Дата публикации
		this.popularity = popularity; // Популярность (лайки)
		this.quartile = quartile; // Квартиль
		this.author = author; // Имя автора
	}
}

class ArticleManager {
	constructor(articles) {
		this.articles = articles; // Список статей
	}

	// Метод для фильтрации статей по автору, квартилю и году
	filterArticles({ author = null, minQuartile = null, year = null } = {}) {
		return this.articles.filter((article) => {
			const isAuthorMatch = author ? article.author === author : true;
			const isQuartileMatch = minQuartile ? article.quartile >= minQuartile : true;
			const isYearMatch = year ? article.date.getFullYear() === year : true;

			return isAuthorMatch && isQuartileMatch && isYearMatch;
		});
	}

	// Метод для сортировки статей по дате или популярности
	sortArticles({ sortBy = 'date', order = 'desc' } = {}) {
		return this.articles.sort((a, b) => {
			let compare = 0;

			if (sortBy === 'date') {
				compare = a.date - b.date;
			} else if (sortBy === 'popularity') {
				compare = a.popularity - b.popularity;
			}

			return order === 'asc' ? compare : -compare;
		});
	}

	// Метод для фильтрации и сортировки
	filterAndSortArticles(filterCriteria, sortCriteria) {
		const filteredArticles = this.filterArticles(filterCriteria);
		return this.sortArticles.call({ articles: filteredArticles }, sortCriteria);
	}
}

// Пример использования:

const articles = [
	new Article('2024-07-25', 150, 1, 'Замятин'),
	new Article('2023-05-12', 80, 2, 'Оруэлл'),
	new Article('2022-11-30', 200, 1, 'Бредберри'),
	new Article('2024-01-15', 120, 3, 'Замятин'),
	new Article('2023-09-22', 300, 1, 'Оруэлл'),
	new Article('2021-03-10', 250, 2, 'Бредберри'),
];

// Создаем менеджер статей
const articleManager = new ArticleManager(articles);

// Фильтруем статьи по автору 'Замятин' и минимальному квартилю 2
const filteredArticles = articleManager.filterAndSortArticles(
	{ author: 'Замятин', minQuartile: 2 }, // Фильтрация
	{ sortBy: 'date', order: 'desc' } // Сортировка по дате, по убыванию
);
console.log('Фильтрация по автору и сортировка по дате:');
console.log(filteredArticles);

console.log('Фильтрация по году и сортировка по популярности:');
console.log(
	articleManager.filterAndSortArticles(
		{ year: 2023 }, // Фильтрация по году
		{ sortBy: 'popularity', order: 'asc' } // Сортировка по популярности, по возрастанию
	)
);

console.log('Фильтрация по квартилю и сортировка по дате:');
console.log(
	articleManager.filterAndSortArticles(
		{ minQuartile: 2 }, // Фильтрация по квартилю
		{ sortBy: 'date', order: 'asc' } // Сортировка по дате, по возрастанию
	)
);
