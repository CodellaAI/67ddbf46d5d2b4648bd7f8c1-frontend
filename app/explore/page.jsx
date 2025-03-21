
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import TweetList from '../../components/TweetList';
import UserList from '../../components/UserList';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ tweets: [], users: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tweets');
  const { user } = useAuth();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/search?q=${searchQuery}`);
      setSearchResults(res.data);
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10 bg-white dark:bg-twitter-dark">
        <h1 className="text-xl font-bold mb-4">Explore</h1>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search Chirp"
            className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <button type="submit" className="sr-only">Search</button>
        </form>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-twitter-blue"></div>
        </div>
      ) : searchQuery ? (
        <div>
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button 
              className={`flex-1 py-3 font-medium ${activeTab === 'tweets' ? 'text-twitter-blue border-b-2 border-twitter-blue' : 'text-gray-500'}`}
              onClick={() => setActiveTab('tweets')}
            >
              Tweets
            </button>
            <button 
              className={`flex-1 py-3 font-medium ${activeTab === 'users' ? 'text-twitter-blue border-b-2 border-twitter-blue' : 'text-gray-500'}`}
              onClick={() => setActiveTab('users')}
            >
              People
            </button>
          </div>
          
          {activeTab === 'tweets' ? (
            searchResults.tweets.length > 0 ? (
              <TweetList tweets={searchResults.tweets} />
            ) : (
              <div className="p-4 text-center text-gray-500">No tweets found matching your search.</div>
            )
          ) : (
            searchResults.users.length > 0 ? (
              <UserList users={searchResults.users} currentUser={user} />
            ) : (
              <div className="p-4 text-center text-gray-500">No users found matching your search.</div>
            )
          )}
        </div>
      ) : (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">What&apos;s happening</h2>
          {/* Trending topics would go here */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
            <p className="text-gray-500 text-sm">Trending in Technology</p>
            <p className="font-bold">#NextJS</p>
            <p className="text-gray-500 text-sm">5,234 Tweets</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
            <p className="text-gray-500 text-sm">Trending in Web Development</p>
            <p className="font-bold">#TailwindCSS</p>
            <p className="text-gray-500 text-sm">3,456 Tweets</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-sm">Trending in Programming</p>
            <p className="font-bold">#JavaScript</p>
            <p className="text-gray-500 text-sm">10,987 Tweets</p>
          </div>
        </div>
      )}
    </Layout>
  );
}
