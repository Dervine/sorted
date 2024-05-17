import { signIn } from 'next-auth/react';
import React, { useState, useEffect } from 'react';

const SignIn: React.FC = () => {
  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const response = await fetch('/api/apartments');
      if (!response.ok) {
        throw new Error('Failed to fetch apartments');
      }
      const data = await response.json();
      setApartments(data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
      setError('Failed to fetch apartments');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      email,
      password,
      apartment: selectedApartment,
      redirect: false,
    });

    if (!result.error) {
      // Successful sign-in, do something
      console.log('Signed in successfully');
    } else {
      // Failed sign-in, handle error
      console.error('Sign-in failed:', result.error);
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center">
            <img className="mx-auto h-32 w-auto" src="/logo.svg" alt="Your Logo" />
            <h2 className="-mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="apartment" className="sr-only">Apartment</label>
                <select
                  id="apartment"
                  value={selectedApartment}
                  onChange={(e) => setSelectedApartment(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                >
                  <option value="">Select Apartment</option>
                  {apartments.map((apartment: any) => (
                    <option key={apartment._id} value={apartment._id}>{apartment.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white font-semibold rounded-lg shadow-md"
              >
                Sign in
              </button>
            </div>
          </form>

          {/* Error section */}
          {error && (
            <div className="mt-4 p-2 bg-red-100 text-red-500 rounded">
              Sign-in failed: Please check your credentials.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
