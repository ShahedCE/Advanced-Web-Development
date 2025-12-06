'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import HeaderNotifications from '../../orders/HeaderNotifications';

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center relative">
      <h1 className="font-bold text-lg">Laundry Service</h1>
      <ul className="flex gap-4 items-center">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/customer">Customer</Link>
        </li> <li>


          <Link href="/dashboard/admin">Dashboard</Link>
        </li>
        <li>
          <Link href="/login/admin_login">Admin Login</Link>
        </li> 
        <li>
          <Link href="/login/manager_login">Manager Login</Link>
        </li>
     

        {!user ? (
          <>
            <li>
              <Link href="/login/customer_login">Login</Link>
            </li>
            <li>
              <Link href="/signup/customer_signup">Sign Up</Link>
            </li>
          </>
        ) : (
          <>
            <li className="relative">
              <HeaderNotifications />
            </li>

            {/* User dropdown */}
            <li className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold"
              >
                {user.full_name ? user.full_name[0] : 'U'}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white text-blue-600 rounded shadow-lg p-4 w-52 z-50">
                  <p>
                    <strong>{user.full_name}</strong>
                  </p>
                  <p className="text-sm">📞 {user.phone}</p>

                  <Link
                    href={`/profile/${user.phone}`}
                    className="block mt-3 px-3 py-2 bg-green-600 text-white rounded text-center"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block mt-2 w-full px-3 py-2 bg-red-600 text-white rounded"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </>
        )}
      </ul>
    </header>
  );
}
