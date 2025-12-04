// src/components/ui/Table.tsx
import { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

const Table = ({ headers, children, className = '' }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-sm border border-gray-200 rounded-lg dark:border-gray-700">
          <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {children}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const TableRow = ({ children, className = '', onClick }: TableRowProps) => {
  return (
    <tr
      onClick={onClick}
      className={`${
        onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''
      } ${className}`}
    >
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

const TableCell = ({ children, className = '', colSpan }: TableCellProps) => {
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};

Table.Row = TableRow;
Table.Cell = TableCell;

export default Table;