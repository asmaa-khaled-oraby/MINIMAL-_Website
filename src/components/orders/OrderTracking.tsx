
import React from 'react';
import { CheckCircle2, Circle, Truck, Package, Home, AlertCircle } from 'lucide-react';

interface OrderTrackingProps {
  status: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingMethod?: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ 
  status, 
  trackingNumber, 
  estimatedDelivery,
  shippingMethod
}) => {
  const getStatusStep = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const statusStep = getStatusStep();
  
  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <h3 className="font-medium text-lg mb-4">Order Status</h3>
      
      {statusStep === -1 ? (
        <div className="flex items-center gap-2 text-red-500 mb-4">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">This order has been cancelled</span>
        </div>
      ) : (
        <>
          <div className="relative mb-8">
            {/* Progress line */}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
              <div 
                className="h-full bg-primary transition-all" 
                style={{ width: `${Math.max(0, (statusStep / 3) * 100)}%` }}
              />
            </div>
            
            {/* Steps */}
            <div className="flex justify-between relative">
              <div className="flex flex-col items-center">
                {statusStep >= 0 ? (
                  <CheckCircle2 className="h-10 w-10 text-primary bg-white rounded-full" />
                ) : (
                  <Circle className="h-10 w-10 text-muted-foreground bg-white rounded-full" />
                )}
                <span className="text-sm mt-2 font-medium">Ordered</span>
              </div>
              
              <div className="flex flex-col items-center">
                {statusStep >= 1 ? (
                  <CheckCircle2 className="h-10 w-10 text-primary bg-white rounded-full" />
                ) : (
                  <Circle className="h-10 w-10 text-muted-foreground bg-white rounded-full" />
                )}
                <span className="text-sm mt-2 font-medium">Processing</span>
              </div>
              
              <div className="flex flex-col items-center">
                {statusStep >= 2 ? (
                  <Truck className="h-10 w-10 text-primary bg-white rounded-full" />
                ) : (
                  <Truck className="h-10 w-10 text-muted-foreground bg-white rounded-full" />
                )}
                <span className="text-sm mt-2 font-medium">Shipped</span>
              </div>
              
              <div className="flex flex-col items-center">
                {statusStep >= 3 ? (
                  <Home className="h-10 w-10 text-primary bg-white rounded-full" />
                ) : (
                  <Home className="h-10 w-10 text-muted-foreground bg-white rounded-full" />
                )}
                <span className="text-sm mt-2 font-medium">Delivered</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            {trackingNumber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tracking Number:</span>
                <span className="font-medium">{trackingNumber}</span>
              </div>
            )}
            
            {shippingMethod && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping Method:</span>
                <span className="font-medium">{shippingMethod}</span>
              </div>
            )}
            
            {estimatedDelivery && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Delivery:</span>
                <span className="font-medium">{estimatedDelivery}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderTracking;
