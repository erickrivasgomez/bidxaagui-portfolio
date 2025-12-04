// admin/src/pages/Settings.tsx
import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Tabs from '../components/ui/Tabs';

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      content: (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="sm:col-span-2"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      ),
    },
    {
      id: 'password',
      label: 'Password',
      content: (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              Update Password
            </Button>
          </div>
        </form>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="email-notifications"
                  name="email"
                  type="checkbox"
                  checked={formData.notifications.email}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="email-notifications"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Notifications
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Receive email notifications about your account
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="push-notifications"
                  name="push"
                  type="checkbox"
                  checked={formData.notifications.push}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="push-notifications"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  Push Notifications
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Receive push notifications on your device
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="sms-notifications"
                  name="sms"
                  type="checkbox"
                  checked={formData.notifications.sms}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="sms-notifications"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  SMS Notifications
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Receive text message notifications
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              Save Preferences
            </Button>
          </div>
        </form>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your account settings and preferences"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings' },
        ]}
      />

      <Card>
        <div className="p-6">
          <Tabs tabs={tabs} defaultTab="profile" />
        </div>
      </Card>
    </div>
  );
};

export default Settings;