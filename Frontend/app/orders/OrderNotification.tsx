'use client';

import Pusher from 'pusher-js';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OrderNotification() {
  useEffect(() => {
    // Pusher instance create
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,
    });

    // Subscribe to 'orders' channel
    const channel = pusher.subscribe('orders');

    // Listen for 'order-placed' event from backend
    channel.bind('order-placed', (data: any) => {
      console.log('✅ New order received:', data); // browser console log
      toast.info(
        `New Order!\nID: ${data.id}\nService: ${data.service}\nAmount: ${data.totalAmount}`
      );
    });

    // Cleanup on unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return <ToastContainer position="top-right" autoClose={5000} />;
}
