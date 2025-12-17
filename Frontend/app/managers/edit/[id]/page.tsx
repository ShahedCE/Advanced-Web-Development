"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import AdminLayout from "@/app/components/admin_layout";
import { z } from "zod";

//  Zod schema for validation
const managerSchema = z.object({
  fullname: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Phone must be 10–15 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  status: z.enum(["active", "inactive"]),
  file: z
    .any()
    .refine((file) => file instanceof File || file === null, "Invalid file type")
    .optional(),
});

export default function EditManager() {
  const { id } = useParams();
  const router = useRouter();

  //  States
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("active");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //  Fetch existing manager data
  useEffect(() => {
    const fetchManager = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/getmanager/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFullname(res.data.fullname);
        setEmail(res.data.email);
        setPhone(res.data.phone);
        setAddress(res.data.address);
        setStatus(res.data.status);

        if (res.data.profile_picture) {
          setPreview(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/uploads/manager/${res.data.profile_picture}`
          );
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch manager data");
      }
    };
    fetchManager();
  }, [id]);

  //  Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile)); // TO SEE THE SELECTED PICTURE
    }
  };

  //  Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with Zod
    const result = managerSchema.safeParse({
      fullname,
      email,
      password: password || undefined,
      phone,
      address,
      status,
      file,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError("");
    setLoading(true);

//updating with new manager data
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("email", email);
      if (password) formData.append("password", password);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("status", status);
      if (file instanceof File) {
        formData.append("file", file);
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/manager/updateprofile/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.push("/managers");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update manager");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
<div className="flex justify-center mt-[-31] min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
  <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 border-t-8 border-blue-600">
          <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
            Edit Manager
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Full Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Full Name</label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full px-5 py-3 border rounded-xl"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 border rounded-xl"
                />
              </div>
            </div>

            {/* Password + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep unchanged"
                  className="w-full px-5 py-3 border rounded-xl"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-3 border rounded-xl"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block mb-2 font-medium">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-5 py-3 border rounded-xl"
              />
            </div>

            {/* Status + Profile Picture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block mb-2 font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-5 py-3 border rounded-xl"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Profile Picture</label>
                <div className="flex items-center gap-4">
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-400"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-red-600 font-bold text-center">{error}</p>}

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
              >
                {loading ? "Updating..." : "Update Manager"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/managers")}
                className="flex-1 bg-gray-300 py-3 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
