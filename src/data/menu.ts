export interface MenuItem {
  id: string;
  name: string;
  volume: string;
  price: number;
  image?: string;
  category: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const categories: Category[] = [
  { id: "hot-drinks", name: "Горячие напитки", emoji: "☕" },
  { id: "cold-drinks", name: "Холодные напитки", emoji: "🥤" },
  { id: "breakfast", name: "Завтраки", emoji: "🍳" },
  { id: "fastfood", name: "Фаст-фуд", emoji: "🍔" },
  { id: "desserts", name: "Десерты", emoji: "🍰" },
  { id: "promo", name: "Акции", emoji: "🔥" },
];

export const menuItems: MenuItem[] = [
  // Горячие напитки
  { id: "tea-75", name: "Чай", volume: "75мл", price: 3000, category: "hot-drinks" },
  { id: "tea-100", name: "Чай", volume: "100мл", price: 5000, category: "hot-drinks" },
  { id: "chai-karak-75", name: "Чай Карак", volume: "75мл", price: 6000, category: "hot-drinks" },
  { id: "chai-karak-100", name: "Чай Карак", volume: "100мл", price: 12000, category: "hot-drinks" },
  { id: "chai-masala-75", name: "Чай Масала", volume: "75мл", price: 6000, category: "hot-drinks" },
  { id: "chai-masala-100", name: "Чай Масала", volume: "100мл", price: 12000, category: "hot-drinks" },
  { id: "chai-cardamon-75", name: "Чай Кардамон", volume: "75мл", price: 6000, category: "hot-drinks" },
  { id: "chai-cardamon-100", name: "Чай Кардамон", volume: "100мл", price: 12000, category: "hot-drinks" },
  { id: "tea-lemon", name: "Чай с лимоном", volume: "", price: 10000, category: "hot-drinks" },
  { id: "tea-raspberry", name: "Чай с малиной", volume: "", price: 15000, category: "hot-drinks" },
  { id: "coffee-3in1", name: "Кофе 3в1", volume: "0.4л", price: 6000, category: "hot-drinks" },
  { id: "latte", name: "Латте", volume: "", price: 0, category: "hot-drinks" },
  { id: "cappuccino", name: "Капучино", volume: "", price: 0, category: "hot-drinks" },
  { id: "espresso", name: "Эспрессо", volume: "", price: 0, category: "hot-drinks" },
  { id: "americano", name: "Американо", volume: "", price: 0, category: "hot-drinks" },
  { id: "cocoa", name: "Какао", volume: "", price: 0, category: "hot-drinks" },

  // Холодные напитки
  { id: "mojito", name: "Мохито", volume: "", price: 0, category: "cold-drinks" },
  { id: "mojito-strawberry", name: "Мохито клубничный", volume: "", price: 0, category: "cold-drinks" },
  { id: "raspberry-passionfruit", name: "Малина Маракуя", volume: "", price: 0, category: "cold-drinks" },

  // Завтраки
  { id: "scramble", name: "Скрембл", volume: "", price: 20000, category: "breakfast" },
  { id: "shakshuka", name: "Шакшука", volume: "", price: 28000, category: "breakfast" },
  { id: "omelet", name: "Омлет", volume: "", price: 20000, category: "breakfast" },
  { id: "english-breakfast", name: "Английский завтрак", volume: "", price: 34000, category: "breakfast" },
  { id: "french-breakfast", name: "Французский завтрак", volume: "", price: 34000, category: "breakfast" },
  { id: "soviet-breakfast", name: "Советский завтрак", volume: "", price: 15000, category: "breakfast" },
  { id: "sausage-pastry", name: "Сосиски в тесте", volume: "", price: 0, category: "breakfast" },
  { id: "pp-breakfast", name: "ПП-Завтрак", volume: "", price: 15000, category: "breakfast" },
  { id: "bliny", name: "Блины", volume: "", price: 0, category: "breakfast", description: "с мясом / творогом / нутеллой / вареньем" },
  { id: "syrniki", name: "Сырники", volume: "", price: 0, category: "breakfast" },
  { id: "croissants", name: "Круассаны", volume: "", price: 35000, category: "breakfast", description: "с ветчиной / индейкой" },

  // Фаст-фуд
  { id: "hamburger", name: "Гамбургер", volume: "", price: 35000, category: "fastfood" },
  { id: "tochka-burger", name: "Точка Бургер", volume: "", price: 38000, category: "fastfood" },
  { id: "hotdog", name: "Хот-дог", volume: "", price: 15000, category: "fastfood" },
  { id: "nuggets", name: "Наггетсы", volume: "", price: 0, category: "fastfood" },
  { id: "strips", name: "Стрипсы", volume: "", price: 23000, category: "fastfood" },

  // Десерты
  { id: "pryaniki", name: "Пряники", volume: "", price: 0, category: "desserts" },
  { id: "vienna-waffles", name: "Венские вафли", volume: "", price: 0, category: "desserts", description: "с нутеллой / бананом / клубникой" },
  { id: "san-sebastian", name: "Сан-Себастьян", volume: "", price: 0, category: "desserts" },
  { id: "buns", name: "Булочки", volume: "", price: 8000, category: "desserts" },

  // Акции (пока пусто — можно добавить позже)
];
