
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import TweetList from '../components/TweetList';
import TweetComposer from '../components/TweetComposer';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-twitter-blue"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10 bg-white dark:bg-twitter-dark">
        <h1 className="text-xl font-bold">Home</h1>
      </div>
      <TweetComposer />
      <TweetList />
    </Layout>
  );
}
