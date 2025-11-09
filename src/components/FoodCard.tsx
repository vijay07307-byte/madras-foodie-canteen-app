"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, Sparkles } from 'lucide-react';
import { FoodItem } from '@/lib/store';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FoodCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem, customization?: string) => void;
}

export default function FoodCard({ item, onAddToCart }: FoodCardProps) {
  const [showCustomize, setShowCustomize] = useState(false);
  const [customization, setCustomization] = useState('');

  const handleAddToCart = () => {
    if (item.customizable) {
      setShowCustomize(true);
    } else {
      onAddToCart(item);
    }
  };

  const handleCustomizeAdd = () => {
    onAddToCart(item, customization);
    setShowCustomize(false);
    setCustomization('');
  };

  const finalPrice = item.discount 
    ? item.price - (item.price * item.discount) / 100 
    : item.price;

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-200">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {item.discount && (
            <Badge className="absolute top-2 right-2 bg-red-600 text-white">
              {item.discount}% OFF
            </Badge>
          )}
          {item.isCombo && (
            <Badge className="absolute top-2 left-2 bg-purple-600 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              COMBO
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg line-clamp-1">{item.name}</h3>
            <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-green-600 text-green-600" />
              <span className="text-xs font-semibold text-green-700">{item.rating}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-600">₹{finalPrice}</span>
            {item.discount && (
              <span className="text-sm text-muted-foreground line-through">₹{item.price}</span>
            )}
          </div>
          {item.customizable && (
            <Badge variant="outline" className="mt-2 text-xs">Customizable</Badge>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
          >
            <Plus className="w-4 h-4 mr-2" />
            {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showCustomize} onOpenChange={setShowCustomize}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize {item.name}</DialogTitle>
            <DialogDescription>
              Add any special instructions or customizations for your order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customization">Special Instructions</Label>
              <Textarea
                id="customization"
                placeholder="e.g., Extra spicy, no onions, etc."
                value={customization}
                onChange={(e) => setCustomization(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomize(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              onClick={handleCustomizeAdd}
            >
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
