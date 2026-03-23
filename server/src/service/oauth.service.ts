/** @format */

import userModel from "../model/user.model";
import { IUser, ISignedInUser } from "./interface/IUserService";
import { generateToken } from "../helper/jwt-handler";

interface IGoogleProfile {
  id: string;
  displayName?: string;
  emails?: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
  _json?: {
    id?: string;
    sub?: string;
    name?: string;
    email?: string;
    emails?: Array<{ value: string }>;
    picture?: string;
    photos?: Array<{ value: string }>;
  };
}

const googleSignInService = async (profile: IGoogleProfile): Promise<ISignedInUser> => {
  try {
    // Debug: Log profile structure
    console.log("Google profile received:", JSON.stringify(profile, null, 2));
    
    // Validate profile data with more flexible checks
    if (!profile) {
      throw new Error("Invalid Google profile: profile is null or undefined");
    }
    
    // Check for Google ID in different possible locations
    const googleId = profile.id || profile._json?.id || profile._json?.sub;
    console.log("SIGNIN - Google ID found:", googleId);
    console.log("SIGNIN - Profile.id:", profile.id);
    console.log("SIGNIN - Profile._json?.id:", profile._json?.id);
    console.log("SIGNIN - Profile._json?.sub:", profile._json?.sub);
    
    if (!googleId) {
      console.error("SIGNIN - Profile structure:", profile);
      console.error("SIGNIN - Available profile keys:", Object.keys(profile));
      if (profile._json) {
        console.error("SIGNIN - Available _json keys:", Object.keys(profile._json));
      }
      throw new Error("Invalid Google profile: missing ID");
    }
    
    // Check for email in different possible locations
    const emails = profile.emails || profile._json?.emails || [];
    const email = emails.length > 0 ? emails[0].value : profile._json?.email;
    
    if (!email) {
      console.error("Profile emails structure:", profile.emails, profile._json?.emails);
      throw new Error("Invalid Google profile: missing email");
    }
    
    // Check if user exists with this email
    let user = await userModel.findOne({ Email: email });
    
    if (!user) {
      // Create new user with Google OAuth data
      const displayName = profile.displayName || profile._json?.name || 'Google User';
      const nameParts = displayName.split(' ');
      const FName = nameParts[0] || 'Google';
      const LName = nameParts.slice(1).join(' ') || 'User';
      
      // Get avatar URL safely from different possible locations
      const photos = profile.photos || profile._json?.photos || [];
      const avatarUrl = photos.length > 0 && photos[0]?.value 
        ? photos[0].value 
        : profile._json?.picture || '';
      
      user = new userModel({
        FName,
        LName,
        Email: email,
        // Phone and Password are optional for Google OAuth users
        Role: "User",
        IsVerified: true, // Google accounts are pre-verified
        GoogleId: googleId,
        Avatar: avatarUrl,
      });
      
      await user.save();
    } else {
      // Update existing user with Google ID if not already set
      if (!user.GoogleId) {
        // Only update Google-specific fields, don't touch Phone or Password
        const updateData: any = {
          GoogleId: googleId,
        };
        
        // Update avatar safely from different possible locations
        const photos = profile.photos || profile._json?.photos || [];
        const avatarUrl = photos.length > 0 && photos[0]?.value 
          ? photos[0].value 
          : profile._json?.picture || user.Avatar;
        if (avatarUrl) {
          updateData.Avatar = avatarUrl;
        }
        
        // Use findByIdAndUpdate to avoid validation issues
        await userModel.findByIdAndUpdate(user._id, updateData, { new: true });
        user = await userModel.findById(user._id);
      }
    }
    
    // Generate JWT token
    const token = generateToken(
      { 
        id: user?._id, 
        role: user?.Role, 
        email: user?.Email 
      }, 
      "7d"
    );
    
    return {
      User: {
        FName: user?.FName || undefined,
        LName: user?.LName || undefined,
        Phone: user?.Phone ? Number(user?.Phone) : undefined,
        Email: user?.Email || undefined,
        Role: user?.Role || undefined,
        IsVerified: user?.IsVerified || undefined,
        _id: user?._id?.toString() || '',
      },
      Token: token,
    };
  } catch (error: any) {
    throw new Error(error.message || "Google sign-in failed");
  }
};

const googleSignUpService = async (profile: IGoogleProfile): Promise<ISignedInUser> => {
  try {
    // Debug: Log profile structure
    console.log("Google signup profile received:", JSON.stringify(profile, null, 2));
    
    // Validate profile data with more flexible checks
    if (!profile) {
      throw new Error("Invalid Google profile: profile is null or undefined");
    }
    
    // Check for Google ID in different possible locations
    const googleId = profile.id || profile._json?.id || profile._json?.sub;
    console.log("SIGNUP - Google ID found:", googleId);
    console.log("SIGNUP - Profile.id:", profile.id);
    console.log("SIGNUP - Profile._json?.id:", profile._json?.id);
    console.log("SIGNUP - Profile._json?.sub:", profile._json?.sub);
    
    if (!googleId) {
      console.error("SIGNUP - Profile structure:", profile);
      console.error("SIGNUP - Available profile keys:", Object.keys(profile));
      if (profile._json) {
        console.error("SIGNUP - Available _json keys:", Object.keys(profile._json));
      }
      throw new Error("Invalid Google profile: missing ID");
    }
    
    // Check for email in different possible locations
    const emails = profile.emails || profile._json?.emails || [];
    const email = emails.length > 0 ? emails[0].value : profile._json?.email;
    
    if (!email) {
      console.error("Profile emails structure:", profile.emails, profile._json?.emails);
      throw new Error("Invalid Google profile: missing email");
    }
    
    // Check if user already exists
    const existingUser = await userModel.findOne({ Email: email });
    if (existingUser) {
      throw new Error("User already exists with this email. Please sign in instead.");
    }
    
    // Create new user with Google OAuth data
    const displayName = profile.displayName || profile._json?.name || 'Google User';
    const nameParts = displayName.split(' ');
    const FName = nameParts[0] || 'Google';
    const LName = nameParts.slice(1).join(' ') || 'User';
    
    // Get avatar URL safely from different possible locations
    const photos = profile.photos || profile._json?.photos || [];
    const avatarUrl = photos.length > 0 && photos[0]?.value 
      ? photos[0].value 
      : profile._json?.picture || '';
    
    const user = new userModel({
      FName,
      LName,
      Email: email,
      // Phone and Password are optional for Google OAuth users
      Role: "User",
      IsVerified: true, // Google accounts are pre-verified
      GoogleId: googleId,
      Avatar: avatarUrl,
    });
    
    await user.save();
    
    // Generate JWT token
    const token = generateToken(
      { 
        id: user._id, 
        role: user.Role, 
        email: user.Email 
      }, 
      "7d"
    );
    
    return {
      User: {
        FName: user.FName || undefined,
        LName: user.LName || undefined,
        Phone: user.Phone ? Number(user.Phone) : undefined,
        Email: user.Email || undefined,
        Role: user.Role || undefined,
        IsVerified: user.IsVerified || undefined,
        _id: user._id.toString(),
      },
      Token: token,
    };
  } catch (error: any) {
    throw new Error(error.message || "Google sign-up failed");
  }
};

export { googleSignInService, googleSignUpService };
