const reasons = [
  'Hygienic & Safe (No Mixing of Clothes)',
  'Fast Turnaround',
  'Eco-Friendly Cleaning',
  'App & Website Booking',
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reasons.map((reason, i) => (
          <li
            key={i}
            className="p-6 border rounded-2xl shadow text-lg font-medium"
          >
            ✅ {reason}
          </li>
        ))}
      </ul>
    </section>
  );
}
