// Simple script to fix Phone index issues
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/learnMeNow');

const userSchema = new mongoose.Schema({
  FName: String,
  LName: String,
  Phone: Number,
  Email: String,
  Password: String,
  Role: String,
  IsVerified: Boolean,
  Select: String,
  GoogleId: String,
  Avatar: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function fixPhoneIndex() {
  try {
    console.log('Starting Phone index fix...');
    
    // First, remove Phone field from all users to avoid conflicts
    const result = await User.updateMany(
      { Phone: { $exists: true } },
      { $unset: { Phone: 1 } }
    );
    console.log(`✅ Removed Phone field from ${result.modifiedCount} users`);
    
    // Now we need to manually drop the index using MongoDB shell
    console.log('Please run the following MongoDB commands manually:');
    console.log('1. Open MongoDB Compass or MongoDB shell');
    console.log('2. Connect to your database: learnMeNow');
    console.log('3. Run this command:');
    console.log('   db.users.dropIndex("Phone_1")');
    console.log('4. Then restart your server');
    
    console.log('Phone index fix completed!');
    console.log('After dropping the index manually, restart your server.');
    
  } catch (error) {
    console.error('Error fixing Phone index:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixPhoneIndex();
