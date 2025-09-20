import { useEffect } from 'react';

const PLACEMENT_STYLES = {
  'top-left': { top: '1.5rem', left: '1.5rem', right: 'auto', bottom: 'auto' },
  'top-right': { top: '1.5rem', right: '1.5rem', left: 'auto', bottom: 'auto' },
  'bottom-left': {
    bottom: '1.5rem',
    left: '1.5rem',
    right: 'auto',
    top: 'auto',
  },
  'bottom-right': {
    bottom: '1.5rem',
    right: '1.5rem',
    left: 'auto',
    top: 'auto',
  },
};

function Toast({
  isOpen,
  message,
  type = 'info',
  autoHideDuration = 5000,
  onClose,
  action,
  placement = 'bottom-right',
  className = '',
  style,
}) {
  useEffect(() => {
    if (!isOpen || !onClose || autoHideDuration <= 0) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      onClose();
    }, autoHideDuration);

    return () => clearTimeout(timerId);
  }, [isOpen, autoHideDuration, onClose]);

  if (!isOpen) {
    return null;
  }

  const severity = ['success', 'error', 'warning'].includes(type)
    ? type
    : 'info';
  const placementStyle =
    PLACEMENT_STYLES[placement] || PLACEMENT_STYLES['bottom-right'];
  const mergedStyle = { ...placementStyle, ...style };

  return (
    <div
      className={['app-toast', `app-toast--${severity}`, className]
        .filter(Boolean)
        .join(' ')}
      role={severity === 'error' ? 'alert' : 'status'}
      aria-live={severity === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      style={mergedStyle}
    >
      <div className="app-toast__message">{message}</div>
      {action ? <div className="app-toast__action">{action}</div> : null}
      {onClose ? (
        <button
          type="button"
          className="app-toast__close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      ) : null}
    </div>
  );
}

export default Toast;
