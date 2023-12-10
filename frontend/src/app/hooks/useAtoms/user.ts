import { useAtom } from 'jotai';
import { userAtom } from '@/app/hooks/atoms/user';
import { TLUserData } from '@/@types/user';

export const useUser = () => {
  const [user, setUser] = useAtom(userAtom);

  const initializeUser = (user: TLUserData) => {
    setUser(user);
  };

  const clearUser = () => {
    setUser(null);
  };

  return {
    user,
    initializeUser,
    clearUser,
  };
}