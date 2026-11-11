import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth-context';

export function AppPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <img src="/logo.svg" alt="Easygenerator" className="h-7" />
        <button
          onClick={() => {
            logout();
            navigate('/signin');
          }}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Logout
        </button>
      </header>
      <main className="flex flex-col items-center justify-center px-4 py-32">
        <h1 className="text-3xl font-bold text-slate-900">Welcome to the application.</h1>
        {user && <p className="mt-2 text-slate-500">Signed in as {user.name} ({user.email})</p>}
      </main>
    </div>
  );
}
