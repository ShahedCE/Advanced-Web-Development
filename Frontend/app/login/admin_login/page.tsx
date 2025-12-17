"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});

export default function AdminLogin() {

  useEffect(() => {  //for side effect handling
    document.title = "Login | Doctor Laundry";
  }, []); //dependency array

  const router = useRouter();

  const [identifier, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    // Validate with Zod
    const result = loginSchema.safeParse({ identifier, password }); //result holds object

    if (!result.success) {
      // Extract first error message
      const firstError = result.error.issues[0].message;
      setError(firstError);
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT+"/auth/login", 
        result.data, // send validated data
        {
          headers: { "Content-Type": "application/json" },
        }
      );
   
      //set token
      const token = response.data.access_token; // backend should return { token: "..." }
      // Save token for future requests
      localStorage.setItem("token", token);  //save in adminToken

      setError("");
      setSuccess("Login successful!");
      setUsername("");
      setPassword("");
      router.push("/dashboard/admin");
    } 
    
    catch (error: any) {
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
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier" className="block text-m">
              Username:
            </label>
            <input
              type="text"
              name="identifier"
              value={identifier}
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
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg font-medium"
            />

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

        <p className="text-m text-center mt-4">
          Haven't any account?{" "}
          <Link
            href="/signup/admin_signup"
            className="text-green-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
