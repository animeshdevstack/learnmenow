// Script to fix Phone constraint issues for Google OAuth users
// Run this script to clean up existing data

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

async function fixPhoneConstraint() {
  try {
    console.log('Starting Phone constraint fix...');
    
    // Find all users with null Phone values
    const usersWithNullPhone = await User.find({ Phone: null });
    console.log(`Found ${usersWithNullPhone.length} users with null Phone values`);
    
    // Update users with null Phone to have undefined instead
    for (const user of usersWithNullPhone) {
      await User.findByIdAndUpdate(user._id, { $unset: { Phone: 1 } });
      console.log(`Fixed user: ${user.Email}`);
    }
    
    console.log('Phone constraint fix completed successfully!');
    console.log('You can now restart your server and test OAuth again.');
    
  } catch (error) {
    console.error('Error fixing Phone constraint:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixPhoneConstraint();
