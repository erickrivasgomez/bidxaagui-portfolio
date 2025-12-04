// admin/src/pages/Dashboard.tsx
import { FiActivity, FiUsers, FiDollarSign, FiPackage } from 'react-icons/fi';
import PageHeader from '../components/layout/PageHeader';
import Stats from '../components/ui/Stats';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    icon: <FiDollarSign className="h-5 w-5" />,
    change: {
      value: '+20.1% from last month',
      type: 'increase' as const, // Add 'as const' to make it a literal type
    },
  },
  {
    title: 'Active Users',
    value: '2,345',
    icon: <FiUsers className="h-5 w-5" />,
    change: {
      value: '+180.1% from last month',
      type: 'increase' as const,
    },
  },
  {
    title: 'Total Orders',
    value: '1,234',
    icon: <FiPackage className="h-5 w-5" />,
    change: {
      value: '+19% from last month',
      type: 'increase' as const,
    },
  },
  {
    title: 'Active Now',
    value: '573',
    icon: <FiActivity className="h-5 w-5" />,
    change: {
      value: '+201 since last hour',
      type: 'increase' as const,
    },
  },
];

const recentOrders = [
  {
    id: '1',
    customer: 'John Doe',
    product: 'Premium Plan',
    amount: '$99.00',
    status: 'completed',
    date: '2023-05-15',
  },
  {
    id: '2',
    customer: 'Jane Smith',
    product: 'Basic Plan',
    amount: '$29.00',
    status: 'pending',
    date: '2023-05-14',
  },
  {
    id: '3',
    customer: 'Robert Johnson',
    product: 'Pro Plan',
    amount: '$199.00',
    status: 'completed',
    date: '2023-05-14',
  },
  {
    id: '4',
    customer: 'Emily Davis',
    product: 'Basic Plan',
    amount: '$29.00',
    status: 'failed',
    date: '2023-05-13',
  },
  {
    id: '5',
    customer: 'Michael Wilson',
    product: 'Premium Plan',
    amount: '$99.00',
    status: 'completed',
    date: '2023-05-12',
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your store today."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }]}
        actions={
          <Button variant="primary">
            <span>Create New</span>
          </Button>
        }
      />

      <Stats stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Orders
            </h3>
            <div className="mt-4 overflow-hidden">
              <Table
                headers={['Customer', 'Product', 'Amount', 'Status', 'Date']}
              >
                {recentOrders.map((order) => (
                  <Table.Row key={order.id}>
                    <Table.Cell>{order.customer}</Table.Cell>
                    <Table.Cell>{order.product}</Table.Cell>
                    <Table.Cell>{order.amount}</Table.Cell>
                    <Table.Cell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>{order.date}</Table.Cell>
                  </Table.Row>
                ))}
              </Table>
            </div>
            <div className="mt-4 text-right">
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all
              </a>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <div className="mt-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-start space-x-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0 dark:border-gray-700"
                >
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      User {i}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Completed an action {i} hour{i !== 1 ? 's' : ''} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;