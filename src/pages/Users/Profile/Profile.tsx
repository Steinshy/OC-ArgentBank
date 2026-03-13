import { useSelector } from 'react-redux';

import { RootState } from '@/store/store';

export function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="profile">
      <h1>User Profile</h1>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <p>Name: {user.firstName} {user.lastName}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
