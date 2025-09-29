import React from 'react';
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface OrderSuccessPageProps {
  orderId: string;
  estimatedTime: number;
  deliveryMethod: string;
  total: number;
  onBackToHome: () => void;
  onTrackOrder: () => void;
}

export function OrderSuccessPage({
  orderId,
  estimatedTime,
  deliveryMethod,
  total,
  onBackToHome,
  onTrackOrder
}: OrderSuccessPageProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Success Header */}
      <div className="bg-primary text-primary-foreground p-6 text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Pesanan Berhasil!</h1>
        <p className="text-green-100 opacity-90">Terima kasih telah memesan di Kantin ku</p>
      </div>

      {/* Order Details */}
      <div className="flex-1 p-4 pb-20">
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">#{orderId}</h2>
            <Badge variant="secondary" className="mb-4">
              Pesanan Dikonfirmasi
            </Badge>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Estimasi {estimatedTime} menit</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{deliveryMethod === 'delivery' ? 'Akan diantar ke kelas' : 'Ambil di kantin'}</span>
              </div>
              
              <div className="text-2xl font-bold text-primary">
                {formatPrice(total)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Instruksi Selanjutnya:</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  1
                </div>
                <p className="text-gray-700">Pesanan Anda sedang diproses oleh penjual</p>
              </div>
              
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  2
                </div>
                <p className="text-gray-700">
                  {deliveryMethod === 'delivery' 
                    ? 'Kami akan mengantar pesanan ke kelas Anda' 
                    : 'Silakan datang ke kantin untuk mengambil pesanan'
                  }
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  3
                </div>
                <p className="text-gray-700">Lakukan pembayaran saat penerimaan pesanan</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Butuh Bantuan?</h3>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Hubungi Kantin</p>
                <p className="text-sm text-gray-600">0812-3456-7890</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="text-blue-600">💡</div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">Tips:</h4>
                <p className="text-sm text-blue-700">
                  Simpan nomor pesanan untuk memudahkan komunikasi dengan penjual. 
                  Anda bisa melacak status pesanan di halaman riwayat.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3">
        <Button
          onClick={onTrackOrder}
          variant="outline"
          className="w-full rounded-xl h-12"
        >
          Lacak Pesanan
        </Button>
        <Button
          onClick={onBackToHome}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12"
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}