/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { DrinkCustomizerModal } from './components/DrinkCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { BaristaKDS } from './components/BaristaKDS';
import { BrewGuideSection } from './components/BrewGuideSection';
import { TableReservationModal } from './components/TableReservationModal';
import { LoyaltyPassportModal } from './components/LoyaltyPassportModal';
import { Footer } from './components/Footer';

import {
  MenuItem,
  CartItem,
  CustomizationOptions,
  Order,
  OrderStatus,
  Reservation,
} from './types/coffee';
import { MENU_ITEMS } from './data/coffeeData';
import { soundscape } from './utils/audioSynth';

export default function App() {
  // Navigation
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [customizerItem, setCustomizerItem] = useState<MenuItem | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);
  const [currentTrackedOrder, setCurrentTrackedOrder] = useState<Order | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState<boolean>(false);
  const [isPassportOpen, setIsPassportOpen] = useState<boolean>(false);
  const [isKDSOpen, setIsKDSOpen] = useState<boolean>(false);

  // Cart State (with localStorage persistence)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders State (with localStorage persistence + initial realistic queue)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('cs_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }

    // Default sample roastery orders
    return [
      {
        id: 'CS-8412',
        customerName: 'Elena Rostova',
        phone: '(555) 234-8901',
        orderType: 'pickup',
        pickupTime: 'Ready in ~3 min',
        items: [
          {
            cartItemId: 'seed-1',
            menuItem: MENU_ITEMS[0], // Flat White
            quantity: 1,
            calculatedPrice: 6.00,
            customization: {
              size: '12oz',
              milk: 'oat',
              syrup: 'none',
              bean: 'ethiopia_guji',
              temperature: 'hot',
              extraShots: 0,
              specialInstructions: 'velvet microfoam',
            },
          },
        ],
        subtotal: 6.00,
        discount: 0,
        tip: 1.00,
        total: 7.00,
        status: 'brewing',
        createdAt: Date.now() - 180000,
        estimatedMinutes: 3,
      },
      {
        id: 'CS-8415',
        customerName: 'Marcus Chen',
        phone: '(555) 671-4490',
        orderType: 'dine_in',
        tableNumber: 'Table 03',
        pickupTime: 'Ready in ~6 min',
        items: [
          {
            cartItemId: 'seed-2',
            menuItem: MENU_ITEMS[3], // V60 Pour Over
            quantity: 1,
            calculatedPrice: 6.50,
            customization: {
              size: '12oz',
              milk: 'none',
              syrup: 'none',
              bean: 'ethiopia_guji',
              temperature: 'hot',
              extraShots: 0,
              specialInstructions: 'clean bloom finish',
            },
          },
          {
            cartItemId: 'seed-3',
            menuItem: MENU_ITEMS[7], // Almond Croissant
            quantity: 1,
            calculatedPrice: 5.50,
          },
        ],
        subtotal: 12.00,
        discount: 0,
        tip: 2.00,
        total: 14.00,
        status: 'dialing_in',
        createdAt: Date.now() - 90000,
        estimatedMinutes: 6,
      },
    ];
  });

  // Loyalty stamps count
  const [stampsCount, setStampsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('cs_stamps');
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  // Reservations log
  const [, setReservations] = useState<Reservation[]>([]);

  // Synchronize localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cs_cart', JSON.stringify(cartItems));
    } catch {
      // storage unavailable
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('cs_orders', JSON.stringify(orders));
    } catch {
      // storage unavailable
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('cs_stamps', stampsCount.toString());
    } catch {
      // storage unavailable
    }
  }, [stampsCount]);

  // Handlers
  const handleOpenCustomizer = (item: MenuItem) => {
    setCustomizerItem(item);
    setIsCustomizerOpen(true);
  };

  const handleQuickAdd = (item: MenuItem) => {
    const newCartItem: CartItem = {
      cartItemId: `cart-${Date.now()}-${Math.random()}`,
      menuItem: item,
      quantity: 1,
      calculatedPrice: item.price,
    };
    setCartItems((prev) => [...prev, newCartItem]);
    soundscape.triggerChime();
    setIsCartOpen(true);
  };

  const handleAddCustomizedToCart = (
    item: MenuItem,
    customization: CustomizationOptions,
    quantity: number,
    totalPrice: number
  ) => {
    const newCartItem: CartItem = {
      cartItemId: `cart-${Date.now()}-${Math.random()}`,
      menuItem: item,
      customization,
      quantity,
      calculatedPrice: totalPrice,
    };
    setCartItems((prev) => [...prev, newCartItem]);
    soundscape.triggerChime();
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const unitPrice = item.calculatedPrice / item.quantity;
          return {
            ...item,
            quantity: newQty,
            calculatedPrice: Number((unitPrice * newQty).toFixed(2)),
          };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((it) => it.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCurrentTrackedOrder(newOrder);
    setIsTrackerOpen(true);
    // Add loyalty stamps
    setStampsCount((prev) => Math.min(8, prev + newOrder.items.length));
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return { ...ord, status: newStatus };
        }
        return ord;
      })
    );
    // Also update currently tracked modal if viewing it
    if (currentTrackedOrder && currentTrackedOrder.id === orderId) {
      setCurrentTrackedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleAddDemoOrder = () => {
    const names = ['Aria Montgomery', 'Theo Vasquez', 'Claire Sterling', 'Dante Rossi'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const demo: Order = {
      id: `CS-${Math.floor(2000 + Math.random() * 8000)}`,
      customerName: randomName,
      phone: '(555) 412-9903',
      orderType: Math.random() > 0.5 ? 'pickup' : 'dine_in',
      tableNumber: `Table 0${Math.floor(1 + Math.random() * 8)}`,
      pickupTime: 'Ready in ~5 min',
      items: [
        {
          cartItemId: `demo-${Date.now()}`,
          menuItem: MENU_ITEMS[Math.floor(Math.random() * 3)],
          quantity: 1,
          calculatedPrice: 5.75,
          customization: {
            size: '12oz',
            milk: 'whole',
            syrup: 'cardamom_honey',
            bean: 'colombia_huila',
            temperature: 'hot',
            extraShots: 1,
            specialInstructions: 'latte art heart',
          },
        },
      ],
      subtotal: 5.75,
      discount: 0,
      tip: 1.25,
      total: 7.00,
      status: 'queued',
      createdAt: Date.now(),
      estimatedMinutes: 5,
    };
    setOrders((prev) => [demo, ...prev]);
    soundscape.triggerChime();
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeOrdersCount = orders.filter((o) => o.status !== 'completed').length;
  const totalCartItemCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1513] font-sans antialiased selection:bg-[#E8DACB] selection:text-[#1A1513]">
      
      {/* 3-Zone Top Navigation */}
      <Navbar
        cartCount={totalCartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenPassport={() => setIsPassportOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenKDS={() => setIsKDSOpen(true)}
        activeOrderCount={activeOrdersCount}
      />

      {/* Main Page Layout */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreMenu={() => handleNavigate('menu')}
          onExploreBeans={() => handleNavigate('beans')}
          onOpenReservation={() => setIsReservationOpen(true)}
        />

        {/* Artisanal Drink & Pastry Menu */}
        <MenuSection
          onSelectItem={handleOpenCustomizer}
          onQuickAdd={handleQuickAdd}
        />

        {/* Single-Origins Showcase & Brew Guide Calculator */}
        <BrewGuideSection
          onAddBeanToCart={handleQuickAdd}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenPassport={() => setIsPassportOpen(true)}
        onOpenKDS={() => setIsKDSOpen(true)}
      />

      {/* Interactive Modals and Drawers */}
      <DrinkCustomizerModal
        item={customizerItem}
        isOpen={isCustomizerOpen}
        onClose={() => {
          setIsCustomizerOpen(false);
          setCustomizerItem(null);
        }}
        onAddToCart={handleAddCustomizedToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderTrackerModal
        order={currentTrackedOrder}
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        onOpenKDS={() => {
          setIsTrackerOpen(false);
          setIsKDSOpen(true);
        }}
      />

      <BaristaKDS
        isOpen={isKDSOpen}
        onClose={() => setIsKDSOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onAddDemoOrder={handleAddDemoOrder}
      />

      <TableReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        onReservationConfirmed={(res) => setReservations((prev) => [res, ...prev])}
      />

      <LoyaltyPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        stampsCount={stampsCount}
        onAddStamp={() => setStampsCount((s) => Math.min(8, s + 1))}
        onResetStamps={() => setStampsCount(0)}
      />

      {/* Floating Order Banner if active customer order exists */}
      {currentTrackedOrder && currentTrackedOrder.status !== 'completed' && !isTrackerOpen && (
        <div className="fixed bottom-4 left-4 z-40 animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setIsTrackerOpen(true)}
            className="flex items-center gap-3 bg-[#1A1513] text-[#FAF7F2] px-4 py-2.5 rounded-xl shadow-xl border border-[#3E322A] hover:bg-[#2C2420] transition-colors cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#C26D38] animate-ping" />
            <div className="text-left">
              <div className="text-xs font-semibold">
                Order {currentTrackedOrder.id} is {currentTrackedOrder.status.replace('_', ' ')}
              </div>
              <div className="text-[10px] text-[#A8988B]">
                Click to open live tracker
              </div>
            </div>
          </button>
        </div>
      )}

    </div>
  );
}
