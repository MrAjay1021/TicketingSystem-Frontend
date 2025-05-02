/**
 * Toast utility functions for showing notifications
 */

/**
 * Show a toast notification
 * @param {string} type - 'success', 'error', or 'info'
 * @param {string} message - The message to display
 */
export const showToast = (type, message) => {
  if (!message) return;
  
  window.dispatchEvent(
    new CustomEvent('showToast', {
      detail: { type, message }
    })
  );
};

/**
 * Show a success toast notification
 * @param {string} message - The message to display
 */
export const showSuccessToast = (message) => {
  showToast('success', message);
};

/**
 * Show an error toast notification
 * @param {string} message - The message to display
 */
export const showErrorToast = (message) => {
  showToast('error', message);
};

/**
 * Show an info toast notification
 * @param {string} message - The message to display
 */
export const showInfoToast = (message) => {
  showToast('info', message);
}; 