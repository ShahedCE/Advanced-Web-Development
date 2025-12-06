"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";

// Zod schema for manager validation
const managerSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Phone must be 10–15 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  status: z.enum(["active", "inactive"]),
  file: z
    .instanceof(File, { message: "Profile picture is required" })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type),
      { message: "Only JPEG, JPG, PNG, or WEBP allowed" }
    )
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "File must be less than 2MB",
    }),
});

export default function CreateManagerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("active");
  const [file, setProfilePicture] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setProfilePicture(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //  Validate with Zod
    const result = managerSchema.safeParse({
      fullname,
      email,
      password,
      phone,
      address,
      status,
      file,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      setSuccess("");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      Object.entries(result.data).forEach(([key, value]) => {
        formData.append(key, value as any);
      });

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/createmanager`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Manager created successfully!");
      setError("");

      // Reset form
      setFullname("");
      setEmail("");
      setPassword("");
      setPhone("");
      setAddress("");
      setStatus("active");
      setProfilePicture(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      router.push("/managers");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create manager.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (

<div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 pt-10 ">
    <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Create New Manager
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid for first rows */}
        <div className="grid grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Second row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Address (full width) */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Last row with status + file */}
        <div className="grid grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block mb-1 font-medium">Profile Picture</label>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Error / Success */}
        {error && <p className="text-red-600 font-bold text-center">{error}</p>}
        {success && <p className="text-green-600 font-bold">{success}</p>}

       <div className="flex justify-between items-center grid-cols-2">
  {/* Back Button */}
  <button
    type="button"
    onClick={() => router.push("/managers")}
    className="bg-green-500 w-full m-1 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition"
  >
    Back
  </button>

  {/* Submit Button */}
  <button
    type="submit"
    disabled={loading}
    className="bg-blue-600 w-full m-1 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
  >
    {loading ? "Creating..." : "Create Manager"}
  </button>
</div>
      </form>
    </div>
  </div>


);

}
