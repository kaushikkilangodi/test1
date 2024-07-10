// src/context/userContext.ts
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { User } from '../services/types';
import { searchDoctors } from '../services/realmServices';
import { app } from '../utils/constants';
import * as Realm from 'realm-web';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchUserProfile: () => Promise<User | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserProfile = async (): Promise<User | null> => {
    const apiKey = localStorage.getItem('userid') || '';
    if (apiKey.length > 0) {
      const credentials = Realm.Credentials.apiKey(apiKey);
      try {
        const realmUser = await app.logIn(credentials);
        const data = await searchDoctors(realmUser.id);
        if (data === null) return null;
        return {
          ...data[0],
        };
      } catch (error) {
        console.error('Failed to fetch user data', error);
        return null;
      }
    }
    return null;
  };
  // console.log(user);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await fetchUserProfile();
      if (fetchedUser) {
        setUser(fetchedUser);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
