import React, { useState, useEffect } from 'react';

interface DisplayNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (displayName: string) => void;
  currentDisplayName: string;
  defaultName: string;
}

function DisplayNameModal({ isOpen, onClose, onSave, currentDisplayName, defaultName }: DisplayNameModalProps) {
  const [displayName, setDisplayName] = useState(currentDisplayName || defaultName);

  useEffect(() => {
    if (isOpen) {
      setDisplayName(currentDisplayName || defaultName);
    }
  }, [isOpen, currentDisplayName, defaultName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = displayName.trim();
    if (trimmedName) {
      onSave(trimmedName);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-somnia-medium rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-somnia-light">
          <h2 className="text-xl font-bold text-somnia-text">Display Name</h2>
          <button
            onClick={onClose}
            className="text-somnia-text-secondary hover:text-somnia-text transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-somnia-text mb-2">
              Your Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name..."
              maxLength={50}
              className="w-full bg-somnia-light border border-somnia-light text-somnia-text rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-somnia-accent"
              required
            />
            <p className="mt-2 text-xs text-somnia-text-secondary">
              This name will appear with your messages
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-somnia-light hover:bg-somnia-dark text-somnia-text font-medium py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-somnia-accent hover:bg-somnia-accent-dark text-white font-bold py-2 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-somnia-medium focus:ring-somnia-accent"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DisplayNameModal;
