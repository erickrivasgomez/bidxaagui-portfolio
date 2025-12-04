// admin/src/pages/Users.tsx
import { useState } from 'react';
import { FiEdit2, FiTrash2, FiSearch, FiPlus } from 'react-icons/fi';
import PageHeader from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2023-05-15 14:30:00',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    status: 'active',
    lastLogin: '2023-05-14 10:15:00',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'Viewer',
    status: 'inactive',
    lastLogin: '2023-05-10 09:45:00',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'Editor',
    status: 'active',
    lastLogin: '2023-05-13 16:20:00',
  },
  {
    id: '5',
    name: 'Michael Wilson',
    email: 'michael@example.com',
    role: 'Viewer',
    status: 'inactive',
    lastLogin: '2023-05-05 11:30:00',
  },
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Handle user deletion
    console.log('Deleting user:', selectedUserId);
    setIsDeleteModalOpen(false);
    setSelectedUserId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Manage your users and their permissions"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Users' },
        ]}
        actions={
          <Button variant="primary">
            <FiPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      />

      <Card>
        <div className="p-6">
          <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <div className="relative w-full max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-hidden">
            <Table
              headers={['Name', 'Email', 'Role', 'Status', 'Last Login', 'Actions']}
            >
              {filteredUsers.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      variant={
                        user.status === 'active' ? 'success' : 'danger'
                      }
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{new Date(user.lastLogin).toLocaleString()}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
                        onClick={() => console.log('Edit user:', user.id)}
                      >
                        <FiEdit2 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        <FiTrash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{filteredUsers.length}</span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> results
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" disabled>
                Previous
              </Button>
              <Button variant="secondary" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUserId(null);
        }}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedUserId(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;