'use client';
import { useEffect, useState } from 'react';
import pusher from '../utils/pusherClient';

interface OrderNotification {
  id: number;
  service: string;
  date: string;
  time: string;
  address: string;
  totalAmount: number;
}

export default function OrderNotifications() {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);

  useEffect(() => {
    // Subscribe to orders channel
    const channel = pusher.subscribe('orders');

    // Listen for order-placed event
    channel.bind('order-placed', (data: OrderNotification) => {
      console.log('New order:', data);
      setNotifications(prev => [data, ...prev]);
      alert(`New Order Placed! ID: ${data.id}, Amount: ${data.totalAmount}`);
    });

    // Cleanup
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Order Notifications</h2>
      <ul>
        {notifications.map(n => (
          <li key={n.id} className="border p-2 mb-2 rounded">
            <strong>Order ID:</strong> {n.id} <br />
            <strong>Service:</strong> {n.service} <br />
            <strong>Date & Time:</strong> {n.date} {n.time} <br />
            <strong>Address:</strong> {n.address} <br />
            <strong>Total:</strong> ${n.totalAmount}
          </li>
        ))}
      </ul>
    </div>
  );
}
