// src/components/ui/Dropdown.tsx
import { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FiChevronDown } from 'react-icons/fi';

interface DropdownProps {
  button: ReactNode;
  children: ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

const Dropdown = ({
  button,
  children,
  position = 'right',
  className = '',
}: DropdownProps) => {
  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
          {button}
          <FiChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute ${
            position === 'right' ? 'right-0' : 'left-0'
          } z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700`}
        >
          <div className="py-1">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const DropdownItem = ({
  children,
  onClick,
  className = '',
  disabled = false,
}: DropdownItemProps) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`${
            active
              ? 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white'
              : 'text-gray-700 dark:text-gray-200'
          } ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          } block w-full px-4 py-2 text-left text-sm ${className}`}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
};

Dropdown.Item = DropdownItem;

export default Dropdown;