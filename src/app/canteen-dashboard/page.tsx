"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Bell, UtensilsCrossed } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function CanteenDashboard() {
  const router = useRouter();
  const { user, setUser, orders, updateOrderStatus } = useApp();

  useEffect(() => {
    if (!user || user.role !== 'canteen') {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user || user.role !== 'canteen') {
    return null;
  }

  const handleLogout = () => {
    setUser(null);
    router.push('/auth');
  };

  const handleStatusUpdate = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Order ${orderId} updated to ${newStatus}`);
    
    // Simulate notification to customer
    if (newStatus === 'ready') {
      toast.success('Customer notified: Order is ready for pickup!');
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const renderOrderCard = (order: any) => (
    <Card key={order.id} className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Customer: {order.customerName}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.createdAt.toLocaleString()}
            </p>
          </div>
          <Badge className="bg-orange-600 text-white">
            ₹{order.total.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Order Items */}
        <div className="space-y-2 mb-4">
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-start text-sm">
              <div className="flex-1">
                <p className="font-medium">{item.name} × {item.quantity}</p>
                {item.customization && (
                  <p className="text-xs text-orange-600 mt-1">
                    ⚠️ Special: {item.customization}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {order.status === 'pending' && (
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => handleStatusUpdate(order.id, 'preparing')}
            >
              Start Preparing
            </Button>
          )}
          {order.status === 'preparing' && (
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleStatusUpdate(order.id, 'ready')}
            >
              Mark as Ready
            </Button>
          )}
          {order.status === 'ready' && (
            <Button
              className="flex-1 bg-gray-600 hover:bg-gray-700"
              onClick={() => handleStatusUpdate(order.id, 'completed')}
            >
              Complete Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">MADRAS FOODIE</h1>
              <p className="text-sm opacity-90">Canteen Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {pendingOrders.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-red-600">
                  {pendingOrders.length}
                </Badge>
              )}
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{pendingOrders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Preparing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{preparingOrders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{readyOrders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-600">{completedOrders.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">
              Pending ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="preparing">
              Preparing ({preparingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="ready">
              Ready ({readyOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No pending orders</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingOrders.map(renderOrderCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="preparing" className="space-y-4 mt-6">
            {preparingOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No orders being prepared</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {preparingOrders.map(renderOrderCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ready" className="space-y-4 mt-6">
            {readyOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No ready orders</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {readyOrders.map(renderOrderCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {completedOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No completed orders</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedOrders.map(renderOrderCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
