import { createContext, useState, useEffect } from 'react';
import type { User, UserContextType } from '../types';

export const UserDataContext = createContext<UserContextType>({} as UserContextType);

/** Manages auth context provider logic. */
export default function AuthContextProvider({ children }:{children: React.ReactNode}) {
  const [Data, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("user_token");
      if (token && !Data) {
        try {
          const { getUserProfile } = await import('../services/Profile.service');
          const res = await getUserProfile(token);
          if (res.success && res.data) {
            setUserData(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      }
    };
    fetchUserData();
  }, []);

  /** Manages save user data logic. */
  function saveUserData(data: User | null) {
    setUserData(data);
  }

  return (
    <UserDataContext.Provider value={{ Data, saveUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}
