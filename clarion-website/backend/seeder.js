// === seeder.js (fixed) ===

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resource = require('./models/Resource');

// Load env variables
dotenv.config();

// Sample resources
const resources = [
  {
    title: "Deep Learning Specialization by Andrew Ng",
    type: "course",
    tags: ["deep learning", "neural networks", "AI"],
    link: "https://coursera.org/specializations/deep-learning",
    rating: 9.6,
    popularity: 8500
  },
  {
    title: "Machine Learning A-Z™: Hands-On Python & R",
    type: "course",
    tags: ["machine learning", "python", "data science"],
    link: "https://udemy.com/course/machinelearning/",
    rating: 9.2,
    popularity: 6800
  },
  {
    title: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
    type: "book",
    tags: ["machine learning", "deep learning", "python"],
    link: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/",
    rating: 9.5,
    popularity: 5000
  },
  {
    title: "MIT 6.S191: Introduction to Deep Learning",
    type: "video",
    tags: ["deep learning", "MIT", "neural networks"],
    link: "http://introtodeeplearning.com/",
    rating: 9.4,
    popularity: 4500
  },
  {
    title: "The Elements of Statistical Learning",
    type: "book",
    tags: ["statistics", "machine learning", "data analysis"],
    link: "https://web.stanford.edu/~hastie/ElemStatLearn/",
    rating: 9.0,
    popularity: 3500
  }
];

// Connect to DB and import
const connectAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clarion', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected ✅');

    await Resource.deleteMany();
    console.log('Old resources deleted.');

    await Resource.insertMany(resources);
    console.log('Sample resources seeded successfully 🌱');

    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error.message);
    process.exit(1);
  }
};

connectAndSeed();
