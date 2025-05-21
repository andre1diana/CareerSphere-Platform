import React, { createContext, useState, useEffect } from 'react';


export const AuthContext = createContext({
  user: { 
    role: 'guest', 
    name: '', 
    profileImage: '', 
    experience: [], 
    education: [],
    companyId: null,
    userId: 0 
  },
  login: () => {},
  logout: () => {},
  updateUser: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    console.log('Initial user data from localStorage:', savedUser);
    return savedUser
      ? JSON.parse(savedUser)
      : { 
          role: 'guest', 
          name: '', 
          profileImage: '', 
          experience: [], 
          education: [],
          companyId: null,
          userId: 0 
        };
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  useEffect(() => {
    console.log('Saving user data to localStorage:', user);
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = (userData, token) => {
    console.log('Login called with user data:', userData);
    setUser(userData);
    if (token) setToken(token);
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:8080/authenticate/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Eroare la delogare:", error);
    }
  
    setUser({ 
      role: 'guest', 
      name: '', 
      profileImage: '', 
      experience: [], 
      education: [], 
      companyId: null,
      userId: 0
    });
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (updatedUser) => {
    console.log('Updating user data:', updatedUser);
    setUser(prevUser => {
      const newUser = { ...prevUser, ...updatedUser };
      console.log('New user data after update:', newUser);
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
