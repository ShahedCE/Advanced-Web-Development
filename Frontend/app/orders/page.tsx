'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LocationMap from '../components/home/map';

export default function OrdersPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    service: 'Laundry',
    date: '',
    time: '',
    address: '',
    instructions: '',
    phone: '',
    email: '',
    paymentMethod: 'Cash',
    totalAmount: 0,
  });

  const [showMap, setShowMap] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );

  // Load token & customerId from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedCustomerId = localStorage.getItem('customerId');

    if (savedToken && savedCustomerId) {
      setToken(savedToken);
      setCustomerId(Number(savedCustomerId));
    }

    const pending = localStorage.getItem('pendingOrder');
    if (pending) {
      const data = JSON.parse(pending);
      setFormData(data);
      localStorage.removeItem('pendingOrder');

      if (savedToken && savedCustomerId) {
        handleSubmitOrder(data, Number(savedCustomerId), savedToken);
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalAmount' ? Number(value) : value,
    }));
  };

  const handleLocationConfirm = (coords: { lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      address: `${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`,
    }));
    setShowMap(false);
  };

  const handleSubmitOrder = async (
    data: typeof formData,
    id: number,
    authToken: string
  ) => {
    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ ...data, customerId: id }),
      });

      if (!response.ok) throw new Error('Failed to place order');

      const resData = await response.json();
      // Show confirmation message in UI
      setConfirmationMessage('✅ Your order is confirmed!');

      // Clear form (optional)
      setFormData({
        service: 'Laundry',
        date: '',
        time: '',
        address: '',
        instructions: '',
        phone: '',
        email: '',
        paymentMethod: 'Cash',
        totalAmount: 0,
      });

      // Hide message after 5 seconds
      setTimeout(() => setConfirmationMessage(null), 5000);

      console.log('Response:', resData);
    } catch (err) {
      console.error(err);
      setConfirmationMessage('❌ Error placing order. Please try again.');
      setTimeout(() => setConfirmationMessage(null), 5000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId || !token) {
      localStorage.setItem('pendingOrder', JSON.stringify(formData));
      router.push('http://localhost:4000/login?redirect=/orders');
      return;
    }

    handleSubmitOrder(formData, customerId, token);
  };

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative">
      <div className="max-w-md w-full p-6 bg-black text-white shadow-lg rounded-2xl relative">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Laundry Service Order
        </h2>

        {/* Floating Confirmation Message */}
        {confirmationMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg text-center z-50 animate-fade-in">
            {confirmationMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* --- Form Fields (unchanged) --- */}
          <div>
            <label className="block text-sm font-medium">Select Service</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Laundry">Laundry</option>
              <option value="Wash">Wash</option>
              <option value="Iron">Iron</option>
              <option value="Dry Clean">Dry Clean</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Select Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Select Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Pickup Address</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address or pick on map"
                className="flex-1 mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="px-3 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
              >
                Pick on Map
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Special Instructions
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="E.g., delicate fabrics"
              className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="017XXXXXXXX"
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Total Amount</label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Place Order
          </button>
        </form>
      </div>

      {showMap && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-[500px] h-[600px] rounded-lg p-4 flex flex-col">
            <LocationMap onConfirm={handleLocationConfirm} />
            <button
              onClick={() => setShowMap(false)}
              className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
