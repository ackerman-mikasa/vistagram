import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import PostCard from '../components/PostCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Timeline() {
  const queryClient = useQueryClient();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/posts`);
      return response.data;
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await axios.post(`${API_URL}/posts/${postId}/like`, {
        username: 'currentUser', // In a real app, this would come from auth
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });

  const shareMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await axios.post(`${API_URL}/posts/${postId}/share`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error loading posts: {error.message}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Timeline</h1>
      {posts?.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={likeMutation.mutate}
          onShare={shareMutation.mutate}
        />
      ))}
    </div>
  );
}

export default Timeline; 