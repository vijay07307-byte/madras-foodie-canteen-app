"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import FoodCard from '@/components/FoodCard';
import { useApp } from '@/lib/store';
import { foodItems } from '@/lib/food-data';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function HomePage() {
  const router = useRouter();
  const { user, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const filteredItems = selectedCategory === 'All' 
    ? foodItems 
    : foodItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: any, customization?: string) => {
    addToCart(item, customization);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Sidebar onCategorySelect={setSelectedCategory} selectedCategory={selectedCategory} />

      {/* Hero Section */}
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Delicious Food
            </span>
            <br />
            <span className="text-3xl sm:text-4xl">At Your Fingertips</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Order from your favorite college canteen. Fast, fresh, and always delicious!
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">🔥 Hot Offers</Badge>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">⚡ Quick Delivery</Badge>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">🎉 Combos Available</Badge>
          </div>
        </div>
      </div>

      {/* Category Title */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">
            {selectedCategory === 'All' ? 'All Foods' : selectedCategory}
          </h2>
          <p className="text-muted-foreground">
            {filteredItems.length} delicious items available
          </p>
        </div>
      </div>

      {/* Food Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
