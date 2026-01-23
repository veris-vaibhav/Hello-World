import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const demoAccounts = [
    { email: 'admin@veris.com', password: 'admin123', role: 'Building Admin' },
    { email: 'tenant@company.com', password: 'tenant123', role: 'Tenant Admin' },
    { email: 'facility@veris.com', password: 'facility123', role: 'Facility Manager' },
    { email: 'security@veris.com', password: 'security123', role: 'Security Guard' },
    { email: 'employee@company.com', password: 'employee123', role: 'Employee' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">VERIS ParkPro</h1>
              <p className="text-sm text-gray-500">Smart Parking Management</p>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Demo Accounts</h3>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                  }}
                  className="w-full text-left px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-sm"
                >
                  <span className="font-medium text-gray-900">{account.role}</span>
                  <span className="text-gray-500 ml-2">({account.email})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Hero Image/Info */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">
            Intelligent Parking Management for Modern Workplaces
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Streamline your parking operations with real-time occupancy tracking,
            smart booking systems, and comprehensive analytics.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-primary-200 text-sm">Parking Spots</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-3xl font-bold">98%</p>
              <p className="text-primary-200 text-sm">Utilization Rate</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-primary-200 text-sm">Monitoring</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-3xl font-bold">5+</p>
              <p className="text-primary-200 text-sm">Tenants</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
