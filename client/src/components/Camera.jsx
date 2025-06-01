import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const navigate = useNavigate();

  const createPostMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, formData, {
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
      console.log('Starting camera...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('Video stream ready');
          videoRef.current.play();
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Error accessing camera: ' + err.message);
    }
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      startCamera();
    }

    return () => {
      mounted = false;
      if (stream) {
        console.log('Cleaning up camera stream');
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    console.log('Attempting to capture image...');
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref not available');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Ensure video is playing and has valid dimensions
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.error('Video not ready');
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

    try {
      // Draw the current video frame on the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log('Frame drawn to canvas');

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          console.log('Blob created, size:', blob.size);
          const imageUrl = URL.createObjectURL(blob);
          setCapturedImage(imageUrl);
          
          // Stop the camera stream
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        } else {
          console.error('Failed to create blob from canvas');
        }
      }, 'image/jpeg', 0.95);
    } catch (err) {
      console.error('Error capturing image:', err);
      setError('Error capturing image: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (capturedImage) {
      try {
        // Convert the captured image URL to a File object
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
        formData.append('image', file);
        console.log('Image file created:', file.size, 'bytes');
      } catch (err) {
        console.error('Error creating file from captured image:', err);
        setError('Error preparing image for upload: ' + err.message);
        return;
      }
    }

    createPostMutation.mutate(formData);
  };

  const retakePhoto = () => {
    console.log('Retaking photo...');
    setCapturedImage(null);
    startCamera();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Take a Photo</h2>
        
        {!capturedImage ? (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg"
            />
            <canvas ref={canvasRef} className="hidden" />
            <button
              onClick={captureImage}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Capture
            </button>
          </div>
        ) : (
          <div>
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full rounded-lg mb-4"
            />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Caption</label>
                <textarea
                  name="caption"
                  required
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={retakePhoto}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Retake
                </button>
                <button
                  type="submit"
                  disabled={createPostMutation.isPending}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {createPostMutation.isPending ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Camera; 