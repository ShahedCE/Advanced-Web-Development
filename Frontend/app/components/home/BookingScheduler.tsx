export default function BookingScheduler() {
  return (
    <section className="py-16 max-w-xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6">Schedule a Pickup</h2>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Your Name"
          className="border p-3 rounded-xl"
        />
        <input
          type="tel"
          placeholder="Mobile Number"
          className="border p-3 rounded-xl"
        />
        <input type="date" className="border p-3 rounded-xl" />
        <select className="border p-3 rounded-xl">
          <option>Select Time Slot</option>
          <option>9 AM - 11 AM</option>
          <option>1 PM - 3 PM</option>
          <option>5 PM - 7 PM</option>
        </select>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
          Confirm Booking
        </button>
      </form>
    </section>
  );
}
