import { createContext, useState, useEffect } from "react";
import type { User, UserContextType } from "../types";
import { getUserProfile } from "../services/User.service";

export const UserDataContext = createContext<UserContextType>({} as UserContextType);

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [Data, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("user_token");
      if (token && !Data) {
        try {
          const res = await getUserProfile(token);
          if (res.success && res.data) {
            setUserData(res.data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchUserData();
  }, []);

  function saveUserData(data: User | null) {
    setUserData(data);
  }

  return <UserDataContext.Provider value={{ Data, saveUserData }}>{children}</UserDataContext.Provider>;
}
