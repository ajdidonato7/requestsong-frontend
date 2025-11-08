import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const RequestForm = ({ onSubmit, artistName }) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onFormSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    const result = await onSubmit({
      song_title: data.songTitle,
      song_artist: data.songArtist,
      requester_name: data.requesterName,
      message: data.message || null,
      tip_amount: data.tipAmount ? parseFloat(data.tipAmount) : null
    });

    if (result.success) {
      setSubmitSuccess(true);
      reset();
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } else {
      setSubmitError(result.error);
    }

    setSubmitting(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="mb-0">Request a Song</h3>
        <p className="text-sm text-gray-600 mt-2 mb-0">
          Send a request to {artistName}
        </p>
      </div>

      <div className="card-body">
        {submitSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 mb-0">
              ✅ Your request has been submitted successfully!
            </p>
          </div>
        )}

        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 mb-0">
              ❌ {submitError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="form-group">
            <label htmlFor="songTitle" className="form-label">
              Song Title *
            </label>
            <input
              type="text"
              id="songTitle"
              className={`form-input ${errors.songTitle ? 'form-error' : ''}`}
              placeholder="Enter song title"
              {...register('songTitle', {
                required: 'Song title is required',
                minLength: {
                  value: 1,
                  message: 'Song title cannot be empty'
                }
              })}
            />
            {errors.songTitle && (
              <div className="error-message">{errors.songTitle.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="songArtist" className="form-label">
              Song Artist *
            </label>
            <input
              type="text"
              id="songArtist"
              className={`form-input ${errors.songArtist ? 'form-error' : ''}`}
              placeholder="Enter artist/band name"
              {...register('songArtist', {
                required: 'Song artist is required',
                minLength: {
                  value: 1,
                  message: 'Song artist cannot be empty'
                }
              })}
            />
            {errors.songArtist && (
              <div className="error-message">{errors.songArtist.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="requesterName" className="form-label">
              Your Name *
            </label>
            <input
              type="text"
              id="requesterName"
              className={`form-input ${errors.requesterName ? 'form-error' : ''}`}
              placeholder="Enter your name"
              {...register('requesterName', {
                required: 'Your name is required',
                minLength: {
                  value: 1,
                  message: 'Name cannot be empty'
                }
              })}
            />
            {errors.requesterName && (
              <div className="error-message">{errors.requesterName.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Message (Optional)
            </label>
            <textarea
              id="message"
              className="form-textarea"
              placeholder="Add a personal message..."
              rows="3"
              {...register('message', {
                maxLength: {
                  value: 500,
                  message: 'Message cannot exceed 500 characters'
                }
              })}
            />
            {errors.message && (
              <div className="error-message">{errors.message.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tipAmount" className="form-label">
              Tip Amount (Optional)
            </label>
            <input
              type="number"
              id="tipAmount"
              className={`form-input ${errors.tipAmount ? 'form-error' : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0"
              {...register('tipAmount', {
                min: {
                  value: 0,
                  message: 'Tip amount cannot be negative'
                }
              })}
            />
            {errors.tipAmount && (
              <div className="error-message">{errors.tipAmount.message}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="loading mr-2"></span>
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;