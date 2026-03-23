// Script to fix existing users with Phone constraint issues
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

async function fixExistingUsers() {
  try {
    console.log('Starting existing users fix...');
    
    // Find all users with null Phone values
    const usersWithNullPhone = await User.find({ Phone: null });
    console.log(`Found ${usersWithNullPhone.length} users with null Phone values`);
    
    // Update users with null Phone to have undefined instead
    for (const user of usersWithNullPhone) {
      await User.findByIdAndUpdate(user._id, { $unset: { Phone: 1 } });
      console.log(`Fixed user: ${user.Email}`);
    }
    
    // Also fix any users that might have duplicate Phone values
    const allUsers = await User.find({});
    const phoneMap = new Map();
    const duplicateUsers = [];
    
    for (const user of allUsers) {
      if (user.Phone !== null && user.Phone !== undefined) {
        if (phoneMap.has(user.Phone)) {
          duplicateUsers.push(user);
        } else {
          phoneMap.set(user.Phone, user);
        }
      }
    }
    
    console.log(`Found ${duplicateUsers.length} users with duplicate Phone values`);
    
    // Remove Phone from duplicate users (keep the first one)
    for (const user of duplicateUsers) {
      await User.findByIdAndUpdate(user._id, { $unset: { Phone: 1 } });
      console.log(`Removed Phone from duplicate user: ${user.Email}`);
    }
    
    console.log('Existing users fix completed successfully!');
    console.log('You can now restart your server and test OAuth again.');
    
  } catch (error) {
    console.error('Error fixing existing users:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixExistingUsers();
