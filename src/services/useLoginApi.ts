// src/hooks/useLoginApi.ts
import * as Realm from 'realm-web';
import { useNavigate } from '@tanstack/react-router';
import { app } from '../utils/constants';
import { searchDoctors } from './realmServices';
import { useUser } from '../context/userContext';
import { User } from './types';
import toast from 'react-hot-toast';

export const useLoginApi = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const login = async (apiKey: string) => {
    // console.log('apiKey', apiKey);

    const credentials = Realm.Credentials.apiKey(apiKey);
    try {
      const realmUser = await app.logIn(credentials);
      const data = await searchDoctors(realmUser.id);
      if (data === null) return;
      if (data.length > 0) {
        localStorage.setItem('userid', apiKey);
        toast.success('Logged in successfully');

        const user: User = {
          ...data[0], // Assuming searchDoctors returns an array and we take the first element
        };

        setUser(user); // Set the full user data in the context
        navigate({ to: '/appointments' });
      } else {
        toast.error('Incorrect API key');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Incorrect Credentials.\n Failed to log in');
    }
  };

  return { login };
};
