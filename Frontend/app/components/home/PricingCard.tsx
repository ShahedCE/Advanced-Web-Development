const pricing = [
  { plan: 'Wash & Fold', price: '₹49/kg' },
  { plan: 'Ironing', price: '₹89/kg' },
  { plan: 'Premium Dry Clean', price: '₹139/kg' },
];

export default function PricingCard() {
  return (
    <section className="bg-gray-100 py-16 text-center">
      <h2 className="text-3xl font-bold mb-10">Pricing</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        {pricing.map((p, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl shadow w-64">
            <h3 className="text-xl font-semibold mb-2">{p.plan}</h3>
            <p className="text-blue-600 font-bold text-2xl">{p.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
