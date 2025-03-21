
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaHashtag, FaBell, FaEnvelope } from 'react-icons/fa';

export default function MobileNav({ showMenu, setShowMenu }) {
  const { user } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-twitter-dark border-t border-gray-200 dark:border-gray-800 z-10">
      <div className="flex justify-around items-center py-3">
        <Link href="/" className="flex flex-col items-center">
          <FaHome className="h-6 w-6 text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">Home</span>
        </Link>
        <Link href="/explore" className="flex flex-col items-center">
          <FaHashtag className="h-6 w-6 text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">Explore</span>
        </Link>
        <button className="flex flex-col items-center">
          <FaBell className="h-6 w-6 text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">Notifications</span>
        </button>
        <button className="flex flex-col items-center">
          <FaEnvelope className="h-6 w-6 text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">Messages</span>
        </button>
      </div>
    </div>
  );
}
