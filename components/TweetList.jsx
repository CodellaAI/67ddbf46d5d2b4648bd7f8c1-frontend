
import { useState, useEffect } from 'react';
import axios from 'axios';
import Tweet from './Tweet';
import { toast } from 'react-toastify';

export default function TweetList({ tweets: propTweets }) {
  const [tweets, setTweets] = useState(propTweets || []);
  const [loading, setLoading] = useState(!propTweets);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (propTweets) {
      setTweets(propTweets);
      return;
    }

    const fetchTweets = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tweets?page=${page}`);
        if (page === 1) {
          setTweets(res.data);
        } else {
          setTweets(prev => [...prev, ...res.data]);
        }
        setHasMore(res.data.length === 10); // Assuming 10 tweets per page
      } catch (error) {
        toast.error('Failed to load tweets');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [page, propTweets]);

  const handleLike = async (tweetId) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tweets/${tweetId}/like`);
      setTweets(prev => 
        prev.map(tweet => 
          tweet._id === tweetId 
            ? { 
                ...tweet, 
                likes: res.data.isLiked 
                  ? [...tweet.likes, res.data.userId] 
                  : tweet.likes.filter(id => id !== res.data.userId) 
              } 
            : tweet
        )
      );
    } catch (error) {
      toast.error('Failed to like tweet');
      console.error(error);
    }
  };

  const handleRetweet = async (tweetId) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tweets/${tweetId}/retweet`);
      setTweets(prev => 
        prev.map(tweet => 
          tweet._id === tweetId 
            ? { 
                ...tweet, 
                retweets: res.data.isRetweeted 
                  ? [...tweet.retweets, res.data.userId] 
                  : tweet.retweets.filter(id => id !== res.data.userId) 
              } 
            : tweet
        )
      );
    } catch (error) {
      toast.error('Failed to retweet');
      console.error(error);
    }
  };

  const handleDelete = async (tweetId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tweets/${tweetId}`);
      setTweets(prev => prev.filter(tweet => tweet._id !== tweetId));
      toast.success('Tweet deleted successfully');
    } catch (error) {
      toast.error('Failed to delete tweet');
      console.error(error);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && tweets.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-twitter-blue"></div>
      </div>
    );
  }

  return (
    <div>
      {tweets.length > 0 ? (
        <>
          {tweets.map(tweet => (
            <Tweet 
              key={tweet._id} 
              tweet={tweet} 
              onLike={handleLike} 
              onRetweet={handleRetweet}
              onDelete={handleDelete}
            />
          ))}
          
          {!propTweets && hasMore && (
            <div className="flex justify-center py-5">
              <button 
                onClick={loadMore} 
                className="text-twitter-blue hover:bg-blue-50 dark:hover:bg-gray-800 font-medium py-2 px-4 rounded-full transition-colors"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="p-4 text-center text-gray-500">
          No tweets found.
        </div>
      )}
    </div>
  );
}
