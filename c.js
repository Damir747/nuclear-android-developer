class Place {
	constructor(lat, lon, type, rating, name = "", visited = false) {
		this.lat = lat; // широта
		this.lon = lon; // долгота
		this.type = type; // тип объекта (например, "кофейня")
		this.rating = rating; // рейтинг (число от 1 до 5)
		this.name = name;
		this.visited = visited; // флаг посещения
	}
}

class CoffeeFinder {
	constructor(places) {
		this.places = places; // список всех объектов (мест)
	}

	// Метод для вычисления расстояния между двумя точками с использованием формулы Хаверсина
	_calculateDistance(lat1, lon1, lat2, lon2) {
		const R = 6371; // радиус Земли в километрах
		const dLat = this._degreesToRadians(lat2 - lat1);
		const dLon = this._degreesToRadians(lon2 - lon1);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this._degreesToRadians(lat1)) *
			Math.cos(this._degreesToRadians(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // расстояние в километрах
	}

	// Вспомогательный метод для перевода градусов в радианы
	_degreesToRadians(degrees) {
		return (degrees * Math.PI) / 180;
	}

	// Основной метод для поиска ближайших кофеен
	findNearestCafes(userLat, userLon, minRating, visitedPlaces, limit = 3) {
		// Фильтрация: оставляем только кофейни с рейтингом выше заданного и которые не были посещены
		const filteredPlaces = this.places
			.filter(
				(place) =>
					place.type === "кофейня" &&
					place.rating >= minRating &&
					!visitedPlaces.includes(place)
			)
			// Вычисляем расстояние от текущего местоположения пользователя до каждого объекта
			.map((place) => {
				const distance = this._calculateDistance(
					userLat,
					userLon,
					place.lat,
					place.lon
				);
				return { ...place, distance };
			})
			// Сортируем объекты по возрастанию расстояния
			.sort((a, b) => a.distance - b.distance);

		// Возвращаем три ближайшие кофейни
		return filteredPlaces.slice(0, limit);
	}
}

// Пример использования:
// 
const places = [
	new Place(55.648179, 37.652220, "кофейня", 4.5, "1511"),
	new Place(55.655193, 37.530419, "кофейня", 4.9, "Столовая Время Есть!"),
	new Place(55.648179, 37.652220, "ресторан", 4.0, "Психушка"),
	new Place(55.760244, 37.621423, "кофейня", 3.9),
	new Place(55.645082, 37.651545, "кофейня", 4.8, "Общага"),
	new Place(55.756244, 37.617423, "кофейня", 4.6),
	new Place(55.755244, 37.614423, "кофейня", 4.9),
];

const userLocation = { lat: 55.648947, lon: 37.667587 }; // Текущие координаты пользователя: корпус К
const visitedPlaces = [places[5, 6]]; // Массив посещенных мест (например, кофейня с индексом 5 и 6)
const minRating = 4.5; // Минимальный допустимый рейтинг

const coffeeFinder = new CoffeeFinder(places);
const nearestCafes = coffeeFinder.findNearestCafes(
	userLocation.lat,
	userLocation.lon,
	minRating,
	visitedPlaces
);

console.log('Лучшие кофейни:');
console.log(nearestCafes);

// Больше кофеен, так как рейтинг снижен
console.log('Кофейни 4.0:');
console.log(coffeeFinder.findNearestCafes(userLocation.lat, userLocation.lon, 4.0, visitedPlaces));
// Найдет только кофейни с рейтингом 4.9
console.log('Кофейни 4.9:');
console.log(coffeeFinder.findNearestCafes(userLocation.lat, userLocation.lon, 4.9, visitedPlaces));
