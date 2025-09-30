import React, { useState } from 'react';
import { Search, Filter, Plus, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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

interface HomePageProps {
  onMenuItemClick: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Nasi Goreng Gak Spesial" Banget',
    vendor: 'Warung Bu Sari',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1680674814945-7945d913319c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZm9vZCUyMG5hc2klMjBnb3Jlbmd8ZW58MXx8fHwxNzU4NTQ2OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'makanan',
    canteen: 'kantin-utama',
    inStock: true,
    description: 'Nasi goreng dengan telur, ayam, dan sayuran segar'
  },
  {
    id: '2',
    name: 'Mie Ayam Bakso',
    vendor: 'Abang Baso',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1723169869214-a181b1170de3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwbWllJTIwYXlhbSUyMG5vb2RsZXN8ZW58MXx8fHwxNzU4NTUwMzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'makanan',
    canteen: 'kantin-belakang',
    inStock: true,
    description: 'Mie ayam dengan bakso dan pangsit goreng'
  },
  {
    id: '3',
    name: 'Gado-Gado',
    vendor: 'Warung Sehat',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1642753474702-c174c08bb68b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZ2FkbyUyMGdhZG8lMjBzYWxhZHxlbnwxfHx8fDE3NTg1NDY5ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'makanan',
    canteen: 'food-court',
    inStock: false,
    description: 'Salad sayuran dengan bumbu kacang khas Indonesia'
  },
  {
    id: '4',
    name: 'Es Teh Manis',
    vendor: 'Warung Bu Sari',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1602884163961-0dbad864a13a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZXMlMjB0ZWglMjBpY2UlMjB0ZWF8ZW58MXx8fHwxNzU4NTUwMzM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'minuman',
    canteen: 'kantin-utama',
    inStock: true,
    description: 'Teh manis dingin yang menyegarkan'
  },
  {
    id: '5',
    name: 'Bakso Kuah',
    vendor: 'Abang Baso',
    price: 13000,
    image: 'https://images.unsplash.com/photo-1595786153212-e45f596c3e92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwYmFrc28lMjBtZWF0YmFsbCUyMHNvdXB8ZW58MXx8fHwxNzU4NTUwMzQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'makanan',
    canteen: 'kantin-belakang',
    inStock: true,
    description: 'Bakso sapi dengan kuah kaldu hangat'
  },
  {
    id: '6',
    name: 'Ayam Bakar Madu',
    vendor: 'Ayam Bakar Pak Joko',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1645066803665-d16a79a21566?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwc2F0ZSUyMGNoaWNrZW4lMjBza2V3ZXJ8ZW58MXx8fHwxNzU4NTUwMzQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'makanan',
    canteen: 'food-court',
    inStock: true,
    description: 'Ayam dengan bumbu madu asli dari pegunungan rusia'
  }
];

const categories = [
  { id: 'semua', label: 'Semua' },
  { id: 'makanan', label: 'Makanan' },
  { id: 'minuman', label: 'Minuman' },
  { id: 'snack', label: 'Snack' }
];

const canteens = [
  { id: 'semua', label: 'Semua Kantin' },
  { id: 'kantin-utama', label: 'Kantin Utama' },
  { id: 'kantin-belakang', label: 'Kantin Belakang' },
  { id: 'food-court', label: 'Food Court' }
];

export function HomePage({ onMenuItemClick, onAddToCart }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [selectedCanteen, setSelectedCanteen] = useState('semua');

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || item.category === selectedCategory;
    const matchesCanteen = selectedCanteen === 'semua' || item.canteen === selectedCanteen;
    
    return matchesSearch && matchesCategory && matchesCanteen;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-green-500 text-primary-foreground p-4 rounded-b-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white">KatOn ( Kantin Online )</h1>
            <p className="text-green-100 opacity-90">Pesan makanan favoritmu!</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
        </div>
      
        {/* Search Bar */}
        <div className="relative bg-white mb-4 rounded-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
          <Input
            placeholder="Cari makanan atau minuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-0 rounded-2xl h-12 text-white placeholder:text-white"
          />
        </div>

        {/* Canteen Selector */}
        <Select value={selectedCanteen} onValueChange={setSelectedCanteen}>
          <SelectTrigger className="bg-white border-5 rounded-xl h-12 text-white">
            <SelectValue placeholder="Pilih kantin" />
          </SelectTrigger>
          <SelectContent className='bg-white text-black'>
            {canteens.map(canteen => (
              <SelectItem key={canteen.id} value={canteen.id}>
                {canteen.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Tabs */}
      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-4 py-2 whitespace-nowrap ${
                selectedCategory === category.id 
                  ? 'bg-green-500 text-white' 
                  : 'border-gray-200 text-black'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-4 pb-20 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <Card 
              key={item.id} 
              className="overflow-hidden bg-white border-3 shadow-md hover:shadow-2xl transition-shadow duration-200 cursor-pointer"
              onClick={() => onMenuItemClick(item)}
            >
              <div className="relative">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <Badge variant="destructive" className="text-white text-base px-4 py-2">
                      Stok Habis
                    </Badge>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.canteen === 'kantin-utama' ? 'Kantin FST' : 
                     item.canteen === 'kantin-belakang' ? 'Kantin FISHUM' : 'Kantin FITK'}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{item.vendor}</p>
                    <p className="text-lg font-bold text-primary mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  
                  <Button
                    size="sm"
                    className="ml-2 w-8 h-8 rounded-full bg-green-500 text-black hover:bg-green/90 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.inStock) {
                        onAddToCart(item);
                      }
                    }}
                    disabled={!item.inStock}
                  >
                    <Plus className="w-4 h-4 text-black bg-green-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada menu yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}