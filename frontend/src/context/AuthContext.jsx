import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchMyProfile } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [skinProfile, setSkinProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem('auraglow_skin_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  function setSkinProfile(profile) {
    setSkinProfileState(profile);
    if (profile) {
      localStorage.setItem('auraglow_skin_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('auraglow_skin_profile');
    }
  }

  // On first load, if we have a saved token, try to fetch the profile with it
  useEffect(() => {
    const token = localStorage.getItem('auraglow_token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMyProfile()
      .then((data) => {
        if (data?.user) setUser(data.user);
        if (data?.skinProfile) {
          setSkinProfile(data.skinProfile);
        }
      })
      .catch(() => {
        localStorage.removeItem('auraglow_token');
      })
      .finally(() => setLoading(false));
  }, []);

  async function loginSuccess({ token, user, skinProfile: incomingProfile }) {
    localStorage.setItem('auraglow_token', token);
    setUser(user);
    if (incomingProfile) {
      setSkinProfile(incomingProfile);
    } else {
      // Fetch latest profile from DB to ensure skinProfile is populated immediately
      try {
        const freshData = await fetchMyProfile();
        if (freshData?.skinProfile) {
          setSkinProfile(freshData.skinProfile);
        }
      } catch (err) {
        console.warn('Could not auto-fetch skin profile on login:', err.message);
      }
    }
  }

  const refreshProfile = useCallback(async () => {
    try {
      const data = await fetchMyProfile();
      if (data?.user) setUser(data.user);
      if (data?.skinProfile) {
        setSkinProfile(data.skinProfile);
      }
      return data;
    } catch (err) {
      console.warn('Could not refresh profile:', err.message);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logout() {
    localStorage.removeItem('auraglow_token');
    localStorage.removeItem('auraglow_cart');
    localStorage.removeItem('auraglow_wishlist');
    localStorage.removeItem('auraglow_skin_profile');
    setUser(null);
    setSkinProfileState(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        skinProfile,
        setSkinProfile,
        refreshProfile,
        loading,
        loginSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
