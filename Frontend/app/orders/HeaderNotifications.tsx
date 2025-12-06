'use client';

import { useEffect, useState } from 'react';
import pusher from '../utils/pusherClient';

interface OrderNotification {
  id: number;
  service: string;
  date: string;
  time: string;
  address: string;
  instructions?: string;
  paymentMethod?: string;
  email?: string;
  totalAmount: number;
  phone: string;
  customerId: number;
}

export default function HeaderNotifications() {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    // Pusher subscribe
    const channel = pusher.subscribe('orders');
    channel.bind('order-placed', (data: OrderNotification) => {
      console.log('📩 New order received:', data);

      setNotifications(prev => {
        const updated = [data, ...prev];
        localStorage.setItem('notifications', JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  // Clear All Notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem('notifications', JSON.stringify([]));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowList(!showList)}
        className="bg-blue-600 text-white px-3 py-2 rounded relative"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {showList && (
        <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-80 max-h-96 overflow-y-auto p-2 z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-red-600 text-sm hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {notifications.length > 0 ? (
            notifications.map(n => (
              <div
                key={n.id}
                className="border-b last:border-b-0 p-2 mb-1 rounded hover:bg-gray-100"
              >
                <p>
                  <strong>Order ID:</strong> {n.id}
                </p>
                <p>
                  <strong>Service:</strong> {n.service}
                </p>
                <p>
                  <strong>Date & Time:</strong> {n.date} {n.time}
                </p>
                <p>
                  <strong>Address:</strong> {n.address}
                </p>
                {n.instructions && (
                  <p>
                    <strong>Instructions:</strong> {n.instructions}
                  </p>
                )}
                {n.paymentMethod && (
                  <p>
                    <strong>Payment:</strong> {n.paymentMethod}
                  </p>
                )}
                <p>
                  <strong>Total:</strong> ${n.totalAmount}
                </p>
                <p>
                  <strong>Customer:</strong> {n.phone}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No notifications</p>
          )}
        </div>
      )}
    </div>
  );
}
