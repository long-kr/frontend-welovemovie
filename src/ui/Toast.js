import {
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext({
  // eslint-disable-next-line
  showToast: ({}) => {},
  hideToast: () => {},
});

const DEFAULT_TOAST = {
  id: 0,
  visible: false,
  message: '',
  title: 'Notification',
  variant: 'info',
  placement: 'bottom-right',
  autoHideDuration: 3000,
};

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

const VARIANT_THEMES = {
  info: {
    toast: 'bg-white',
    headerColor: '#0d6efd', // Bootstrap primary color
    bodyClass: 'text-primary',
    closeColor: '#0d6efd',
  },
  success: {
    toast: 'bg-white',
    headerColor: '#198754', // Bootstrap success color
    bodyClass: 'text-success',
    closeColor: '#198754',
  },
  warning: {
    toast: 'bg-white',
    headerColor: '#ffc107', // Bootstrap warning color
    bodyClass: 'text-warning',
    closeColor: '#ffc107',
  },
  error: {
    toast: 'bg-white',
    headerColor: '#dc3545', // Bootstrap danger color
    bodyClass: 'text-danger',
    closeColor: '#dc3545',
  },
};

function ToastOverlay({ toast, onClose }) {
  useEffect(() => {
    if (!toast.visible) return undefined;

    if (toast.autoHideDuration <= 0) return undefined;

    const timerId = setTimeout(onClose, toast.autoHideDuration);

    return () => clearTimeout(timerId);
  }, [toast.visible, toast.autoHideDuration, toast.id, onClose]);

  if (!toast.visible) return null;

  const placementStyle =
    PLACEMENT_STYLES[toast.placement] || PLACEMENT_STYLES['bottom-right'];
  const variantTheme = VARIANT_THEMES[toast.variant] || VARIANT_THEMES.info;
  const role = toast.variant === 'error' ? 'alert' : 'status';
  const ariaLive = toast.variant === 'error' ? 'assertive' : 'polite';

  return (
    <div
      className="toast-container position-fixed p-3"
      style={{ zIndex: 1080, ...placementStyle }}
    >
      <div
        className={[
          'toast',
          'show',
          'border-0',
          toast.autoHideDuration > 0 ? 'fade' : null,
          variantTheme.toast,
        ]
          .filter(Boolean)
          .join(' ')}
        role={role}
        aria-live={ariaLive}
        aria-atomic="true"
        style={{ borderColor: variantTheme.headerColor }}
      >
        <div
          className="toast-header border-bottom"
          style={{
            backgroundColor: 'white',
          }}
        >
          <strong className="mr-auto">{toast.title}</strong>

          <button
            type="button"
            className="ml-2 mb-1 close"
            aria-label="Close notification"
            onClick={onClose}
            style={{ color: variantTheme.closeColor, opacity: 0.8 }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div className={[variantTheme.bodyClass, 'toast-body'].join(' ')}>
          {toast.message}
        </div>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(() => ({ ...DEFAULT_TOAST }));
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const element = document.createElement('div');
    element.setAttribute('data-toast-root', 'true');
    document.body.appendChild(element);
    setPortalElement(element);

    return () => {
      document.body.removeChild(element);
    };
  }, []);

  const hideToast = useCallback(() => {
    setToast(() => ({ ...DEFAULT_TOAST }));
  }, []);

  const showToast = useCallback((messageOrConfig, optionsOrOverrides = {}) => {
    let message = messageOrConfig;
    let options = optionsOrOverrides;

    if (
      typeof messageOrConfig === 'object' &&
      messageOrConfig !== null &&
      !isValidElement(messageOrConfig)
    ) {
      const { message: extractedMessage, ...rest } = messageOrConfig;
      message = extractedMessage;
      options = rest;
    }

    let toastMessage = message;

    if (!isValidElement(toastMessage)) {
      if (typeof toastMessage === 'number') {
        toastMessage = String(toastMessage);
      } else if (typeof toastMessage !== 'string') {
        toastMessage = toastMessage ?? '';
        toastMessage =
          typeof toastMessage === 'string'
            ? toastMessage
            : String(toastMessage);
      }
    }

    setToast(() => {
      const nextDuration =
        typeof options.autoHideDuration === 'number'
          ? options.autoHideDuration
          : DEFAULT_TOAST.autoHideDuration;

      const nextVariant = VARIANT_THEMES[options.variant]
        ? options.variant
        : DEFAULT_TOAST.variant;

      const nextPlacement = PLACEMENT_STYLES[options.placement]
        ? options.placement
        : DEFAULT_TOAST.placement;

      return {
        id: Date.now(),
        visible: true,
        message: toastMessage,
        title: options.title ?? DEFAULT_TOAST.title,
        variant: nextVariant,
        placement: nextPlacement,
        autoHideDuration: nextDuration,
      };
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [showToast, hideToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {portalElement
        ? createPortal(
            <ToastOverlay toast={toast} onClose={hideToast} />,
            portalElement
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider.');
  }

  return context;
}

export default ToastProvider;
