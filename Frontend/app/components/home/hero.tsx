'use client';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="bg-blue-600 text-white py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Tech-enabled Laundry & Dry-Cleaning
      </h1>
      <p className="mb-6 text-lg">Free Pickup & Delivery at Your Doorstep</p>
      <button
        onClick={() => router.push('/orders')} // 👈 Next.js internal route
        className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-gray-200"
      >
        Place Order
      </button>
    </section>
  );
}
