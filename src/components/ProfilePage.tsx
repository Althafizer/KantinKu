import React, { useState } from 'react';
import { User, Wallet, Settings, HelpCircle, LogOut, Edit3, CreditCard, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface ProfilePageProps {
  user: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    balance: number;
    memberSince: Date;
  };
  onTopUp: () => void;
  onEditProfile: () => void;
}

const defaultUser = {
  name: 'John Doe',
  email: 'john.doe@student.school.id',
  phone: '08123456789',
  balance: 75000,
  memberSince: new Date('2024-01-15')
};

export function ProfilePage({ 
  user = defaultUser, 
  onTopUp, 
  onEditProfile 
}: ProfilePageProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    {
      icon: Settings,
      label: 'Pengaturan Akun',
      description: 'Kelola informasi dan preferensi akun',
      action: onEditProfile
    },
    {
      icon: CreditCard,
      label: 'Riwayat Transaksi',
      description: 'Lihat semua transaksi saldo kantin',
      action: () => console.log('Riwayat transaksi')
    },
    {
      icon: Gift,
      label: 'Promo & Voucher',
      description: 'Klaim promo dan voucher menarik',
      action: () => console.log('Promo & voucher'),
      badge: '2 Aktif'
    },
    {
      icon: HelpCircle,
      label: 'Bantuan & FAQ',
      description: 'Dapatkan bantuan dan jawaban pertanyaan',
      action: () => console.log('Bantuan')
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-green-500 text-primary-foreground p-4">
        <h1 className="text-3xl font-bold text-white">Profil</h1>
        <p className="text-green-100 opacity-90">Kelola akun dan preferensi Anda</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto pb-20">
        {/* Profile Info */}
        <Card className="mb-6 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-green-500 text-primary-foreground text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Member sejak {formatDate(user.memberSince)}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onEditProfile}
                className="rounded-full w-10 h-10 p-0"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">24</p>
                <p className="text-sm text-gray-600">Total Pesanan</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">4.9</p>
                <p className="text-sm text-gray-600">Rating Rata-rata</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Balance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Saldo Kantin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-primary">
                  {showBalance ? formatPrice(user.balance) : '••••••'}
                </p>
                <p className="text-sm text-gray-600">Saldo tersedia</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-600"
              >
                {showBalance ? '👁️' : '👁️‍🗨️'}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={onTopUp}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Top Up
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => console.log('Transfer saldo')}
              >
                Transfer
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">Penawaran Khusus</span>
              </div>
              <p className="text-sm text-green-700">
                Top up minimal Rp 50.000 dan dapatkan bonus Rp 5.000!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4" onClick={item.action}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{item.label}</h3>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Logout */}
        <Card className="mt-6 border-red-200">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => console.log('Logout')}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Keluar
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Kantin ku v1.0.0</p>
          <p>© 2024 School Canteen App</p>
        </div>
      </div>
    </div>
  );
}