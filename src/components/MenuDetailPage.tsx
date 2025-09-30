import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, MapPin, Clock, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface MenuDetailPageProps {
  item: MenuItem;
  onBack: () => void;
  onAddToCart: (item: MenuItem, quantity: number, addOns: AddOn[], notes: string, spiceLevel: string) => void;
}

const addOns: AddOn[] = [
  { id: 'telur', name: 'Tambah Telur', price: 3000 },
  { id: 'keju', name: 'Tambah Keju', price: 5000 },
  { id: 'ayam', name: 'Extra Ayam', price: 7000 },
  { id: 'bakso', name: 'Extra Bakso', price: 4000 },
  { id: 'sayur', name: 'Extra Sayuran', price: 2000 }
];

const spiceLevels = [
  { id: 'tidak-pedas', label: 'Tidak Pedas', icon: '😇' },
  { id: 'pedas-sedang', label: 'Pedas Sedang', icon: '🌶️' },
  { id: 'pedas-banget', label: 'Pedas Banget', icon: '🔥' }
];

export function MenuDetailPage({ item, onBack, onAddToCart }: MenuDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [notes, setNotes] = useState('');
  const [spiceLevel, setSpiceLevel] = useState('tidak-pedas');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(item => item.id === addOn.id);
      if (exists) {
        return prev.filter(item => item.id !== addOn.id);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const totalAddOnPrice = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
  const totalPrice = (item.price + totalAddOnPrice) * quantity;

  const handleAddToCart = () => {
    onAddToCart(item, quantity, selectedAddOns, notes, spiceLevel);
  };

  const canteenLabels = {
    'kantin-utama': 'Kantin FST',
    'kantin-belakang': 'Kantin FISHUM',
    'food-court': 'Food FITK'
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with Image */}
      <div className="relative">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-64 object-cover"
        />
        
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white rounded-full w-10 h-10 p-0"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>

        {/* Stock Status */}
        {!item.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Stok Habis
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto pb-24">
        {/* Basic Info */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
              <p className="text-xl text-green-500 font-semibold">{formatPrice(item.price)}</p>
            </div>
            <Badge variant="secondary" className="ml-2">
              {canteenLabels[item.canteen]}
            </Badge>
          </div>

          {/* Vendor Info */}
          <Card className="mb-4 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold bg-white text-lg text-gray-900">{item.vendor}</h3>
                  <div className="flex items-center gap-4 text-md text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>4.8</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>10-15 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-gray-600 leading-relaxed">{item.description}</p>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Jumlah</h3>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || !item.inStock}
              className="rounded-full w-10 h-10 p-0 bg-white text-black"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-xl font-semibold text-black w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
              disabled={!item.inStock}
              className="rounded-full w-10 h-10 p-0 bg-white text-black"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Spice Level (only for food) */}
        {item.category === 'makanan' && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Level Pedas</h3>
            <div className="grid grid-cols-1 gap-2">
              {spiceLevels.map(level => (
                <div
                  key={level.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    spiceLevel === level.id 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSpiceLevel(level.id)}
                >
                  <span className="text-xl">{level.icon}</span>
                  <span className="font-medium text-black">{level.label}</span>
                  <div className="ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors"
                    style={{ borderColor: spiceLevel === level.id ? '#4CAF50' : '#D1D5DB', backgroundColor: spiceLevel === level.id ? '#4CAF50' : 'transparent' }}
                  >
                    {spiceLevel === level.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Tambahan (Opsional)</h3>
          <div className="space-y-2">
            {addOns.map(addOn => {
              const isSelected = selectedAddOns.some(item => item.id === addOn.id);
              return (
                <div
                  key={addOn.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                    isSelected ? 'border-green-500 bg-green-500/10' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleAddOn(addOn)}
                >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isSelected}
                    disabled={!item.inStock}
                    className="bg-white data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <span className="font-medium text-black">{addOn.name}</span>
                </div>
                <span className="text-primary font-semibold">
                  {formatPrice(addOn.price)}
                </span>
              </div>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">Catatan Khusus</h3>
          <Textarea
            placeholder="Misal: tanpa sambal, extra pedas, dll..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={!item.inStock}
            className="resize-none bg-white text-black"
            rows={3}
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-2xl text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-green-500">
            {formatPrice(totalPrice)}
          </span>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={!item.inStock}
          className="w-full bg-green-500 hover:bg-white/90 text-white text-xl rounded-xl h-12"
        >
          {item.inStock ? 'Tambah ke Keranjang' : 'Stok Habis'}
        </Button>
      </div>
    </div>
  );
}