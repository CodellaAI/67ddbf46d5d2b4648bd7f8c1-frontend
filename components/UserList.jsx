
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function UserList({ users, currentUser }) {
  const [followingState, setFollowingState] = useState(() => {
    return users.reduce((acc, user) => {
      acc[user._id] = user.followers.includes(currentUser?._id);
      return acc;
    }, {});
  });

  const handleFollow = async (userId) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/follow`);
      setFollowingState(prev => ({
        ...prev,
        [userId]: res.data.isFollowing
      }));
      toast.success(res.data.isFollowing ? 'Followed successfully' : 'Unfollowed successfully');
    } catch (error) {
      toast.error('Failed to follow/unfollow');
      console.error(error);
    }
  };

  return (
    <div>
      {users.map(user => (
        <div key={user._id} className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href={`/profile/${user.username}`}>
                <img 
                  src={user.profileImage || 'https://via.placeholder.com/48'} 
                  alt={user.name} 
                  className="h-12 w-12 rounded-full mr-3"
                />
              </Link>
              <div>
                <Link href={`/profile/${user.username}`} className="font-bold hover:underline">
                  {user.name}
                </Link>
                <p className="text-gray-500">@{user.username}</p>
                {user.bio && (
                  <p className="mt-1 text-sm">{user.bio}</p>
                )}
              </div>
            </div>
            
            {currentUser && currentUser._id !== user._id && (
              <button
                onClick={() => handleFollow(user._id)}
                className={`font-bold px-4 py-1 rounded-full text-sm ${
                  followingState[user._id]
                    ? 'border border-gray-300 dark:border-gray-600 hover:border-red-500 hover:text-red-500'
                    : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                }`}
              >
                {followingState[user._id] ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
