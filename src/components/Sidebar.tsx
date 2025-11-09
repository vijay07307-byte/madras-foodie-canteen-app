"use client";

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, UtensilsCrossed, ShoppingCart, User, LogOut, Home, Utensils, Coffee, Sun, Moon, Cookie, Droplets } from 'lucide-react';
import { useApp } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

export default function Sidebar({ onCategorySelect, selectedCategory }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const { user, setUser, cart } = useApp();
  const router = useRouter();

  const categories = [
    { 
      name: 'All', 
      label: 'All Foods', 
      icon: Utensils, 
      color: 'from-orange-500 via-red-500 to-pink-500',
      emoji: '🍽️',
      description: 'Browse everything'
    },
    { 
      name: 'Breakfast', 
      label: 'Breakfast', 
      icon: Coffee, 
      color: 'from-amber-500 via-orange-400 to-yellow-500',
      emoji: '🌅',
      description: 'Morning meals'
    },
    { 
      name: 'Lunch', 
      label: 'Lunch', 
      icon: Sun, 
      color: 'from-orange-600 via-red-500 to-pink-500',
      emoji: '☀️',
      description: 'Afternoon delights'
    },
    { 
      name: 'Dinner', 
      label: 'Dinner', 
      icon: Moon, 
      color: 'from-indigo-600 via-purple-500 to-pink-500',
      emoji: '🌙',
      description: 'Evening specials'
    },
    { 
      name: 'Snacks', 
      label: 'Snacks', 
      icon: Cookie, 
      color: 'from-amber-600 via-orange-500 to-red-500',
      emoji: '🍔',
      description: 'Quick bites'
    },
    { 
      name: 'Juice', 
      label: 'Juice & Beverages', 
      icon: Droplets, 
      color: 'from-cyan-600 via-blue-500 to-indigo-500',
      emoji: '🧃',
      description: 'Fresh & refreshing'
    },
  ];

  const handleLogout = () => {
    setUser(null);
    router.push('/auth');
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 bg-gradient-to-br from-orange-500 to-red-600 backdrop-blur shadow-xl hover:from-orange-600 hover:to-red-700 text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-gradient-to-b from-orange-50 via-red-50 to-pink-50">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent font-bold">
                  MADRAS FOODIE
                </span>
                <span className="text-xs text-muted-foreground font-normal">Delicious food delivered</span>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-8 space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-3 p-4 bg-white/70 backdrop-blur rounded-xl shadow-md border border-orange-100">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-base">{user?.name || 'Guest'}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role || 'Customer'}</p>
              </div>
            </div>

            {/* Home Button */}
            <Button 
              className="w-full justify-start bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 shadow-lg"
              onClick={() => {
                router.push('/home');
                setOpen(false);
              }}
            >
              <Home className="w-5 h-5 mr-2" />
              <span className="font-semibold">Home</span>
            </Button>

            {/* Cart Button */}
            <Button 
              variant="outline"
              className="w-full justify-between hover:bg-white/70 shadow-md border-2 border-orange-200"
              onClick={() => {
                router.push('/cart');
                setOpen(false);
              }}
            >
              <span className="flex items-center gap-2 font-semibold">
                <ShoppingCart className="w-5 h-5" />
                View Cart
              </span>
              {cartItemsCount > 0 && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-600 shadow-md">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Menu Categories */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-orange-900 uppercase tracking-wide flex items-center gap-2">
                <span className="text-xl">🍴</span>
                Menu Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.name;
                  return (
                    <Button
                      key={category.name}
                      variant={isSelected ? "default" : "ghost"}
                      className={`w-full justify-start group relative overflow-hidden transition-all duration-300 h-auto py-3 ${
                        isSelected
                          ? `bg-gradient-to-r ${category.color} text-white hover:opacity-90 shadow-lg scale-105`
                          : 'hover:bg-white/70 hover:shadow-md hover:scale-102 bg-white/40'
                      }`}
                      onClick={() => {
                        onCategorySelect(category.name);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${
                          isSelected 
                            ? 'bg-white/20 shadow-inner' 
                            : `bg-gradient-to-br ${category.color} shadow-md`
                        }`}>
                          {isSelected ? category.emoji : (
                            <Icon className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex flex-col items-start flex-1">
                          <span className="font-bold text-sm">{category.label}</span>
                          <span className={`text-xs ${isSelected ? 'text-white/90' : 'text-muted-foreground'}`}>
                            {category.description}
                          </span>
                        </div>
                        <span className="text-2xl transition-transform group-hover:scale-125">
                          {category.emoji}
                        </span>
                      </div>
                      {/* Decorative shine effect */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Logout */}
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 border-2 border-red-200 shadow-md font-semibold"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Icon (Fixed) */}
      <Button
        size="icon"
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 shadow-xl"
        onClick={() => router.push('/cart')}
      >
        <ShoppingCart className="h-5 w-5" />
        {cartItemsCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-red-600 shadow-lg">
            {cartItemsCount}
          </Badge>
        )}
      </Button>
    </>
  );
}