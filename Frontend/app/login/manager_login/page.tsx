"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

// 🔥 Zod validation schema
const loginSchema = z.object({
  username: z.string().min(1, "Email is required"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});

export default function ManagerLogin() {
  useEffect(() => {
    document.title = "Login | Doctor Laundry";
  }, []);

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form using Zod
    const result = loginSchema.safeParse({ username, password });

    if (!result.success) {
      const firstError = result.error.issues[0].message;
      setError(firstError);
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
        result.data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const token = response.data.access_token;

      // Store manager token
      localStorage.setItem("managerToken", token);

      // Reset state
      setError("");
      setSuccess("Login successful!");
      setUsername("");
      setPassword("");

      router.push("/customer");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setSuccess("");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] bg-gray-100">
      <div className="bg-white p-6 mb-10 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Manager Login</h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-m">
              Email:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg font-medium"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-m">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg font-medium"
            />
          </div>

          <div>
            {error && <p className="text-red-600 font-bold">{error}</p>}
            {success && <p className="text-green-600 font-bold">{success}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white mt-8 py-2 rounded-lg hover:bg-blue-700"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
