
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { FaTwitter, FaHome, FaHashtag, FaBell, FaEnvelope, FaBookmark, FaList, FaUser, FaEllipsisH } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <div className="flex flex-col justify-between h-screen sticky top-0 p-4">
      <div>
        <div className="flex items-center justify-center md:justify-start p-3 mb-4">
          <Link href="/" className="text-twitter-blue">
            <FaTwitter className="h-8 w-8" />
          </Link>
        </div>
        
        <nav className="space-y-2">
          <Link href="/" className="flex items-center p-3 text-xl rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <FaHome className="mr-4" />
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link href="/explore" className="flex items-center p-3 text-xl rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <FaHashtag className="mr-4" />
            <span className="hidden md:inline">Explore</span>
          </Link>
          <button className="flex items-center p-3 text-xl rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left">
            <FaBell className="mr-4" />
            <span className="hidden md:inline">Notifications</span>
          </button>
          <button className="flex items-center p-3 text-xl rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left">
            <FaEnvelope className="mr-4" />
            <span className="hidden md:inline">Messages</span>
          </button>
          <button className="flex items-center p-3 text-xl rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left">
            <FaBookmark className="mr-4" />
            <span className="hidden md:inline">Bookmarks</span>
          </button>
          <button className="flex items-center p-3 text-xl rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left">
            <FaList className="mr-4" />
            <span className="hidden md:inline">Lists</span>
          </button>
          {user && (
            <Link 
              href={`/profile/${user.username}`} 
              className="flex items-center p-3 text-xl rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FaUser className="mr-4" />
              <span className="hidden md:inline">Profile</span>
            </Link>
          )}
          <button className="flex items-center p-3 text-xl rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left">
            <FaEllipsisH className="mr-4" />
            <span className="hidden md:inline">More</span>
          </button>
        </nav>
        
        <button 
          className="bg-twitter-blue hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full w-full mt-4 transition-colors"
        >
          <span className="hidden md:inline">Tweet</span>
          <span className="md:hidden">+</span>
        </button>
      </div>
      
      {user && (
        <div 
          className="flex items-center p-3 mt-auto rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          onClick={handleLogout}
        >
          <img 
            src={user.profileImage || 'https://via.placeholder.com/40'} 
            alt={user.name} 
            className="h-10 w-10 rounded-full mr-3"
          />
          <div className="hidden md:block">
            <p className="font-bold">{user.name}</p>
            <p className="text-gray-500">@{user.username}</p>
          </div>
        </div>
      )}
    </div>
  );
}
