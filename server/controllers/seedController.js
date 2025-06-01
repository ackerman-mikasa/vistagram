const OpenAI = require('openai');
const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate sample posts using OpenAI
exports.generateSeedData = async (req, res) => {
  try {
    const prompt = `Generate 5 sample social media posts about Points of Interest (POIs). 
    Each post should have:
    1. A username (random travel enthusiast name)
    2. A caption (describing the POI and experience)
    3. A timestamp (within the last 30 days)
    
    Format the response as a JSON array of objects with these fields:
    {
      "username": string,
      "caption": string,
      "timestamp": string (ISO date)
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const posts = JSON.parse(completion.choices[0].message.content);

    // Upload sample images to Cloudinary
    const sampleImages = [
      'https://source.unsplash.com/random/800x600/?landmark',
      'https://source.unsplash.com/random/800x600/?monument',
      'https://source.unsplash.com/random/800x600/?architecture',
      'https://source.unsplash.com/random/800x600/?travel',
      'https://source.unsplash.com/random/800x600/?tourist'
    ];

    // Create posts with images
    for (let i = 0; i < posts.length; i++) {
      const imageUrl = sampleImages[i];
      const post = new Post({
        username: posts[i].username,
        caption: posts[i].caption,
        imageUrl,
        createdAt: new Date(posts[i].timestamp),
        likes: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50)
      });
      await post.save();
    }

    res.json({ message: 'Seed data generated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error generating seed data', error: error.message });
  }
}; 