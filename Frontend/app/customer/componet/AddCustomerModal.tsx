'use client';

interface ProfileInfo {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  isActive: boolean;
}

interface CustomerForm {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  profile: ProfileInfo;
}

interface Props {
  newCustomer: CustomerForm;
  setNewCustomer: (data: CustomerForm) => void;
  handleAddCustomer: (e: React.FormEvent) => void;
  setShowForm: (show: boolean) => void;
}

export default function AddCustomerForm({
  newCustomer,
  setNewCustomer,
  handleAddCustomer,
  setShowForm,
}: Props) {
  return (
    <div className="bg-white text-gray-900 p-4 rounded-xl shadow-md w-full max-w-md mx-auto my-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Add Customer</h2>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-900 text-lg transition"
        >
          ✖
        </button>
      </div>

      <form
        onSubmit={handleAddCustomer}
        className="space-y-2 max-h-[70vh] overflow-y-auto"
      >
        {/* Main Fields */}
        <input
          type="text"
          placeholder="Full Name"
          value={newCustomer.full_name}
          onChange={e =>
            setNewCustomer({ ...newCustomer, full_name: e.target.value })
          }
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newCustomer.email}
          onChange={e =>
            setNewCustomer({ ...newCustomer, email: e.target.value })
          }
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={newCustomer.phone}
          onChange={e =>
            setNewCustomer({ ...newCustomer, phone: e.target.value })
          }
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newCustomer.password}
          onChange={e =>
            setNewCustomer({ ...newCustomer, password: e.target.value })
          }
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          required
        />

        {/* Profile Info */}
        <h3 className="text-md font-semibold mt-3 mb-1">Profile Info</h3>
        {['full_name', 'email', 'phone', 'address', 'gender'].map(field => (
          <input
            key={field}
            type="text"
            placeholder={field.replace('_', ' ').toUpperCase()}
            value={(newCustomer.profile as any)[field]}
            onChange={e =>
              setNewCustomer({
                ...newCustomer,
                profile: { ...newCustomer.profile, [field]: e.target.value },
              })
            }
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          />
        ))}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium mt-3 text-sm"
        >
          Add Customer
        </button>
      </form>
    </div>
  );
}
