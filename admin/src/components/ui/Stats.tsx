// src/components/ui/Stats.tsx
import { ReactNode } from 'react';

interface StatProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  description?: string;
}

const Stat = ({ title, value, icon, change, description }: StatProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <dt className="flex items-center justify-between">
        <p className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <div className="rounded-md bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          {icon}
        </div>
      </dt>
      <dd className="mt-1 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
        {change && (
          <p
            className={`ml-2 flex items-baseline text-sm font-medium ${
              change.type === 'increase'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {change.type === 'increase' ? (
              <svg
                className="h-5 w-5 flex-shrink-0 self-center"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414 8.707 12.707a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 flex-shrink-0 self-center"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 13a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L12 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 0112 13z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="sr-only">
              {change.type === 'increase' ? 'Increased' : 'Decreased'} by
            </span>
            {change.value}
          </p>
        )}
      </dd>
      {description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
};

interface StatsProps {
  stats: StatProps[];
  className?: string;
}

const Stats = ({ stats, className = '' }: StatsProps) => {
  return (
    <div
      className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-${stats.length} ${className}`}
    >
      {stats.map((stat, index) => (
        <Stat key={index} {...stat} />
      ))}
    </div>
  );
};

export default Stats;