import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ onLogin }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);

    const { data, error: signInError } = await signIn(email, password);
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
    } else if (data?.user) {
      if (onLogin) {
        onLogin(data.user);
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 p-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">FinTrack</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome back! Sign in to your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl text-sm border bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
