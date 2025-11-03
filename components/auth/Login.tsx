
import React, { useState } from 'react';
import { WaterDropIcon } from '../icons/WaterDropIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeOffIcon } from '../icons/EyeOffIcon';

interface LoginProps {
  onLogin: () => void;
  showSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, showSignup }) => {
  // Only these three users can log in
  const allowedEmails = [
    'user1@example.com', // replace with real allowed email
    'user2@example.com',
    'user3@example.com'
  ];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Restrict access to only allowed emails
    if (!allowedEmails.includes(email.toLowerCase())) {
      setError('Access denied. You are not an authorized user.');
      setIsLoading(false);
      return;
    }

    // Check localStorage for registered users
    setTimeout(() => {
      try {
        const raw = window.localStorage.getItem('users');
        const users = raw ? JSON.parse(raw) as Array<{ email: string; password: string }> : [];
        if (!email || !password) {
          setError('Please enter both email and password.');
          setIsLoading(false);
          return;
        }

        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (found) {
          // Persist the current user so the app can display the admin name
          try {
            window.localStorage.setItem('currentUser', JSON.stringify(found));
          } catch (err) {
            console.warn('Failed to persist current user', err);
          }
          onLogin();
        } else {
          setError('Invalid credentials. Please sign up or check your email/password.');
        }
      } catch (err) {
        console.error(err);
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-blue to-brand-lightblue">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl transform transition-all hover:scale-105">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-brand-accent rounded-full mb-4">
            <WaterDropIcon className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-center text-brand-text-primary">
            Admin Sign In
          </h2>
          <p className="mt-2 text-center text-md text-brand-text-secondary">
            Welcome back to the Nishat Beverages dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
               <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 z-20"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400 transition-colors duration-300"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-brand-text-secondary">
          Don't have an account?{' '}
          <button onClick={showSignup} className="font-medium text-brand-blue hover:text-brand-accent">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;