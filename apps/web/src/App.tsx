import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth-context';
import { RequireAuth } from './components/require-auth';
import { SignupPage } from './pages/signup-page';
import { SigninPage } from './pages/signin-page';
import { AppPage } from './pages/app-page';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <AppPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
