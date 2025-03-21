
import { useState, useRef } from 'react';
import axios from 'axios';
import { FaImage, FaSmile, FaPoll, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function TweetComposer() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !image) return;
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }
      
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tweets`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setContent('');
      setImage(null);
      setImagePreview('');
      toast.success('Tweet posted successfully!');
      
      // Refresh the timeline - this could be handled better with context or SWR
      window.location.reload();
    } catch (error) {
      toast.error('Failed to post tweet');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex">
        <img 
          src={user?.profileImage || 'https://via.placeholder.com/48'} 
          alt={user?.name} 
          className="h-12 w-12 rounded-full mr-4"
        />
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full bg-transparent border-none focus:outline-none text-xl resize-none placeholder-gray-500"
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
            />
            
            {imagePreview && (
              <div className="relative mt-2 mb-4">
                <button 
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview('');
                  }}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white rounded-full p-1"
                >
                  &times;
                </button>
                <img src={imagePreview} alt="Preview" className="max-h-80 rounded-2xl" />
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2 text-twitter-blue">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800"
                >
                  <FaImage />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
                <button type="button" className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800">
                  <FaSmile />
                </button>
                <button type="button" className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800">
                  <FaPoll />
                </button>
                <button type="button" className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800">
                  <FaCalendarAlt />
                </button>
              </div>
              <button
                type="submit"
                disabled={(!content.trim() && !image) || loading}
                className={`bg-twitter-blue text-white font-bold px-4 py-2 rounded-full ${
                  (!content.trim() && !image) || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                }`}
              >
                {loading ? 'Posting...' : 'Tweet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
