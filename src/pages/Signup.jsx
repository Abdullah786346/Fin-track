import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Signup = ({ onSignup }) => {
  const { sendSignInLink } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);

    const { data, error } = await sendSignInLink(email, fullName);
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setLinkSent(true);
      setError('Check your email for the sign-in link!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">FinTrack</h1>
            <p className="text-slate-500 mt-2">Create your account</p>
          </div>

          {!linkSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="you@example.com"
                />
              </div>

              {error && (
                <div className={`p-3 rounded-lg text-sm ${
                  error.includes('sign-in link') 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Sign-in Link'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Check your email</h3>
              <p className="text-slate-600">
                We've sent a sign-in link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-slate-500">
                Click the link in the email to sign in to your account.
              </p>
              <button
                onClick={() => {
                  setLinkSent(false);
                  setError('');
                }}
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              >
                Send another link
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
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
