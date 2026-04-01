import { useDispatch, useSelector } from 'react-redux';

import { loginUser, logoutUser, fetchUserProfile, updateUserProfile } from '@/features/Auth/authThunks';
import { AppDispatch, RootState } from '@/store/store';
import { LoginRequest } from '@/types';

interface UpdateProfileData {
  token: string;
  firstName: string;
  lastName: string;
}

/**
 * Custom hook for authentication state and actions
 * Provides access to auth state and dispatches auth-related thunks
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  return {
    ...auth,
    login: (credentials: LoginRequest) => dispatch(loginUser(credentials)),
    logout: () => dispatch(logoutUser()),
    fetchProfile: (token: string) => dispatch(fetchUserProfile(token)),
    updateProfile: (data: UpdateProfileData) => dispatch(updateUserProfile(data)),
  };
};
