import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Upload() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      navigate('/');
    },
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
        setImage(file);
        stopCamera();
      }, 'image/jpeg');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !caption) return;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);
    formData.append('username', 'currentUser'); // In a real app, this would come from auth

    uploadMutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Upload New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          {!image && !isCameraActive && (
            <button
              type="button"
              onClick={startCamera}
              className="btn btn-primary w-full"
            >
              Start Camera
            </button>
          )}

          {isCameraActive && (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              <button
                type="button"
                onClick={captureImage}
                className="btn btn-primary w-full"
              >
                Capture Image
              </button>
            </div>
          )}

          {image && (
            <div className="space-y-4">
              <img
                src={URL.createObjectURL(image)}
                alt="Captured"
                className="w-full rounded-lg"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="btn btn-secondary w-full"
              >
                Retake
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
            Caption
          </label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Write a caption..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={!image || !caption || uploadMutation.isLoading}
          className="btn btn-primary w-full"
        >
          {uploadMutation.isLoading ? 'Uploading...' : 'Upload Post'}
        </button>
      </form>
    </div>
  );
}

export default Upload; 