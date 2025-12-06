'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Profile {
  id: number;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  gender: string | null;
  isActive: boolean | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Customer {
  id: number;
  full_name: string | null;
  email: string;
  phone: string;
  password: string; // will not be displayed in UI
  profile: Profile | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function CustomerByMobilePage() {
  const { mobile } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
  });

  // Fetch customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_API_ENDPOINT+ "/customer/all_customers" 
        );
        const customers: Customer[] = res.data?.data || [];
        const found = customers.find(c => c.phone?.trim() === mobile);
        if (found) {
          setCustomer(found);
          setFormData({
            full_name: found.full_name || '',
            email: found.email,
            phone: found.phone,
          });
        } else {
          setCustomer(null);
        }
      } catch (err) {
        console.error('Error loading customer:', err);
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [mobile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    setUpdating(true);
    setUpdateMessage({ type: null, text: '' });

    try {
      const res = await axios.patch(
        `http://localhost:3000/customer/by-phone/${mobile}`,
        formData
      );
      console.log('Updated customer:', res.data);

      // ✅ Success message
      setUpdateMessage({
        type: 'success',
        text: '✅ Customer updated successfully!',
      });

      setCustomer(prev => (prev ? { ...prev, ...formData } : null));
    } catch (err) {
      console.error('Update error:', err);

      // ❌ Error message
      setUpdateMessage({
        type: 'error',
        text: '❌ Customer update failed!',
      });
    } finally {
      setUpdating(false);

      // ৩ সেকেন্ড পরে message remove হবে
      setTimeout(() => {
        setUpdateMessage({ type: null, text: '' });
      }, 3000);
    }
  };

  if (loading)
    return (
      <p className="text-center py-10 text-gray-400 text-lg font-medium">
        Loading customer...
      </p>
    );

  if (!customer)
    return (
      <p className="text-center py-10 text-red-500 text-lg font-semibold">
        No customer found with this phone number
      </p>
    );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
        <h1 className="text-4xl font-extrabold text-indigo-400 mb-8 text-center">
          Customer Details & Update (Mobile)
        </h1>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-900 p-4 rounded-xl shadow">
            <p className="text-gray-400">ID</p>
            <p className="text-lg font-semibold">{customer.id}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl shadow">
            <p className="text-gray-400">Name</p>
            <p className="text-lg font-semibold">
              {customer.full_name || 'No Name'}
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl shadow">
            <p className="text-gray-400">Email</p>
            <p className="text-lg font-semibold">{customer.email}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl shadow">
            <p className="text-gray-400">Phone</p>
            <p className="text-lg font-semibold">{customer.phone}</p>
          </div>
        </div>

        {/* Update Form */}
        <form
          onSubmit={handleUpdate}
          className="bg-gray-900 p-6 rounded-xl shadow space-y-4"
        >
          <h2 className="text-2xl font-bold text-indigo-300 mb-4">
            Update Customer Information
          </h2>

          {/* ✅ Message UI */}
          {updateMessage.type && (
            <div
              className={`p-2 rounded text-center text-sm font-medium mb-3 ${
                updateMessage.type === 'success'
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {updateMessage.text}
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition text-white font-semibold px-4 py-2 rounded-lg mt-4"
          >
            {updating ? 'Updating...' : 'Update Customer'}
          </button>
        </form>
      </div>
    </div>
  );
}
