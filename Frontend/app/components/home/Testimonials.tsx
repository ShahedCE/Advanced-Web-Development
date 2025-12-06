const reviews = [
  {
    name: 'Ravi Kumar',
    text: 'Quick service, clothes came back fresh & neat!',
  },
  {
    name: 'Anjali Sharma',
    text: 'Loved the pickup & delivery option. Super easy.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 max-w-6xl mx-auto text-center">
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
  );
}
