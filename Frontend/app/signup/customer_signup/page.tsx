'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  RegistrationFormData,
  registrationSchema,
} from '../../../lib/validation/registraion.schema';

export default function Register() {
  const [serverMessage, setServerMessage] = useState<string | null>(null); // UI message state
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // success/fail indicator

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    const { confirmPassword, ...payload } = data;
   console.log(payload);
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_ENDPOINT + '/authentication/signup',
        payload
      );

      setIsSuccess(true);
      setServerMessage('Registration successful!'); // success message
    }
    
    catch (error: any) {
      setIsSuccess(false);
      setServerMessage(
        error.response?.data?.message ||
          'Registration failed. Please try again.........'
      ); // error message from server
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

      {/* Server message */}
      {serverMessage && (
        <p
          className={`text-sm mb-4 ${
            isSuccess ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {serverMessage}
        </p>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="text"
            id="email"
            {...register('email')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="01XXXXXXXXX"
            {...register('phone')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register('password')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
          <Link href="/login" className="text-white-600 hover:underline">
            or login here
          </Link>
        </div>
      </form>
    </div>
  );
}
