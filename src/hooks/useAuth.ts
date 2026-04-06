import { signInUser, logoutUser } from '@/features/Auth/authThunks';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/api/argentBankApi';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { SignInRequest } from '@/types';

interface UpdateProfileData {
  firstName: string;
  lastName: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: user } = useGetProfileQuery(undefined, { skip: !isAuthenticated });
  const [updateProfile] = useUpdateProfileMutation();

  return {
    token,
    loading,
    error,
    isAuthenticated,
    user: user ?? null,
    signIn: (credentials: SignInRequest) => dispatch(signInUser(credentials)),
    logout: () => dispatch(logoutUser()),
    updateProfile: (data: UpdateProfileData) => updateProfile(data),
  };
};
