"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AdminLayout from "@/app/components/admin_layout";


export default function AdminDashboard() {

  const [stats, setStats] = useState({ //holds the numbers
    total: 0,
    active: 0,
    inactive: 0,
  });

  interface Manager {  //creating a structure of Manager object
  name: string;
  email: string;
  createdAt: string;
}

const [recent, setRecent] = useState<Manager[]>([]); 
  const router = useRouter();

  useEffect(() => {
    document.title = "Admin Dashboard | Doctor Laundry";

    // Fetch data from backend
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Example: Fetch stats
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/dashboard_stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStats(res.data.stats);
        setRecent(res.data.recentManagers);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      }
    };

    fetchData();
  }, [router]);  //dependency router, if router changed again run fetchData()

  return (

    <AdminLayout>
    
    <div className="flex min-h-screen bg-gray-00">
     
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6">👋 Welcome, Admin!</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold">Total Managers</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold">Active Managers</h3>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div> 
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold">Inactive Managers</h3>
            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
          </div>
        
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Quick Actions</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push("/managers")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              View Managers
            </button>
            <button
              onClick={() => router.push("/managers/add")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add Manager
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-bold mb-3">Recent Activity</h2>
       <ul className="bg-blue-950 p-4 rounded-xl shadow-md space-y-2">
        {recent.length > 0 ? (
        recent.map((manager, index) => (
        <li key={index} className="text-white">
        • {manager.name} ({manager.email}) - Created at: {new Date(manager.createdAt).toLocaleDateString()}
      </li>
    ))
      ) : (
    <p className="text-gray-500">No recent activity</p>
  )}
</ul>
        </div>
      </main>
    </div>
     </AdminLayout>
  );
}
