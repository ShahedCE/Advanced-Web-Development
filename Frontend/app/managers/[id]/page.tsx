"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import AdminLayout from "@/app/components/admin_layout";

type Manager = {
  id: number;
  fullname: string;
  email: string;
  phone: number;
  address: string;
  profile_picture: string;
  status: string;
  created_at: string;
  updatedAt?: string;
};

export default function ViewManager() {

  const [manager, setManager] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/getmanager/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setManager(res.data);

      } catch (err: any) {
        console.error("Error fetching manager:", err);
        setError("Failed to load manager data.");
      } finally {
        setLoading(false);
      }
    };

    fetchManager();
  }, [params.id, router]);

  if (loading) return <p className="p-6 text-gray-600">Loading manager...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!manager) return <p className="p-6 text-gray-500">Manager not found</p>;

  return (
    <AdminLayout> 
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manager Details</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/managers")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={() => router.push(`/managers/edit/${manager.id}`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
            >
              Edit
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <img
             src={
          manager.profile_picture?
           `${process.env.NEXT_PUBLIC_API_ENDPOINT}/uploads/manager/${manager.profile_picture}`
           : "/default-profile.png"
  }
              alt={manager.fullname}
              className="w-40 h-60 rounded-full object-cover object-bottom border-4 border-blue-600"
            />
          </div>

          {/* Manager Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Full Name</h2>
              <p className="text-gray-700">{manager.fullname}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Email</h2>
              <p className="text-gray-700">{manager.email}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Phone</h2>
              <p className="text-gray-700">{manager.phone}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Address</h2>
              <p className="text-gray-700">{manager.address}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Status</h2>
              <span
                className={`px-2 py-1 rounded-lg text-white ${
                  manager.status === "active" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {manager.status.charAt(0).toUpperCase() + manager.status.slice(1)}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Created At</h2>
              <p className="text-gray-700">
                {new Date(manager.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
    </AdminLayout>
  );
}
