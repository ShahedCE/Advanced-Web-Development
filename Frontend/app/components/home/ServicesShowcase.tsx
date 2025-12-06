const services = [
  { title: 'Wash & Fold', desc: 'Affordable laundry by kg.' },
  { title: 'Dry Cleaning', desc: 'Premium dry cleaning for delicate fabrics.' },
  { title: 'Ironing', desc: 'Perfectly pressed clothes every time.' },
  { title: 'Shoe Cleaning', desc: 'Professional care for your shoes.' },
];

export default function ServicesShowcase() {
  return (
    <section className="py-16 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-10">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {services.map((s, i) => (
          <div
            key={i}
            className="p-6 border rounded-2xl shadow hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
