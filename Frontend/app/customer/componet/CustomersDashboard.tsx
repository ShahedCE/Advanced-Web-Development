'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import AddCustomerModal from './AddCustomerModal';
import CustomerCard from './CustomerCard';
import OrderSearch from './OrderSearch';

interface Profile {
  isActive: boolean | null;
}

interface Customer {
  id: number;
  full_name: string | null;
  email: string;
  phone: string;
  profile: Profile | null;
}

interface CustomerForm {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  profile: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    isActive: boolean;
  };
}

export default function CustomersDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showContent, setShowContent] = useState<'dashboard' | 'all'>(
    'dashboard'
  );
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | null;
    message: string;
  }>({ type: null, message: '' });

  const [newCustomer, setNewCustomer] = useState<CustomerForm>({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    profile: {
      full_name: '',
      email: '',
      phone: '',
      address: '',
      gender: '',
      isActive: true,
    },
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3000/customer/all_customers'
        );
        const data = res.data?.data || res.data;
        setCustomers(data);
      } catch (err) {
        setNotification({
          type: 'error',
          message: 'Failed to load customers!',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const showNotification = (
    type: 'success' | 'error' | 'warning',
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 3000); // auto hide after 3s
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:3000/customer/${id}`);
      setCustomers(prev => prev.filter(c => c.id !== id));
      showNotification('success', 'Customer deleted successfully!');
    } catch (err) {
      showNotification('error', 'Failed to delete customer!');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3000/customer/add_customers',
        newCustomer
      );
      setCustomers(prev => [...prev, res.data.data]);
      setShowForm(false);
      setNewCustomer({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        profile: {
          full_name: '',
          email: '',
          phone: '',
          address: '',
          gender: '',
          isActive: true,
        },
      });
      showNotification('success', 'Customer added successfully!');
    } catch (err) {
      showNotification('error', 'Failed to add customer!');
    }
  };

  if (loading)
    return (
      <p className="text-center py-10 text-gray-300 font-medium">
        Loading customers...
      </p>
    );

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 relative">
      {/* Notification UI */}
      {notification.type && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg text-white z-50
          ${notification.type === 'success' ? 'bg-green-600' : ''}
          ${notification.type === 'error' ? 'bg-red-600' : ''}
          ${notification.type === 'warning' ? 'bg-yellow-500 text-black' : ''}`}
        >
          {notification.message}
        </div>
      )}

      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-black via-indigo-900 to-blue-800 p-6 flex flex-col gap-4 sticky top-0 h-screen shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-white">Customer Menu</h2>

        {['dashboard', 'all'].map(c => (
          <button
            key={c}
            onClick={() => setShowContent(c as any)}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition
            ${
              showContent === c
                ? 'bg-white text-indigo-900'
                : 'bg-indigo-700 hover:bg-indigo-600 text-white'
            }`}
          >
            {c === 'dashboard' ? 'Dashboard' : 'All Customers'}
          </button>
        ))}

        <button
          onClick={() => setShowForm(true)}
          className="w-full px-4 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition mt-4"
        >
          + Add Customer
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {showContent === 'dashboard' && (
          <>
            <h1 className="text-4xl font-bold text-white mb-6">
              Customer Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Total Customers Card */}
              <div className="bg-gray-800 rounded-2xl shadow p-6 flex flex-col justify-between hover:shadow-xl transition">
                <p className="text-gray-400">Total Customers</p>
                <p className="text-4xl font-bold">{customers.length}</p>
              </div>

              {/* Active Customers */}
              <div className="bg-gray-800 rounded-2xl shadow p-6 flex flex-col justify-between hover:shadow-xl transition">
                <p className="text-gray-400">Active Customers</p>
                <p className="text-4xl font-bold">
                  {customers.filter(c => c.profile?.isActive).length}
                </p>
              </div>

              {/* Inactive Customers */}
              <div className="bg-gray-800 rounded-2xl shadow p-6 flex flex-col justify-between hover:shadow-xl transition">
                <p className="text-gray-400">Inactive Customers</p>
                <p className="text-4xl font-bold">
                  {customers.filter(c => !c.profile?.isActive).length}
                </p>
              </div>
            </div>

            {/* Order Search Section */}
            <div className="mb-6">
              <OrderSearch />
            </div>
          </>
        )}

        {showContent === 'all' && (
          <>
            <h1 className="text-4xl font-bold text-white mb-6">
              All Customers
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers.map(customer => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  deletingId={deletingId}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Customer Modal */}
      {showForm && (
        <AddCustomerModal
          newCustomer={newCustomer}
          setNewCustomer={setNewCustomer}
          handleAddCustomer={handleAddCustomer}
          setShowForm={setShowForm}
        />
      )}
    </div>
  );
}
