import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { signinSchema, SigninInput } from '../validation';
import { useAuth } from '../auth-context';
import { AuthLayout } from '../components/auth-layout';
import { ApiError } from '../api';

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200';

export function SigninPage() {
  const { signin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SigninInput>({ resolver: zodResolver(signinSchema) });

  const onSubmit = async (data: SigninInput) => {
    try {
      await signin(data.email, data.password);
      window.location.href = '/';
    } catch (err) {
      setError('root', {
        message: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {errors.root && (
          <div role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {errors.root.message}
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input id="email" type="email" autoComplete="email" className={inputClass} placeholder="you@example.com" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input id="password" type="password" autoComplete="current-password" className={inputClass} placeholder="••••••••" {...register('password')} />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        No account yet?{' '}
        <Link to="/signup" className="font-medium text-indigo-600 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
