// src/components/ui/Alert.tsx
import { ReactNode } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX, FiXCircle } from 'react-icons/fi';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}: AlertProps) => {
  const variants = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-200',
      icon: <FiCheckCircle className="h-5 w-5 text-green-400" />,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-200',
      icon: <FiXCircle className="h-5 w-5 text-red-400" />,
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: <FiAlertCircle className="h-5 w-5 text-yellow-400" />,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-200',
      icon: <FiInfo className="h-5 w-5 text-blue-400" />,
    },
  };

  const { bg, text, icon } = variants[variant];

  return (
    <div
      className={`rounded-md p-4 ${bg} ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          {title && (
            <h3
              className={`text-sm font-medium ${text} ${
                children ? 'mb-1' : ''
              }`}
            >
              {title}
            </h3>
          )}
          {children && (
            <div className={`text-sm ${text}`}>
              {typeof children === 'string' ? <p>{children}</p> : children}
            </div>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${text} hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  variant === 'success'
                    ? 'hover:bg-green-100 focus:ring-green-400 focus:ring-offset-green-50 dark:focus:ring-offset-green-900/30'
                    : variant === 'error'
                    ? 'hover:bg-red-100 focus:ring-red-400 focus:ring-offset-red-50 dark:focus:ring-offset-red-900/30'
                    : variant === 'warning'
                    ? 'hover:bg-yellow-100 focus:ring-yellow-400 focus:ring-offset-yellow-50 dark:focus:ring-offset-yellow-900/30'
                    : 'hover:bg-blue-100 focus:ring-blue-400 focus:ring-offset-blue-50 dark:focus:ring-offset-blue-900/30'
                }`}
              >
                <span className="sr-only">Dismiss</span>
                <FiX className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;