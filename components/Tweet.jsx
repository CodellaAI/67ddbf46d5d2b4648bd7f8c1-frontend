
import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FaRegHeart, FaHeart, FaRetweet, FaRegComment, FaShare, FaEllipsisH, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Tweet({ tweet, onLike, onRetweet, onDelete }) {
  const { user } = useAuth();
  const [showOptions, setShowOptions] = useState(false);
  
  const isLiked = user && tweet.likes.includes(user._id);
  const isRetweeted = user && tweet.retweets.includes(user._id);
  const isAuthor = user && tweet.user._id === user._id;

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="flex">
        <div className="mr-3">
          <Link href={`/profile/${tweet.user.username}`}>
            <img 
              src={tweet.user.profileImage || 'https://via.placeholder.com/48'} 
              alt={tweet.user.name} 
              className="h-12 w-12 rounded-full"
            />
          </Link>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <Link href={`/profile/${tweet.user.username}`} className="font-bold hover:underline">
                {tweet.user.name}
              </Link>
              <span className="text-gray-500 ml-1">@{tweet.user.username} · {formatDate(tweet.createdAt)}</span>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowOptions(!showOptions)} 
                className="text-gray-500 hover:text-twitter-blue hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full p-2"
              >
                <FaEllipsisH />
              </button>
              
              {showOptions && isAuthor && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <button 
                    onClick={() => {
                      onDelete(tweet._id);
                      setShowOptions(false);
                    }} 
                    className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <p className="mt-2 text-gray-900 dark:text-gray-100">{tweet.content}</p>
          
          {tweet.image && (
            <div className="mt-3 rounded-2xl overflow-hidden">
              <img src={tweet.image} alt="Tweet" className="w-full h-auto" />
            </div>
          )}
          
          <div className="flex justify-between mt-3 max-w-md">
            <button className="flex items-center text-gray-500 hover:text-blue-500 group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-gray-800">
                <FaRegComment />
              </div>
              <span className="ml-1">{tweet.replies?.length || 0}</span>
            </button>
            
            <button 
              onClick={() => onRetweet(tweet._id)} 
              className={`flex items-center ${isRetweeted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'} group`}
            >
              <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-gray-800">
                <FaRetweet />
              </div>
              <span className="ml-1">{tweet.retweets.length}</span>
            </button>
            
            <button 
              onClick={() => onLike(tweet._id)} 
              className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} group`}
            >
              <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-gray-800">
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </div>
              <span className="ml-1">{tweet.likes.length}</span>
            </button>
            
            <button className="flex items-center text-gray-500 hover:text-twitter-blue group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-gray-800">
                <FaShare />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
