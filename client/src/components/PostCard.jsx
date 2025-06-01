import { useState } from 'react';
import { HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

function PostCard({ post, onLike, onShare }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post._id);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(shareUrl);
    setShowShareTooltip(true);
    onShare(post._id);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  return (
    <div className="card max-w-2xl mx-auto mb-8">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          {post.username[0].toUpperCase()}
        </div>
        <div className="ml-3">
          <p className="font-medium">{post.username}</p>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <img
        src={post.imageUrl}
        alt={post.caption}
        className="w-full h-96 object-cover rounded-lg mb-4"
      />

      <p className="text-gray-800 mb-4">{post.caption}</p>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleLike}
          className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
        >
          {isLiked ? (
            <HeartIconSolid className="h-6 w-6 text-red-600" />
          ) : (
            <HeartIcon className="h-6 w-6" />
          )}
          <span>{post.likes}</span>
        </button>

        <div className="relative">
          <button
            onClick={handleShare}
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
          >
            <ShareIcon className="h-6 w-6" />
            <span>{post.shares}</span>
          </button>
          
          {showShareTooltip && (
            <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded">
              Link copied!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostCard; 