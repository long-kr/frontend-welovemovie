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

/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} ToastVariant
 * @typedef {'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'} ToastPlacement
 * @typedef {Object} Toast
 * @property {number} id
 * @property {boolean} visible
 * @property {React.ReactNode} message
 * @property {string} title
 * @property {ToastVariant} variant
 * @property {ToastPlacement} placement
 * @property {number} autoHideDuration
 */

/** @type {React.Context<{ showToast: (msg: any, opts?: any) => void, hideToast: () => void }>} */
const ToastContext = createContext({
  // eslint-disable-next-line
  showToast: ({}) => {},
  hideToast: () => {},
});

/** @type {Toast} */
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

/**
 * @param {Object} props
 * @param {Toast} props.toast
 * @param {() => void} props.onClose
 */
function ToastOverlay({ toast, onClose }) {
  useEffect(() => {
    if (!toast.visible) return undefined;

    if (toast.autoHideDuration <= 0) return undefined;

    const timerId = setTimeout(onClose, toast.autoHideDuration);

    return () => clearTimeout(timerId);
  }, [toast.visible, toast.autoHideDuration, toast.id, onClose]);

  if (!toast.visible) return null;

  const placement = toast.placement || DEFAULT_TOAST.placement;
  const variant = toast.variant || DEFAULT_TOAST.variant;
  const placementStyle =
    PLACEMENT_STYLES[placement] || PLACEMENT_STYLES['bottom-right'];
  const variantTheme = VARIANT_THEMES[variant] || VARIANT_THEMES.info;
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

/**
 * @typedef {Object} ToastOptions
 * @property {number} [autoHideDuration]
 * @property {ToastVariant} [variant]
 * @property {ToastPlacement} [placement]
 * @property {string} [title]
 */

/**
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(() => ({ ...DEFAULT_TOAST }));
  const [portalElement, setPortalElement] = useState(
    /** @type {HTMLElement|null} */ (null)
  );

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

  /**
   * @param {React.ReactNode | { message: React.ReactNode } & Partial<Toast>} messageOrConfig
   * @param {Partial<Toast>} [optionsOrOverrides]
   */
  const showToast = useCallback(
    /**
     * @param {React.ReactNode | ({ message: React.ReactNode } & Partial<Toast>)} messageOrConfig
     * @param {Partial<Toast>} [optionsOrOverrides]
     */
    (messageOrConfig, optionsOrOverrides = {}) => {
      /** @type {Partial<Toast>} */
      let options = optionsOrOverrides;
      /** @type {React.ReactNode} */
      let message;

      // Type guard for the config object shape
      if (
        messageOrConfig &&
        typeof messageOrConfig === 'object' &&
        !isValidElement(messageOrConfig) &&
        'message' in messageOrConfig &&
        messageOrConfig.message !== undefined
      ) {
        message = messageOrConfig.message;
        options = messageOrConfig;
      } else {
        message = /** @type {React.ReactNode} */ (messageOrConfig);
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

        // Safe access since we know these are literal types via ToastVariant & ToastPlacement
        const variant = /** @type {keyof typeof VARIANT_THEMES} */ (
          options.variant
        );
        const placement = /** @type {keyof typeof PLACEMENT_STYLES} */ (
          options.placement
        );

        const nextVariant =
          variant && VARIANT_THEMES[variant] ? variant : DEFAULT_TOAST.variant;

        const nextPlacement =
          placement && PLACEMENT_STYLES[placement]
            ? placement
            : DEFAULT_TOAST.placement;

        /** @type {Toast} */
        const nextToast = {
          id: Date.now(),
          visible: true,
          message: toastMessage,
          title: options.title ?? DEFAULT_TOAST.title,
          variant: nextVariant,
          placement: nextPlacement,
          autoHideDuration: nextDuration,
        };
        return nextToast;
      });
    },
    []
  );

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

/**
 * Hook to use toast notifications
 * @returns {{ showToast: (msg: React.ReactNode | { message: React.ReactNode } & Partial<Toast>, opts?: Partial<Toast>) => void, hideToast: () => void }}
 */
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider.');
  }

  return context;
}

export default ToastProvider;
