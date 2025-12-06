"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => router.push("/dashboard/admin")}
                className="hover:text-blue-300"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/managers")}
                className="hover:text-blue-300"
              >
                All Managers
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/settings")}
                className="hover:text-blue-300"
              >
                Settings
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("adminToken");
                  router.push("/login/admin_login");
                }}
                className="hover:text-red-400"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
