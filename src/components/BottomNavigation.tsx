import React from 'react';
import { Home, ShoppingCart, History, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface BottomNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cartItemCount: number;
}

export function BottomNavigation({ currentPage, onNavigate, cartItemCount }: BottomNavigationProps) {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      color: 'text-primary'
    },
    {
      id: 'cart',
      label: 'Keranjang',
      icon: ShoppingCart,
      color: 'text-primary',
      badge: cartItemCount > 0 ? cartItemCount : undefined
    },
    {
      id: 'history',
      label: 'Riwayat',
      icon: History,
      color: 'text-primary'
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      color: 'text-primary'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-pb">
      <div className="flex justify-around items-center">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 h-auto min-w-0 ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? item.color : 'text-gray-400'}`} />
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 w-5 h-5 text-xs flex items-center justify-center p-0 min-w-5"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}