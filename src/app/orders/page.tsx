"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, CheckCircle2, ChefHat, Package } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function OrdersPage() {
  const router = useRouter();
  const { user, orders } = useApp();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const userOrders = orders.filter(order => order.customerName === user.name);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'preparing':
        return <ChefHat className="w-5 h-5" />;
      case 'ready':
        return <Package className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (userOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-orange-600" />
            </div>
            <CardTitle>No Orders Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start exploring our menu!
            </p>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              onClick={() => router.push('/home')}
            >
              Browse Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push('/home')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Your Orders
        </h1>

        <div className="space-y-6">
          {userOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium">{item.name} × {item.quantity}</p>
                        {item.customization && (
                          <p className="text-xs text-muted-foreground">{item.customization}</p>
                        )}
                      </div>
                      <p className="font-semibold">
                        ₹{((item.discount ? item.price - (item.price * item.discount) / 100 : item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Order Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium capitalize">{order.paymentMethod}</span>
                  </div>
                  {order.estimatedTime && order.status !== 'completed' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Time</span>
                      <span className="font-medium text-orange-600">{order.estimatedTime} mins</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold mt-4">
                    <span>Total</span>
                    <span className="text-orange-600">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Status Message */}
                {order.status === 'ready' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Your order is ready! Please collect it from the canteen.
                    </p>
                  </div>
                )}
                {order.status === 'preparing' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 font-semibold flex items-center gap-2">
                      <ChefHat className="w-5 h-5" />
                      Your food is being prepared with love!
                    </p>
                  </div>
                )}
                {order.status === 'pending' && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-semibold flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Order received. The canteen will start preparing soon.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
