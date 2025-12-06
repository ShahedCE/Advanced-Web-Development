'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

interface Customer {
  id: number;
  full_name: string;
  phone: string;
  email: string;
}

interface Order {
  id: number;
  service: string;
  totalAmount: number;
  customer: Customer;
  createdAt: string;
}

export default function OrderSearch() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [phone, setPhone] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get<Order[]>('http://localhost:3000/orders');
        setOrders(res.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!phone.trim()) {
      setFilteredOrders([]);
      return;
    }
    const inputPhone = phone.trim();
    const filtered = orders.filter(order =>
      order.customer?.phone?.toString().includes(inputPhone)
    );
    setFilteredOrders(filtered);
  }, [phone, orders]);

  return (
    <div className="mt-6 p-6 border rounded-lg bg-gray-50 shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Search Orders by Phone
      </h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter customer phone number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="border p-3 flex-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900"
        />
      </div>

      {loading ? (
        <p className="text-gray-700">Loading orders...</p>
      ) : filteredOrders.length > 0 ? (
        <div>
          <p className="font-medium mb-4 text-gray-800">
            Total Orders for <strong>{phone}</strong>: {filteredOrders.length}
          </p>
          <ul className="space-y-4">
            {filteredOrders.map(order => (
              <li
                key={order.id}
                className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-800">
                  <span className="font-semibold">Service:</span>{' '}
                  {order.service}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Amount:</span>{' '}
                  {order.totalAmount} ৳
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Customer:</span>{' '}
                  {order.customer?.full_name}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Customer Phone:</span>{' '}
                  {order.customer?.phone}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Date:</span>{' '}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : phone ? (
        <p className="text-gray-600">No orders found for this number.</p>
      ) : (
        <p className="text-gray-500">
          Enter a customer phone number above to search orders.
        </p>
      )}
    </div>
  );
}
