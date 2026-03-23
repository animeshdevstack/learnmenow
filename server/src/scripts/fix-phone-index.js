// Script to completely fix Phone index constraint issues
// This script drops and recreates the Phone index with proper sparse configuration

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/learnMeNow');

async function fixPhoneIndex() {
  try {
    console.log('Starting Phone index fix...');
    
    // Get the database connection
    const db = mongoose.connection.db;
    
    // Drop the existing Phone index
    try {
      await db.collection('users').dropIndex('Phone_1');
      console.log('✅ Dropped existing Phone_1 index');
    } catch (error) {
      console.log('ℹ️ Phone_1 index not found or already dropped');
    }
    
    // Create a new sparse index for Phone field
    await db.collection('users').createIndex(
      { Phone: 1 }, 
      { 
        unique: true, 
        sparse: true,
        name: 'Phone_1_sparse'
      }
    );
    console.log('✅ Created new sparse Phone index');
    
    // Update all users with null Phone to undefined
    const result = await db.collection('users').updateMany(
      { Phone: null },
      { $unset: { Phone: 1 } }
    );
    console.log(`✅ Updated ${result.modifiedCount} users with null Phone values`);
    
    console.log('Phone index fix completed successfully!');
    console.log('You can now restart your server and test OAuth again.');
    
  } catch (error) {
    console.error('Error fixing Phone index:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixPhoneIndex();
