"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/admin_layout";

type Manager = {
  id: number;
  fullname: string;
  email: string;
  password: string;
  phone: number;
  address: string;
  profile_picture: string;
  status: string;
};

export default function ManagerListPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true); // Loading.... until API call ends
  const router = useRouter();

  // Fetch managers on page load
  useEffect(() => { 
    const fetchManagers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          // redirect if not logged in
          router.push("/login/admin_login");
          return;
        }

        const res = await axios.get(
          process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/getmanagers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setManagers(res.data);
      } catch (err) {
        console.error("Error fetching managers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  const totalManagers = managers.length;
  const activeManagers = managers.filter((m) => m.status === "active").length;

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this manager?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/deletemanager/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // update table after delete
      setManagers(managers.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting manager:", err);
    }
  };
 return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manager Management</h1>
          <p className="text-gray-600 mt-1">
            Total Managers: {totalManagers} | Active: {activeManagers}
          </p>
        </div>
        <Link
          href="/managers/add"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Manager
        </Link>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading managers...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left font-semibold border">Name</th>
                <th className="p-3 text-left font-semibold border">Email</th>
                <th className="p-3 text-left font-semibold border">Status</th>
                <th className="p-3 text-left font-semibold border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((manager) => (
                <tr key={manager.id} className="border-t">
                  <td className="p-3">{manager.fullname}</td>
                  <td className="p-3">{manager.email}</td>
                  <td className="p-3">{manager.status}</td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/managers/${manager.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/managers/edit/${manager.id}`}
                      className="text-yellow-500 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(manager.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {managers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    No managers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}