'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Profile type
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

// Customer type
interface Customer {
  id: number;
  full_name: string | null;
  email: string;
  phone: string;
  profile: Profile;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function CustomerDetailPage() {
  const { id } = useParams(); // Get id from URL
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:3000/customer/all_customers')
      .then(res => {
        // Filter customer by id
        const found = res.data.data.find((c: Customer) => c.id === Number(id));
        setCustomer(found || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading customer:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <p className="text-center py-10 text-gray-400 text-lg font-medium">
        Loading customer...
      </p>
    );
  if (!customer)
    return (
      <p className="text-center py-10 text-red-500 text-lg font-semibold">
        No customer found
      </p>
    );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
        <h1 className="text-4xl font-extrabold text-indigo-400 mb-8 text-center">
          Customer Details
        </h1>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Profile Info */}
        <h2 className="text-2xl font-bold text-indigo-300 mt-10 mb-4">
          Profile Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-4 rounded-xl shadow">
            <p className="text-gray-400">Address</p>
            <p className="text-lg font-semibold">
              {customer.profile?.address || 'N/A'}
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl shadow">
            <p className="text-gray-400">Gender</p>
            <p className="text-lg font-semibold">
              {customer.profile?.gender || 'N/A'}
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl shadow">
            <p className="text-gray-400">Active</p>
            <p
              className={`text-lg font-semibold ${
                customer.profile?.isActive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {customer.profile?.isActive ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl shadow">
            <p className="text-gray-400">Created At</p>
            <p className="text-lg font-semibold">
              {new Date(customer.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl shadow">
            <p className="text-gray-400">Updated At</p>
            <p className="text-lg font-semibold">
              {new Date(customer.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
