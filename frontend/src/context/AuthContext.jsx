import { createContext, useContext, useEffect, useState } from 'react';
import { fetchMyProfile } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [skinProfile, setSkinProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if we have a saved token, try to fetch the profile with it
  useEffect(() => {
    const token = localStorage.getItem('auraglow_token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMyProfile()
      .then((data) => {
        setUser(data.user);
        setSkinProfile(data.skinProfile);
      })
      .catch(() => {
        localStorage.removeItem('auraglow_token');
      })
      .finally(() => setLoading(false));
  }, []);

  function loginSuccess({ token, user }) {
    localStorage.setItem('auraglow_token', token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('auraglow_token');
    setUser(null);
    setSkinProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, skinProfile, setSkinProfile, loading, loginSuccess, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
