
import { useState } from 'react';
import { FaCalendarAlt, FaLink, FaMapMarkerAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function ProfileHeader({ profile, isCurrentUser, isFollowing, onFollow }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    bio: profile.bio || '',
    location: profile.location || '',
    website: profile.website || '',
  });
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="h-48 bg-twitter-blue relative">
        {profile.coverImage && (
          <img 
            src={profile.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      <div className="px-4 py-3 relative">
        <div className="absolute -top-16 border-4 border-white dark:border-twitter-dark rounded-full">
          <img 
            src={profile.profileImage || 'https://via.placeholder.com/128'} 
            alt={profile.name} 
            className="h-32 w-32 rounded-full"
          />
        </div>
        
        <div className="flex justify-end mt-4 mb-6">
          {isCurrentUser ? (
            editing ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditing(false)}
                  className="border border-gray-300 dark:border-gray-600 text-black dark:text-white font-medium px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-black dark:bg-white text-white dark:text-black font-medium px-4 py-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="border border-gray-300 dark:border-gray-600 text-black dark:text-white font-medium px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Edit profile
              </button>
            )
          ) : (
            <button
              onClick={onFollow}
              className={`font-bold px-4 py-2 rounded-full ${
                isFollowing
                  ? 'border border-gray-300 dark:border-gray-600 hover:border-red-500 hover:text-red-500'
                  : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
        
        {editing ? (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                maxLength={50}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="form-input"
                rows={3}
                maxLength={160}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                maxLength={30}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="form-input"
                placeholder="https://example.com"
              />
            </div>
          </form>
        ) : (
          <>
            <div className="mt-6">
              <h1 className="text-xl font-bold">{profile.name}</h1>
              <p className="text-gray-500">@{profile.username}</p>
            </div>
            
            {profile.bio && (
              <p className="mt-3">{profile.bio}</p>
            )}
            
            <div className="flex flex-wrap mt-3 text-gray-500">
              {profile.location && (
                <div className="flex items-center mr-4">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{profile.location}</span>
                </div>
              )}
              
              {profile.website && (
                <div className="flex items-center mr-4">
                  <FaLink className="mr-1" />
                  <a 
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-twitter-blue hover:underline"
                  >
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              
              <div className="flex items-center">
                <FaCalendarAlt className="mr-1" />
                <span>Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}</span>
              </div>
            </div>
            
            <div className="flex mt-3">
              <div className="mr-4">
                <span className="font-bold">{profile.following.length}</span>
                <span className="text-gray-500 ml-1">Following</span>
              </div>
              <div>
                <span className="font-bold">{profile.followers.length}</span>
                <span className="text-gray-500 ml-1">Followers</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
