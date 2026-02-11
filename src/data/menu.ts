export interface MenuVariant {
  volume: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  volume?: string;
  price?: number;
  variants?: MenuVariant[];
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
  { id: "tea", name: "Чай", variants: [{ volume: "75мл", price: 3000 }, { volume: "100мл", price: 5000 }], category: "hot-drinks" },
  { id: "chai-karak", name: "Чай Карак", variants: [{ volume: "75мл", price: 6000 }, { volume: "100мл", price: 12000 }], category: "hot-drinks" },
  { id: "chai-masala", name: "Чай Масала", variants: [{ volume: "75мл", price: 6000 }, { volume: "100мл", price: 12000 }], category: "hot-drinks" },
  { id: "chai-cardamon", name: "Чай Кардамон", variants: [{ volume: "75мл", price: 6000 }, { volume: "100мл", price: 12000 }], category: "hot-drinks" },
  { id: "chai-safrom", name: "Чай Сафром", variants: [{ volume: "75мл", price: 6000 }, { volume: "100мл", price: 12000 }], category: "hot-drinks" },
  { id: "tea-lemon", name: "Чай с лимоном", price: 10000, category: "hot-drinks" },
  { id: "tea-raspberry", name: "Чай с малиной", price: 15000, category: "hot-drinks" },
  { id: "coffee-3in1", name: "Кофе 3в1", volume: "0.4л", price: 6000, category: "hot-drinks" },
  { id: "coffee-chocolate", name: "Кофе с шоколадом", price: 6000, category: "promo" },
  { id: "latte", name: "Латте", price: 0, category: "hot-drinks" },
  { id: "cappuccino", name: "Капучино", price: 0, category: "hot-drinks" },
  { id: "espresso", name: "Эспрессо", price: 0, category: "hot-drinks" },
  { id: "americano", name: "Американо", price: 0, category: "hot-drinks" },
  { id: "cocoa", name: "Какао", price: 0, category: "hot-drinks" },

  // Холодные напитки
  { id: "mojito", name: "Мохито", price: 0, category: "cold-drinks" },
  { id: "mojito-strawberry", name: "Мохито клубничный", price: 0, category: "cold-drinks" },
  { id: "raspberry-passionfruit", name: "Малина Маракуя", price: 0, category: "cold-drinks" },

  // Завтраки
  { id: "scramble", name: "Скрембл", price: 20000, category: "breakfast" },
  { id: "shakshuka", name: "Шакшука", price: 28000, category: "breakfast" },
  { id: "omelet", name: "Омлет", price: 20000, category: "breakfast" },
  { id: "english-breakfast", name: "Английский завтрак", price: 34000, category: "breakfast" },
  { id: "french-breakfast", name: "Французский завтрак", price: 34000, category: "breakfast" },
  { id: "soviet-breakfast", name: "Советский завтрак", price: 15000, category: "breakfast" },
  { id: "pp-breakfast", name: "ПП-Завтрак", price: 15000, category: "breakfast" },
  { id: "pancakes", name: "Блины", price: 6000, category: "breakfast", description: "с творогом / нутеллой / вареньем" },
  { id: "syrniki", name: "Сырники", price: 0, category: "breakfast" },
  { id: "potato-pies", name: "Пирожки с картошкой", price: 5000, category: "breakfast" },
  { id: "meat-pies", name: "Пирожки с мясом", price: 8000, category: "breakfast" },
  { id: "croissants", name: "Круассаны", price: 35000, category: "breakfast", description: "с ветчиной / индейкой" },
  { id: "sausages-in-dough", name: "Сосиски в тесте", price: 10000, category: "breakfast", description: "с ветчиной / индейкой" },

  // Фаст-фуд
  { id: "hamburger", name: "Гамбургер", price: 35000, category: "fastfood" },
  { id: "tochka-burger", name: "Точка Бургер", price: 38000, category: "fastfood" },
  { id: "nuggets", name: "Наггетсы", price: 0, category: "fastfood" },
  { id: "strips", name: "Стрипсы", price: 23000, category: "fastfood" },
  { id: "hotdog", name: "Хот-дог", price: 18000, category: "fastfood" },
  { id: "pita", name: "Лаваш", price: 26000, category: "fastfood" },

  // Десерты
  { id: "pryaniki", name: "Пряники", price: 0, category: "desserts" },
  { id: "vienna-waffles", name: "Венские вафли", price: 0, category: "desserts", description: "с нутеллой / бананом / клубникой" },
  { id: "san-sebastian", name: "Сан-Себастьян", price: 0, category: "desserts" },
  { id: "buns", name: "Булочки", price: 8000, category: "desserts" },
  { id: "zebra", name: "Зерба", price: 6000, category: "desserts" },
    
  // Акции
    { id: "bun+coffee/tea", name: "Зебра + кофе чай", price: 10000, category: "promo" },
    { id: "zebra+coffee/tea", name: "Булочка + кофе чай", price: 10000, category: "promo" },
];



// Helper: get the effective price and volume for a cart key like "tea::0" or "scramble"
export function parseCartKey(key: string): { itemId: string; variantIndex?: number } {
  const parts = key.split("::");
  return {
    itemId: parts[0],
    variantIndex: parts[1] !== undefined ? parseInt(parts[1], 10) : undefined,
  };
}

export function makeCartKey(itemId: string, variantIndex?: number): string {
  return variantIndex !== undefined ? `${itemId}::${variantIndex}` : itemId;
}

export function getItemPrice(item: MenuItem, variantIndex?: number): number {
  if (item.variants && variantIndex !== undefined) {
    return item.variants[variantIndex].price;
  }
  return item.price ?? 0;
}

export function getItemVolume(item: MenuItem, variantIndex?: number): string {
  if (item.variants && variantIndex !== undefined) {
    return item.variants[variantIndex].volume;
  }
  return item.volume ?? "";
}
