"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod"; //z Zod namespace having all the validation function

// Zod schema for validation
const adminSignupSchema = z.object({
  fullname: z.string().min(1, "Username is required"), //keys are validated like fullname,email.....
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  age: z.string().refine((val) => { //refine(){} for defining custom validation rules
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, { message: "Please enter a valid age" }),

  file: z
    .instanceof(File, { message: "Profile picture is required" }) //has to be a file object// "File" browsers predefined class
    .refine((file) => ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type), {
      message: "Only JPEG, JPG, PNG, or WEBP allowed",
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, { message: "File must be less than 2MB" }),
});

export default function AdminSignup() {
  useEffect(() => {
    document.title = "Signup | Doctor Laundry";
  }, []);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null); // for file reset after submission

  const [fullname, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleChangeAge = (e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value);

  // File validation
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Zod validation checking
    const result = adminSignupSchema.safeParse({fullname,email,password,age,file, }); //safeParse() return object {secccess:true, errors:{ issues:[ message:......]}}

    if (!result.success) {
      setError(result.error.issues[0].message); // show first validation error
      setSuccess("");
      return;
    }
   
    //if result true
    try {
      const formData = new FormData();   // JS or Browser Builtin API (key,value) pair
      formData.append("fullname", result.data.fullname); // append(key,val)
      formData.append("email", result.data.email);
      formData.append("password", result.data.password);
      formData.append("age", result.data.age);
      formData.append("file", result.data.file);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/createadmin",
        formData,{
          headers: { "Content-Type":'multipart/form-data' },
        }
      );

      console.log("Admin created:", response.data);
      setSuccess("Signup successful!");
      setError("");

      // Reset form
      setUsername("");
      setEmail("");
      setPassword("");
      setAge("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      router.push("/login/admin_login");
    } 
   catch (error: any) {
      if (error.response?.data?.message) {  //optional chaining return undefine if not there
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setSuccess("");
    }
  };

  return (
    <div  className=" bg-blue-100 flex justify-center items-center h-[80vh]">
      <div className=" bg-gray-100 p-6 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Sign Up</h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullname" className=" block text-m">
              Username:
            </label>
            { /* value props links with statevariable*/ }
            <input
              type="text"
              name="fullname"
              value={fullname}  
              onChange={handleChangeUsername}
              className="w-full px-3 py-2 border rounded-lg font-medium"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-m">
              Email:
            </label>
            <input
              type=""
              name="email"
              value={email}
              onChange={handleChangeEmail}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-m font-medium">
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChangePassword}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-m font-medium">
              Age:
            </label>
            <input
              type="number"
              name="age"
              value={age}
              onChange={handleChangeAge}
              className="w-medium px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="file" className="text-m font-medium">
              Profile picture:
            </label>
            <input
              type="file"
              name="file"
              onChange={handleChangeFile}
              ref={fileInputRef}
              className="px-3 py-2 border rounded-lg"
            />
          </div>

          {error && <p className="text-red-600 font-bold">{error}</p>}
          {success && <p className="text-green-600 font-bold">{success}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white mt-8 py-2 rounded-lg hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>

        <p className="text-m text-center mt-4">
          Already have an account?{" "}
          <Link href="/login/admin_login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}


