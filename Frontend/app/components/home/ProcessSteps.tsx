const steps = [
  'Schedule a Pickup',
  'We Collect & Clean',
  'Delivered Fresh to You',
];

export default function ProcessSteps() {
  return (
    <section className="bg-gray-100 py-16 text-center">
      <h2 className="text-3xl font-bold mb-8">How It Works</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        {steps.map((step, i) => (
          <div key={i} className="p-6 bg-white rounded-xl shadow w-60">
            <div className="text-4xl font-bold text-blue-600 mb-4">{i + 1}</div>
            <p>{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
