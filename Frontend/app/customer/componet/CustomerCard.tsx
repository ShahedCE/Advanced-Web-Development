import Link from 'next/link';

interface Profile {
  isActive: boolean | null;
}

interface Customer {
  id: number;
  full_name: string | null;
  email: string;
  phone: string;
  profile: Profile | null;
}

interface Props {
  customer: Customer;
  deletingId: number | null;
  handleDelete: (id: number) => void;
}

export default function CustomerCard({
  customer,
  deletingId,
  handleDelete,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between hover:shadow-xl transition">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {customer.full_name || 'N/A'}
        </h2>
        <p className="text-gray-700 text-sm mt-1">{customer.email}</p>
        <p className="text-gray-700 text-sm">{customer.phone}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        {customer.profile?.isActive ? (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-900 text-sm font-medium">
            Active
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-900 text-sm font-medium">
            Inactive
          </span>
        )}
        <Link
          href={`/customer/${customer.id}`}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm transition"
        >
          View
        </Link>
        <Link
          href={`/customer/number/${customer.phone}`}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm transition"
        >
          Update Profile
        </Link>
        <button
          onClick={() => handleDelete(customer.id)}
          disabled={deletingId === customer.id}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm transition"
        >
          {deletingId === customer.id ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
