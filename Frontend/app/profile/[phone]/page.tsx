'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const params = useParams();
  const phone = params.phone as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`http://localhost:3000/customer/phone/${phone}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setProfile(res.data);
        setFormData({
          full_name: res.data.full_name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          address: res.data.profile?.address || '',
          gender: res.data.profile?.gender || '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [phone]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!profile)
    return <p className="text-center mt-10">No profile data found.</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `http://localhost:3000/customer/by-phone/${phone}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Profile updated successfully!');
      setProfile({
        ...profile,
        ...formData,
        profile: { ...profile.profile, ...formData },
      });
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Profile Information</h1>

      <button
        onClick={() => setEditing(!editing)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {editing ? 'Cancel' : 'Edit Profile'}
      </button>

      {editing ? (
        <div className="space-y-4">
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-green-600"
            placeholder="Full Name"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-green-600"
            placeholder="Email"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-green-600"
            placeholder="Phone"
          />
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-green-600"
            placeholder="Address"
          />
          <input
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-green-600"
            placeholder="Gender"
          />

          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Update Profile
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-gray-500 text-sm">Full Name</h2>
            <p className="text-lg font-semibold text-green-600">
              {profile.full_name || 'N/A'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-gray-500 text-sm">Email</h2>
            <p className="text-lg font-semibold text-green-600">
              {profile.email}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-gray-500 text-sm">Phone</h2>
            <p className="text-lg font-semibold text-green-600">
              {profile.phone}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-gray-500 text-sm">Address</h2>
            <p className="text-lg font-semibold text-green-600">
              {profile.profile?.address || 'N/A'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-gray-500 text-sm">Gender</h2>
            <p className="text-lg font-semibold text-green-600">
              {profile.profile?.gender || 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
