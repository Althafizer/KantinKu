import React, { useState } from 'react';
import { toast } from 'sonner';
import { ThemeProvider } from 'next-themes';

import { HomePage } from './components/HomePage';
import { MenuDetailPage } from './components/MenuDetailPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderHistoryPage } from './components/OrderHistoryPage';
import { ProfilePage } from './components/ProfilePage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { BottomNavigation } from './components/BottomNavigation';
import { Toaster } from './components/ui/sonner';

interface MenuItem {
  id: string;
  name: string;
  vendor: string;
  price: number;
  image: string;
  category: 'makanan' | 'minuman' | 'snack';
  canteen: 'kantin-utama' | 'kantin-belakang' | 'food-court';
  inStock: boolean;
  description: string;
}

interface CartItem {
  id: string;
  menuId: string;
  name: string;
  vendor: string;
  price: number;
  image: string;
  quantity: number;
  addOns: Array<{ id: string; name: string; price: number }>;
  notes: string;
  spiceLevel: string;
}

interface Order {
  id: string;
  items: any[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed';
  total: number;
  orderTime: Date;
  estimatedTime: number;
  deliveryMethod: string;
  customerInfo: any;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [lastOrderId, setLastOrderId] = useState<string>('');

  const generateOrderId = () => {
    return 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const addToCart = (
    item: MenuItem, 
    quantity: number = 1, 
    addOns: any[] = [], 
    notes: string = '', 
    spiceLevel: string = 'tidak-pedas'
  ) => {
    const cartItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      menuId: item.id,
      name: item.name,
      vendor: item.vendor,
      price: item.price,
      image: item.image,
      quantity,
      addOns,
      notes,
      spiceLevel
    };

    setCartItems(prev => [...prev, cartItem]);
    toast.success(`${item.name} ditambahkan ke keranjang!`);
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.success('Item dihapus dari keranjang');
  };

  const handleMenuItemClick = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setCurrentPage('menu-detail');
  };

  const handleAddToCartFromDetail = (
    item: MenuItem, 
    quantity: number, 
    addOns: any[], 
    notes: string, 
    spiceLevel: string
  ) => {
    addToCart(item, quantity, addOns, notes, spiceLevel);
    setCurrentPage('home');
  };

  const handleCheckout = (deliveryMethod: string, deliveryFee: number) => {
    setCheckoutData({ deliveryMethod, deliveryFee });
    setCurrentPage('checkout');
  };

  const handlePlaceOrder = (orderData: any) => {
    const orderId = generateOrderId();
    const newOrder: Order = {
      id: orderId,
      items: orderData.items,
      status: 'pending',
      total: orderData.total,
      orderTime: orderData.orderTime,
      estimatedTime: orderData.estimatedTime,
      deliveryMethod: orderData.deliveryMethod,
      customerInfo: orderData.customerInfo
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastOrderId(orderId);
    setCartItems([]);
    setCurrentPage('order-success');
    
    toast.success('Pesanan berhasil dibuat!');
  };

  const handleReorder = (order: Order) => {
    // Convert order items back to cart items
    const newCartItems: CartItem[] = order.items.map(item => ({
      id: Math.random().toString(36).substr(2, 9),
      menuId: item.id,
      name: item.name,
      vendor: item.vendor,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      addOns: item.addOns || [],
      notes: item.notes || '',
      spiceLevel: item.spiceLevel || 'tidak-pedas'
    }));

    setCartItems(newCartItems);
    setCurrentPage('cart');
    toast.success('Pesanan ditambahkan ke keranjang!');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onMenuItemClick={handleMenuItemClick}
            onAddToCart={addToCart}
          />
        );
      
      case 'menu-detail':
        return selectedMenuItem ? (
          <MenuDetailPage
            item={selectedMenuItem}
            onBack={() => setCurrentPage('home')}
            onAddToCart={handleAddToCartFromDetail}
          />
        ) : null;
      
      case 'cart':
        return (
          <CartPage
            cartItems={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={handleCheckout}
          />
        );
      
      case 'checkout':
        return checkoutData ? (
          <CheckoutPage
            cartItems={cartItems}
            deliveryMethod={checkoutData.deliveryMethod}
            deliveryFee={checkoutData.deliveryFee}
            onBack={() => setCurrentPage('cart')}
            onPlaceOrder={handlePlaceOrder}
          />
        ) : null;
      
      case 'order-success':
        const lastOrder = orders.find(order => order.id === lastOrderId);
        return lastOrder ? (
          <OrderSuccessPage
            orderId={lastOrder.id}
            estimatedTime={lastOrder.estimatedTime}
            deliveryMethod={lastOrder.deliveryMethod}
            total={lastOrder.total}
            onBackToHome={() => setCurrentPage('home')}
            onTrackOrder={() => setCurrentPage('history')}
          />
        ) : null;
      
      case 'history':
        return (
          <OrderHistoryPage
            orders={orders}
            onReorder={handleReorder}
          />
        );
      
      case 'profile':
        return (
          <ProfilePage
            onTopUp={() => toast.info('Fitur top up akan segera hadir!')}
            onEditProfile={() => toast.info('Fitur edit profil akan segera hadir!')}
          />
        );
      
      default:
        return null;
    }
  };

  const showBottomNav = !['menu-detail', 'checkout', 'order-success'].includes(currentPage);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="h-screen bg-background flex flex-col">
        <div className="flex-1 overflow-hidden">
          {renderCurrentPage()}
        </div>
        
        {showBottomNav && (
          <BottomNavigation
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            cartItemCount={cartItems.length}
          />
        )}
        
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
          }}
        />
      </div>
    </ThemeProvider>
  );
}