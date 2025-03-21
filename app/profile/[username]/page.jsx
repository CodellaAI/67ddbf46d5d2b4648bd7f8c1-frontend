
"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import Layout from '../../../components/Layout';
import TweetList from '../../../components/TweetList';
import ProfileHeader from '../../../components/ProfileHeader';
import { toast } from 'react-toastify';

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`);
        setProfile(res.data);
        
        const tweetsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tweets/user/${res.data._id}`);
        setTweets(tweetsRes.data);
      } catch (error) {
        toast.error('Failed to load profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  const handleFollow = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/${profile._id}/follow`);
      setProfile(prev => ({
        ...prev,
        followers: res.data.isFollowing 
          ? [...prev.followers, user._id]
          : prev.followers.filter(id => id !== user._id)
      }));
      toast.success(res.data.isFollowing ? 'Followed successfully' : 'Unfollowed successfully');
    } catch (error) {
      toast.error('Failed to follow/unfollow');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-twitter-blue"></div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-xl font-bold">User not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ProfileHeader 
        profile={profile} 
        isCurrentUser={user?._id === profile._id}
        isFollowing={profile.followers.includes(user?._id)}
        onFollow={handleFollow}
      />
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button className="flex-1 py-4 font-medium text-center border-b-2 border-twitter-blue text-twitter-blue">
            Tweets
          </button>
          <button className="flex-1 py-4 font-medium text-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
            Tweets & Replies
          </button>
          <button className="flex-1 py-4 font-medium text-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
            Media
          </button>
          <button className="flex-1 py-4 font-medium text-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
            Likes
          </button>
        </div>
      </div>
      <TweetList tweets={tweets} />
    </Layout>
  );
}
