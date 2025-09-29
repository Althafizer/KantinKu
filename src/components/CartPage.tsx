import React, { useState } from 'react';
import { Minus, Plus, Trash2, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (deliveryMethod: string, deliveryFee: number) => void;
}

export function CartPage({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout }: CartPageProps) {
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getItemTotal = (item: CartItem) => {
    const addOnTotal = item.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
    return (item.price + addOnTotal) * item.quantity;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);
  const deliveryFee = deliveryMethod === 'delivery' ? 5000 : 0;
  const total = subtotal + deliveryFee;

  const spiceLevelLabels = {
    'tidak-pedas': 'Tidak Pedas',
    'pedas-sedang': 'Pedas Sedang',
    'pedas-banget': 'Pedas Banget'
  };

  const estimatedTime = deliveryMethod === 'delivery' ? '20-30 menit' : '15-20 menit';

  const handleCheckout = () => {
    onCheckout(deliveryMethod, deliveryFee);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Keranjang Kosong</h2>
        <p className="text-gray-600 mb-6">Belum ada makanan yang ditambahkan ke keranjang</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <h1 className="text-xl font-bold text-white">Keranjang Belanja</h1>
        <p className="text-green-100 opacity-90">{cartItems.length} item dalam keranjang</p>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4 overflow-y-auto pb-80">
        <div className="space-y-4">
          {cartItems.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{item.vendor}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Price */}
                    <p className="font-semibold text-primary mb-2">
                      {formatPrice(item.price)}
                    </p>

                    {/* Add-ons */}
                    {item.addOns.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 mb-1">Tambahan:</p>
                        {item.addOns.map(addOn => (
                          <div key={addOn.id} className="flex justify-between text-xs text-gray-600">
                            <span>+ {addOn.name}</span>
                            <span>{formatPrice(addOn.price)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Spice Level */}
                    {item.spiceLevel && item.spiceLevel !== 'tidak-pedas' && (
                      <p className="text-xs text-gray-500 mb-2">
                        Level: {spiceLevelLabels[item.spiceLevel as keyof typeof spiceLevelLabels]}
                      </p>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <p className="text-xs text-gray-500 mb-2">
                        Catatan: {item.notes}
                      </p>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          className="rounded-full w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-semibold w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="rounded-full w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <span className="font-semibold text-primary">
                        {formatPrice(getItemTotal(item))}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Delivery Method */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Metode Pengambilan</h3>
            <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Ambil di Kantin</p>
                      <p className="text-sm text-gray-600">Ambil sendiri di lokasi kantin</p>
                    </div>
                  </div>
                </Label>
                <span className="font-semibold text-green-600">Gratis</span>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Diantar ke Kelas</p>
                      <p className="text-sm text-gray-600">Pesan akan diantar ke lokasi kelas</p>
                    </div>
                  </div>
                </Label>
                <span className="font-semibold text-primary">{formatPrice(5000)}</span>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Estimated Time */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-medium text-gray-900">Estimasi Waktu</span>
              </div>
              <span className="font-semibold text-primary">{estimatedTime}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Checkout */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Ongkos Antar</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
        </div>

        <Button
          onClick={handleCheckout}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12"
        >
          Lanjut ke Pembayaran
        </Button>
      </div>
    </div>
  );
}