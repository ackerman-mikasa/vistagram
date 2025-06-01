# Vistagram

A full-stack web application that allows users to capture and share Points of Interest (POI) through images and captions.

## Hosted link 
https://vistagram-aastha.vercel.app/

## Features

- 📸 Image Capture & Upload
  - Capture images using device camera
  - Upload images with captions
- 🕒 Timeline View
  - Browse posts in reverse chronological order
  - Like/Unlike functionality
  - Share posts via link
- 🤖 AI Integration
  - AI-generated captions
  - POI recognition

## Tech Stack

### Frontend
- React with Vite
- Tailwind CSS for styling
- React Query for data fetching
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB for database
- Cloudinary for image storage
- OpenAI API for AI features

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Cloudinary account
- OpenAI API key

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
# Server
PORT=5000
MONGODB_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_api_key

# Client
VITE_API_URL=http://localhost:5000
```

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd vistagram
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Start the development servers
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm run dev
```

## Project Structure
```
vistagram/
├── client/          # React frontend
├── server/          # Express backend
├── tests/           # Test files
└── .env            # Environment variables
```

## Testing
```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 
