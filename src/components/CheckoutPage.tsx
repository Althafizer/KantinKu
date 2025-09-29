import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, MapPin, Phone, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';
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

interface CheckoutPageProps {
  cartItems: CartItem[];
  deliveryMethod: string;
  deliveryFee: number;
  onBack: () => void;
  onPlaceOrder: (orderData: any) => void;
}

export function CheckoutPage({ 
  cartItems, 
  deliveryMethod, 
  deliveryFee, 
  onBack, 
  onPlaceOrder 
}: CheckoutPageProps) {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    classroom: '',
    tableNumber: ''
  });

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
  const total = subtotal + deliveryFee;

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    if (!customerInfo.name || !customerInfo.phone) return false;
    if (deliveryMethod === 'delivery' && !customerInfo.classroom) return false;
    return true;
  };

  const handlePlaceOrder = () => {
    if (!isFormValid()) return;

    const orderData = {
      items: cartItems,
      customerInfo,
      deliveryMethod,
      deliveryFee,
      paymentMethod,
      subtotal,
      total,
      orderTime: new Date(),
      estimatedTime: deliveryMethod === 'delivery' ? 30 : 20
    };

    onPlaceOrder(orderData);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-white">Checkout</h1>
          <p className="text-green-100 opacity-90">Konfirmasi pesanan Anda</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto pb-32">
        {/* Customer Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Informasi Pemesan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                placeholder="Masukkan nama lengkap"
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Nomor HP *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="mt-1"
              />
            </div>

            {deliveryMethod === 'delivery' && (
              <div>
                <Label htmlFor="classroom">Kelas/Ruangan *</Label>
                <Input
                  id="classroom"
                  placeholder="Contoh: XII IPA 1, Lab Fisika, dll"
                  value={customerInfo.classroom}
                  onChange={(e) => handleInputChange('classroom', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            {deliveryMethod === 'pickup' && (
              <div>
                <Label htmlFor="tableNumber">Nomor Meja (Opsional)</Label>
                <Input
                  id="tableNumber"
                  placeholder="Nomor meja untuk memudahkan penyerahan"
                  value={customerInfo.tableNumber}
                  onChange={(e) => handleInputChange('tableNumber', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Metode Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      💰
                    </div>
                    <div>
                      <p className="font-medium">Tunai di Tempat</p>
                      <p className="text-sm text-gray-600">Bayar saat pengambilan/penerimaan</p>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
                <RadioGroupItem value="qris" id="qris" />
                <Label htmlFor="qris" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">QRIS</p>
                      <p className="text-sm text-gray-600">Scan QR code untuk pembayaran</p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ringkasan Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                    <p className="text-sm text-gray-600 truncate">{item.vendor}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-600">x{item.quantity}</span>
                      <span className="font-semibold text-primary">
                        {formatPrice(getItemTotal(item))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Delivery Info */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {deliveryMethod === 'delivery' ? 'Diantar ke Kelas' : 'Ambil di Kantin'}
                </span>
              </div>
              <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : 'Gratis'}</span>
            </div>

            <Separator className="my-4" />

            {/* Totals */}
            <div className="space-y-2">
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
          </CardContent>
        </Card>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button
          onClick={handlePlaceOrder}
          disabled={!isFormValid()}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 disabled:opacity-50"
        >
          Pesan Sekarang - {formatPrice(total)}
        </Button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Dengan melakukan pemesanan, Anda menyetujui syarat dan ketentuan yang berlaku
        </p>
      </div>
    </div>
  );
}