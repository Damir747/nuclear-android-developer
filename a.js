class Screen {
	constructor(id, children = []) {
		this.id = id;
		this.children = children;
	}
}

class ScreenNavigator {
	constructor(rootScreen) {
		this.rootScreen = rootScreen;
		this.cache = new Map(); // Кэш для хранения найденных экранов по их id
	}

	findScreenById(id) {
		// Проверяем, есть ли уже результат в кэше
		if (this.cache.has(id)) {
			return this.cache.get(id);
		}

		// Поиск по дереву экранов
		const screen = this._findScreenRecursive(this.rootScreen, id);

		// Кэшируем результат
		if (screen) {
			this.cache.set(id, screen);
		}

		return screen;
	}

	_findScreenRecursive(screen, id) {
		if (screen.id === id) {
			return screen;
		}

		for (const child of screen.children) {
			const result = this._findScreenRecursive(child, id);
			if (result) {
				return result;
			}
		}

		return null; // Экран не найден
	}
}

const screenA = new Screen(1);
const screenB = new Screen(2, [screenA]);
const screenC = new Screen(3, [screenA]);
const screenD = new Screen(4, [screenB, screenC]);

const navigator = new ScreenNavigator(screenD);

console.log(navigator.findScreenById(1)); // ScreenA
console.log(navigator.findScreenById(2)); // ScreenB
console.log(navigator.findScreenById(34)); // null
console.log(navigator.findScreenById(3)); // ScreenC
console.log(navigator.findScreenById(4)); // ScreenD
