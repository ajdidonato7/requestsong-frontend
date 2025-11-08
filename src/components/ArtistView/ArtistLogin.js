import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';

const ArtistLogin = () => {
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/artist/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError('');

    const result = await login(data.username, data.password);

    if (result.success) {
      navigate('/artist/dashboard');
    } else {
      setLoginError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="container" style={{ paddingBottom: '20px' }}>
      <div className="safe-area-top">
        <div className="max-w-md mx-auto mt-8">
          <div className="text-center mb-8">
            <h1>🎤 Artist Login</h1>
            <p className="text-gray-600">
              Sign in to manage your song requests
            </p>
          </div>

          <div className="card">
            <div className="card-body">
              {loginError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 mb-0">
                    ❌ {loginError}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className={`form-input ${errors.username ? 'form-error' : ''}`}
                    placeholder="Enter your username"
                    {...register('username', {
                      required: 'Username is required',
                      minLength: {
                        value: 3,
                        message: 'Username must be at least 3 characters'
                      }
                    })}
                  />
                  {errors.username && (
                    <div className="error-message">{errors.username.message}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className={`form-input ${errors.password ? 'form-error' : ''}`}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  {errors.password && (
                    <div className="error-message">{errors.password.message}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading mr-2"></span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/artist/register"
                    className="text-primary-color font-medium hover:underline"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to song requests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistLogin;