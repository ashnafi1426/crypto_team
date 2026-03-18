import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

// Default blank profile for when no user is logged in
const DEFAULT_PROFILE = {
  fullName: '',
  username: '',
  email: '',
  phone: '',
  country: '',
  avatar: null
};

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    // On mount, try to load from localStorage (persists across page refresh)
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_PROFILE;
  });

  const updateProfile = (data) => {
    setProfile(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem('userProfile', JSON.stringify(updated));
      return updated;
    });
  };

  const loginUser = (email) => {
    // Derive display name from email (e.g. "yoni@gmail.com" → "Yoni")
    const namePart = email.split('@')[0];
    const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/[._]/g, ' ');
    const newProfile = {
      fullName: displayName,
      username: namePart.toLowerCase(),
      email,
      phone: '',
      country: '',
      avatar: null
    };
    setProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  const logoutUser = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem('userProfile');
  };

  return (
    <UserContext.Provider value={{ profile, setProfile: updateProfile, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
