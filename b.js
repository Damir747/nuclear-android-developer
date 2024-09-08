class Cache {
	constructor(maxSize = 5) {
		this.maxSize = maxSize; // Максимальный размер кэша
		this.cache = new Map(); // Храним кэшированные данные
	}

	// Метод для получения данных профиля
	async getUserProfile(userId) {
		// Проверяем, есть ли данные в кэше
		if (this.cache.has(userId)) {
			// Перемещаем профиль на последнее место (обновляем порядок)
			const profile = this.cache.get(userId);
			this.cache.delete(userId); // Удаляем старую запись
			this.cache.set(userId, profile); // Добавляем новую запись (перемещаем в конец)
			return profile;
		}

		// Если данных нет в кэше, загружаем их с сервера
		const profileData = await this._fetchUserProfileFromServer(userId);

		// Кэшируем данные
		this._cacheUserProfile(userId, profileData);

		return profileData;
	}

	// Метод загрузки данных с "сервера" (симуляция)
	async _fetchUserProfileFromServer(userId) {
		console.log(`Загрузка профиля пользователя с сервера: ${userId}`);
		// Симуляция задержки загрузки данных с сервера
		await new Promise(resolve => setTimeout(resolve, 500));

		// Возвращаем тестовые данные
		return {
			userId: userId,
			name: `User: ${userId}`,
			penisSize: Math.floor(Math.random() * 20) + 5
		};
	}

	// Метод для добавления данных в кэш
	_cacheUserProfile(userId, profileData) {
		// Если кэш заполнен, удаляем самый старый элемент (первый добавленный)
		if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value;
			this.cache.delete(firstKey);
		}
		this.cache.set(userId, profileData);
	}
}

// Пример использования:

async function main() {
	const cache = new Cache(3); // Создаем кэш с максимальным размером 3

	console.log(await cache.getUserProfile("dude1")); // Загрузка с сервера
	console.log(await cache.getUserProfile("dude2")); // Загрузка с сервера
	console.log(await cache.getUserProfile("dude1")); // Из кэша
	console.log(await cache.getUserProfile("dude3")); // Загрузка с сервера
	console.log(await cache.getUserProfile("dude4")); // Загрузка с сервера, кэш будет переполнен

	console.log(await cache.getUserProfile("dude2")); // Загрузка с сервера (удален из кэша)
	console.log(await cache.getUserProfile("dude3")); // Из кэша
	console.log(await cache.getUserProfile("dude1")); // Загрузка с сервера (удален из кэша)
}

main();
