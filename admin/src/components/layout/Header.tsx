// admin/src/components/layout/Header.tsx
import { FiMenu, FiMoon, FiSun, FiBell, FiUser } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useDarkMode } from '../../hooks/useDarkMode';
import Dropdown from '../ui/Dropdown';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:px-6">
      <button
        type="button"
        className="mr-4 rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 md:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <FiMenu className="h-6 w-6" />
      </button>

      <div className="flex flex-1 items-center justify-end">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? (
              <FiSun className="h-5 w-5" />
            ) : (
              <FiMoon className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            className="rounded-full p-1 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <span className="sr-only">View notifications</span>
            <FiBell className="h-6 w-6" />
          </button>

          <Dropdown
            button={
              <span className="flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                  <FiUser className="h-4 w-4" />
                </span>
                <span className="ml-2 hidden text-sm font-medium text-gray-700 dark:text-gray-200 md:block">
                  {user?.name || 'User'}
                </span>
              </span>
            }
          >
            <Dropdown.Item onClick={() => console.log('Profile')}>
              Your Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={() => console.log('Settings')}>
              Settings
            </Dropdown.Item>
            <div className="border-t border-gray-200 dark:border-gray-600" />
            <Dropdown.Item onClick={logout}>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;