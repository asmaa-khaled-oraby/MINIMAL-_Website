
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Loader2 } from 'lucide-react';
import OrderTracking from '@/components/orders/OrderTracking';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type Order = {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items: OrderItem[];
  tracking_number: string | null;
  shipping_method: string | null;
  shipping_address: string | null;
  estimated_delivery: string | null;
};

type OrderItem = {
  id: string;
  product_id: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
};

const Orders = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchOrders();
    }
  }, [user, loading, navigate]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      // For each order, fetch its items
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          if (itemsError) {
            console.error('Error fetching order items:', itemsError);
            return { ...order, items: [] };
          }

          return { ...order, items: itemsData || [] };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-green-500';
      case 'delivered':
        return 'bg-green-700';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatEstimatedDelivery = (dateString: string | null) => {
    if (!dateString) return 'Not available';
    return format(parseISO(dateString), 'MMMM d, yyyy');
  };

  if (loading || isLoading) {
    return (
      <>
        <Header />
        <div className="container py-24 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Loading your orders...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-24">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-medium mb-4">You haven't placed any orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Browse our collection and find something you like
            </p>
            <button 
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.substring(0, 8)}</CardTitle>
                      <CardDescription>
                        Placed on {format(new Date(order.created_at), 'MMMM d, yyyy')}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                      <span className="font-medium">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <OrderTracking 
                    status={order.status}
                    trackingNumber={order.tracking_number || undefined}
                    shippingMethod={order.shipping_method || undefined}
                    estimatedDelivery={order.estimated_delivery ? 
                      formatEstimatedDelivery(order.estimated_delivery) : undefined}
                  />
                
                  <h3 className="font-medium mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-4">
                        <div>
                          <p className="font-medium">Product ID: {item.product_id}</p>
                          <p className="text-sm text-muted-foreground">
                            Size: {item.size}, Color: {item.color}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <span className="font-medium">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Orders;
