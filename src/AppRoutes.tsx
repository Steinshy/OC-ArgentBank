import { Routes, Route } from 'react-router';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Home } from '@/pages/Home/Home';
import { Login } from '@/pages/Login/Login';
import { NotFound } from '@/pages/NotFound/NotFound';
import { Profile } from '@/pages/Users/Profile/Profile';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
