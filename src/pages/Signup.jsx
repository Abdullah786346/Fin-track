import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Signup = ({ onSignup }) => {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { data, error: signUpErr } = await signUp(email, password, fullName);
    setLoading(false);

    if (signUpErr) {
      setError(signUpErr.message);
    } else if (data?.user) {
      if (onSignup) {
        onSignup(data.user);
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
            <p className="text-slate-500 dark:text-slate-400 mt-2">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="John Doe"
              />
            </div>

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
                minLength={4}
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="Password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={4}
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="Re-enter password"
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
