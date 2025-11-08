import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';

const ArtistRegister = () => {
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/artist/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setRegisterError('');

    const result = await registerUser({
      username: data.username,
      display_name: data.displayName,
      email: data.email,
      password: data.password,
      bio: data.bio || null
    });

    if (result.success) {
      setRegisterSuccess(true);
      setTimeout(() => {
        navigate('/artist/login');
      }, 2000);
    } else {
      setRegisterError(result.error);
    }

    setIsLoading(false);
  };

  if (registerSuccess) {
    return (
      <div className="container">
        <div className="safe-area-top">
          <div className="max-w-md mx-auto mt-8">
            <div className="card">
              <div className="card-body text-center">
                <div className="mb-4">
                  <div className="text-6xl mb-4">✅</div>
                  <h2 className="text-green-600 mb-4">Registration Successful!</h2>
                  <p className="text-gray-600 mb-4">
                    Your artist account has been created successfully.
                  </p>
                  <p className="text-sm text-gray-500">
                    Redirecting to login page...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '20px' }}>
      <div className="safe-area-top">
        <div className="max-w-md mx-auto mt-8">
          <div className="text-center mb-8">
            <h1>🎤 Artist Registration</h1>
            <p className="text-gray-600">
              Create your account to start receiving song requests
            </p>
          </div>

          <div className="card">
            <div className="card-body">
              {registerError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 mb-0">
                    ❌ {registerError}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    Username *
                  </label>
                  <input
                    type="text"
                    id="username"
                    className={`form-input ${errors.username ? 'form-error' : ''}`}
                    placeholder="Choose a unique username"
                    {...register('username', {
                      required: 'Username is required',
                      minLength: {
                        value: 3,
                        message: 'Username must be at least 3 characters'
                      },
                      maxLength: {
                        value: 30,
                        message: 'Username cannot exceed 30 characters'
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_-]+$/,
                        message: 'Username can only contain letters, numbers, hyphens, and underscores'
                      }
                    })}
                  />
                  {errors.username && (
                    <div className="error-message">{errors.username.message}</div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    This will be your public artist handle
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="displayName" className="form-label">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    className={`form-input ${errors.displayName ? 'form-error' : ''}`}
                    placeholder="Your stage name or real name"
                    {...register('displayName', {
                      required: 'Display name is required',
                      minLength: {
                        value: 1,
                        message: 'Display name cannot be empty'
                      },
                      maxLength: {
                        value: 100,
                        message: 'Display name cannot exceed 100 characters'
                      }
                    })}
                  />
                  {errors.displayName && (
                    <div className="error-message">{errors.displayName.message}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`form-input ${errors.email ? 'form-error' : ''}`}
                    placeholder="your@email.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <div className="error-message">{errors.email.message}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    className={`form-input ${errors.password ? 'form-error' : ''}`}
                    placeholder="Create a secure password"
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

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`form-input ${errors.confirmPassword ? 'form-error' : ''}`}
                    placeholder="Confirm your password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value =>
                        value === password || 'Passwords do not match'
                    })}
                  />
                  {errors.confirmPassword && (
                    <div className="error-message">{errors.confirmPassword.message}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="bio" className="form-label">
                    Bio (Optional)
                  </label>
                  <textarea
                    id="bio"
                    className={`form-textarea ${errors.bio ? 'form-error' : ''}`}
                    placeholder="Tell people about your music..."
                    rows="3"
                    {...register('bio', {
                      maxLength: {
                        value: 500,
                        message: 'Bio cannot exceed 500 characters'
                      }
                    })}
                  />
                  {errors.bio && (
                    <div className="error-message">{errors.bio.message}</div>
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
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/artist/login"
                    className="text-primary-color font-medium hover:underline"
                  >
                    Sign in here
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

export default ArtistRegister;