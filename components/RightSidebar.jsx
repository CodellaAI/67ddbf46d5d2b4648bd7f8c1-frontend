
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function RightSidebar() {
  const [trendingTopics, setTrendingTopics] = useState([
    { id: 1, name: 'NextJS', category: 'Technology', tweetCount: '5,234' },
    { id: 2, name: 'TailwindCSS', category: 'Web Development', tweetCount: '3,456' },
    { id: 3, name: 'JavaScript', category: 'Programming', tweetCount: '10,987' },
    { id: 4, name: 'React', category: 'Frontend', tweetCount: '8,765' },
    { id: 5, name: 'MongoDB', category: 'Database', tweetCount: '2,345' }
  ]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      if (user) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/suggestions`);
          setSuggestedUsers(res.data);
        } catch (error) {
          console.error('Failed to fetch user suggestions:', error);
        }
      }
    };

    fetchSuggestedUsers();
  }, [user]);

  return (
    <div className="p-4 sticky top-0 overflow-y-auto h-screen">
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search Chirp"
          className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl mb-6">
        <h2 className="font-bold text-xl p-4">What's happening</h2>
        {trendingTopics.map(topic => (
          <div key={topic.id} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <p className="text-xs text-gray-500">Trending in {topic.category}</p>
            <p className="font-bold">#{topic.name}</p>
            <p className="text-xs text-gray-500">{topic.tweetCount} Tweets</p>
          </div>
        ))}
        <Link href="/explore" className="block text-twitter-blue p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-xl">
          Show more
        </Link>
      </div>
      
      {user && suggestedUsers.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl">
          <h2 className="font-bold text-xl p-4">Who to follow</h2>
          {suggestedUsers.map(suggestedUser => (
            <div key={suggestedUser._id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <img 
                  src={suggestedUser.profileImage || 'https://via.placeholder.com/40'} 
                  alt={suggestedUser.name} 
                  className="h-12 w-12 rounded-full mr-3"
                />
                <div>
                  <Link href={`/profile/${suggestedUser.username}`} className="font-bold hover:underline">
                    {suggestedUser.name}
                  </Link>
                  <p className="text-gray-500">@{suggestedUser.username}</p>
                </div>
              </div>
              <button className="bg-black dark:bg-white text-white dark:text-black font-bold py-1 px-4 rounded-full text-sm">
                Follow
              </button>
            </div>
          ))}
          <Link href="/explore?tab=people" className="block text-twitter-blue p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-xl">
            Show more
          </Link>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-4 px-4">
        <span className="mr-2">Terms of Service</span>
        <span className="mr-2">Privacy Policy</span>
        <span className="mr-2">Cookie Policy</span>
        <span className="mr-2">Accessibility</span>
        <span className="mr-2">Ads info</span>
        <span>More</span>
        <p className="mt-2">© 2023 Chirp, Inc.</p>
      </div>
    </div>
  );
}
