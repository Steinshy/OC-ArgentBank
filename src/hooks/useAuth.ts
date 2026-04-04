import { useDispatch, useSelector } from 'react-redux';

import { signInUser, logoutUser, fetchUserProfile, updateUserProfile } from '@/features/Auth/authThunks';
import { AppDispatch, RootState } from '@/store/store';
import { SignInRequest } from '@/types';

interface UpdateProfileData {
  token: string;
  firstName: string;
  lastName: string;
}

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  return {
    ...auth,
    signIn: (credentials: SignInRequest) => dispatch(signInUser(credentials)),
    logout: () => dispatch(logoutUser()),
    fetchProfile: (token: string) => dispatch(fetchUserProfile(token)),
    updateProfile: (data: UpdateProfileData) => dispatch(updateUserProfile(data)),
  };
};
