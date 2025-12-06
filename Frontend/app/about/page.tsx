import Link from 'next/link';

export default function About() {
  const reviews = [
    {
      name: 'MD AL AMIN',
      text: 'Quick service, clothes came back fresh & neat!',
    },
    {
      name: 'HUSNE JAMAN SAHED',
      text: 'Loved the pickup & delivery option. Super easy.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-16 text-center">
      <h1 className="text-4xl font-bold mb-6">About Our Service</h1>
      <p className="mb-6">
        আমরা আপনার কাপড়ের যত্ন নিই। দ্রুত, নির্ভুল ও সুবিধাজনক পরিষেবা।
      </p>

      <Link
        href="/about/company"
        className="text-blue-600 underline mb-10 inline-block"
      >
        Company সম্পর্কে জানুন
      </Link>

      {/* Testimonials শুরু */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-10">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="p-6 border rounded-2xl shadow">
              <p className="mb-4 italic">“{r.text}”</p>
              <h4 className="font-semibold">- {r.name}</h4>
            </div>
          ))}
        </div>
      </section>
      {/* Testimonials শেষ */}
    </div>
  );
}
