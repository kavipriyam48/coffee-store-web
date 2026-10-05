export type CoffeeCategory =
  | 'all'
  | 'espresso'
  | 'filter'
  | 'cold_brew'
  | 'tea_specialty'
  | 'bakery'
  | 'beans';

export type CupSize = '8oz' | '12oz' | '16oz' | 'standard';

export type MilkOption =
  | 'whole'
  | 'oat'
  | 'almond'
  | 'macadamia'
  | 'heavy_cream'
  | 'none';

export type SyrupOption =
  | 'none'
  | 'vanilla'
  | 'cardamom_honey'
  | 'smoked_caramel'
  | 'lavender';

export type BeanOrigin =
  | 'ethiopia_guji'
  | 'colombia_huila'
  | 'costa_rica_honey'
  | 'house_roast'
  | 'swiss_water_decaf';

export type TemperatureOption = 'hot' | 'extra_hot' | 'iced_cube' | 'nitro';

export interface CustomizationOptions {
  size: CupSize;
  milk: MilkOption;
  syrup: SyrupOption;
  bean: BeanOrigin;
  temperature: TemperatureOption;
  extraShots: number;
  specialInstructions: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: CoffeeCategory;
  price: number;
  description: string;
  originNotes?: string;
  tastingNotes?: string[];
  imageUrl: string;
  badge?: string;
  isCustomizable: boolean;
  calories?: number;
  dietary?: ('dairy_free' | 'gluten_free' | 'vegan' | 'organic' | 'decaf_available')[];
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  customization?: CustomizationOptions;
  quantity: number;
  calculatedPrice: number;
}

export type OrderType = 'pickup' | 'dine_in' | 'curbside';

export type OrderStatus = 'queued' | 'dialing_in' | 'brewing' | 'ready' | 'completed';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  orderType: OrderType;
  tableNumber?: string;
  pickupTime: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tip: number;
  total: number;
  status: OrderStatus;
  createdAt: number;
  estimatedMinutes: number;
}

export interface BeanProfile {
  id: string;
  name: string;
  region: string;
  altitude: string;
  process: string;
  roastLevel: 'Light' | 'Medium-Light' | 'Medium' | 'Medium-Dark';
  flavorProfile: string[];
  recommendedMethod: string;
  description: string;
  pricePerBag: number; // 250g
  imageUrl: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  guests: number;
  type: 'table' | 'tasting_flight';
  specialRequests?: string;
  createdAt: number;
}
