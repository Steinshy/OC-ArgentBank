import { signInUser, logoutUser } from '@/features/Auth/authThunks';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/api/argentBankApi';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectAuthToken, selectAuthLoading, selectAuthError, selectIsAuthenticated } from '@/store/selectors';
import { SignInRequest, UpdateProfileData } from '@/types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAuthToken);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
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
