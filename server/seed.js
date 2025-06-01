const mongoose = require('mongoose');
const Post = require('./models/Post');
require('dotenv').config();

const samplePosts = [
  {
    username: "travel_lover",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    caption: "Beautiful sunset at Lake Louise! 🏔️ #nature #mountains #canada",
    likes: 245,
    shares: 12,
    likedBy: ["nature_photographer", "adventure_seeker"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    username: "foodie_adventures",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    caption: "Homemade pasta night! 🍝 #foodie #cooking #homemade",
    likes: 189,
    shares: 8,
    likedBy: ["chef_mike", "food_lover"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    username: "tech_enthusiast",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    caption: "Just got my hands on the latest tech! 💻 #technology #gadgets",
    likes: 156,
    shares: 5,
    likedBy: ["gadget_guru", "tech_reviewer"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    username: "fitness_motivation",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    caption: "Morning workout complete! 💪 #fitness #motivation #health",
    likes: 312,
    shares: 15,
    likedBy: ["gym_buddy", "fitness_coach"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    username: "art_gallery",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
    caption: "New painting in progress 🎨 #art #creativity #painting",
    likes: 278,
    shares: 9,
    likedBy: ["art_lover", "creative_soul"],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    // Insert new posts
    await Post.insertMany(samplePosts);
    console.log('Successfully seeded database with sample posts');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 