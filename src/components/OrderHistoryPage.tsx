import React, { useState } from 'react';
import { Clock, MapPin, RotateCcw, CheckCircle, Truck, ChefHat } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OrderItem {
  id: string;
  name: string;
  vendor: string;
  quantity: number;
  price: number;
  image: string;
  addOns: Array<{ name: string; price: number }>;
}

interface Order {
  id: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed';
  total: number;
  orderTime: Date;
  estimatedTime: number;
  deliveryMethod: string;
  customerInfo: {
    name: string;
    phone: string;
    classroom?: string;
  };
}

interface OrderHistoryPageProps {
  orders: Order[];
  onReorder: (order: Order) => void;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    items: [
      {
        id: '1',
        name: 'Nasi Goreng Spesial',
        vendor: 'Warung Bu Sari',
        quantity: 1,
        price: 15000,
        image: 'https://images.unsplash.com/photo-1680674814945-7945d913319c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZm9vZCUyMG5hc2klMjBnb3Jlbmd8ZW58MXx8fHwxNzU4NTQ2OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        addOns: [{ name: 'Extra Telur', price: 3000 }]
      },
      {
        id: '4',
        name: 'Es Teh Manis',
        vendor: 'Warung Bu Sari',
        quantity: 1,
        price: 5000,
        image: 'https://images.unsplash.com/photo-1602884163961-0dbad864a13a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZXMlMjB0ZWglMjBpY2UlMjB0ZWF8ZW58MXx8fHwxNzU4NTUwMzM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        addOns: []
      }
    ],
    status: 'preparing',
    total: 23000,
    orderTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    estimatedTime: 20,
    deliveryMethod: 'delivery',
    customerInfo: {
      name: 'John Doe',
      phone: '08123456789',
      classroom: 'XII IPA 1'
    }
  },
  {
    id: 'ORD-002',
    items: [
      {
        id: '2',
        name: 'Mie Ayam Bakso',
        vendor: 'Abang Baso',
        quantity: 2,
        price: 12000,
        image: 'https://images.unsplash.com/photo-1723169869214-a181b1170de3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwbWllJTIwYXlhbSUyMG5vb2RsZXN8ZW58MXx8fHwxNzU4NTUwMzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        addOns: []
      }
    ],
    status: 'completed',
    total: 24000,
    orderTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    estimatedTime: 15,
    deliveryMethod: 'pickup',
    customerInfo: {
      name: 'John Doe',
      phone: '08123456789'
    }
  },
  {
    id: 'ORD-003',
    items: [
      {
        id: '6',
        name: 'Sate Ayam',
        vendor: 'Sate Pak Joko',
        quantity: 1,
        price: 18000,
        image: 'https://images.unsplash.com/photo-1645066803665-d16a79a21566?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwc2F0ZSUyMGNoaWNrZW4lMjBza2V3ZXJ8ZW58MXx8fHwxNzU4NTUwMzQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        addOns: []
      }
    ],
    status: 'completed',
    total: 18000,
    orderTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    estimatedTime: 25,
    deliveryMethod: 'pickup',
    customerInfo: {
      name: 'John Doe',
      phone: '08123456789'
    }
  }
];

export function OrderHistoryPage({ orders = mockOrders, onReorder }: OrderHistoryPageProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} jam yang lalu`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `${days} hari yang lalu`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'preparing':
        return <ChefHat className="w-4 h-4" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4" />;
      case 'delivered':
        return <Truck className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Konfirmasi';
      case 'preparing':
        return 'Sedang Diproses';
      case 'ready':
        return 'Siap Diambil';
      case 'delivered':
        return 'Sedang Diantar';
      case 'completed':
        return 'Selesai';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const activeOrders = orders.filter(order => ['pending', 'preparing', 'ready', 'delivered'].includes(order.status));
  const completedOrders = orders.filter(order => order.status === 'completed');

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">#{order.id}</h3>
            <p className="text-sm text-gray-600">{formatTime(order.orderTime)}</p>
          </div>
          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
            {getStatusIcon(order.status)}
            {getStatusLabel(order.status)}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex gap-3">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate text-sm">{item.name}</h4>
                <p className="text-xs text-gray-600 truncate">{item.vendor}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-600">x{item.quantity}</span>
                  <span className="text-sm font-semibold text-primary">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{order.deliveryMethod === 'delivery' ? 'Diantar' : 'Ambil sendiri'}</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">{formatPrice(order.total)}</p>
            {order.status === 'completed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReorder(order)}
                className="mt-2 text-xs h-8"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Pesan Lagi
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-green-500 text-primary-foreground p-4">
        <h1 className="text-3xl font-bold text-white">Riwayat Pesanan</h1>
        <p className="text-green-100 opacity-90">Lacak dan ulangi pesanan Anda</p>
      </div>

      {/* Tabs */}
      <div className="flex-1 p-4 pb-20 bg-gray">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-white">
            <TabsTrigger value="active">
              Sedang Berjalan ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Selesai ({completedOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeOrders.length > 0 ? (
              activeOrders.map(order => <OrderCard key={order.id} order={order} />)
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Belum Ada Pesanan Aktif</h3>
                <p className="text-gray-600">Semua pesanan Anda telah selesai</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedOrders.length > 0 ? (
              completedOrders.map(order => <OrderCard key={order.id} order={order} />)
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Belum Ada Riwayat</h3>
                <p className="text-gray-600">Riwayat pesanan akan muncul di sini</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}