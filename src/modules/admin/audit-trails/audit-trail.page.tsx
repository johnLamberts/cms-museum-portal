/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { AuditActionType } from './audit';
import { useSearchAuditLogs } from './hooks/useAudits';



const AdminAuditLogViewer: React.FC = () => {
  const [filters, setFilters] = useState({
    userId: '',
    entityType: '',
    entityId: '',
    action: '' as AuditActionType | any,
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error } = useSearchAuditLogs(
    filters,
    page,
    pageSize,
    // Only run the query if at least one filter is applied
    Object.values(filters).some((val) => val !== '')
  );

  const auditLogs = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically run when filters change
  };

  const resetFilters = () => {
    setFilters({
      userId: '',
      entityType: '',
      entityId: '',
      action: '',
      startDate: '',
      endDate: '',
    });
    setPage(1);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Audit Log Search</h2>
      </div>

      <div className="p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="entityType" className="block text-sm font-medium text-gray-700">
                Entity Type
              </label>
              <input
                type="text"
                id="entityType"
                name="entityType"
                value={filters.entityType}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="entityId" className="block text-sm font-medium text-gray-700">
                Entity ID
              </label>
              <input
                type="text"
                id="entityId"
                name="entityId"
                value={filters.entityId}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="action" className="block text-sm font-medium text-gray-700">
                Action
              </label>
              <select
                id="action"
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="view">View</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="export">Export</option>
                <option value="import">Import</option>
                <option value="approve">Approve</option>
                <option value="reject">Reject</option>
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="border-t">
        {isLoading ? (
          <div className="text-center py-6">Loading...</div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">Error loading audit logs</div>
        ) : auditLogs.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No audit logs found matching your criteria
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Timestamp
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Entity Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Entity ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditLogs.map((log: { id: Key | null | undefined; created_at: string | number | Date; action: string; user_id: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; entity_type: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; entity_id: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; details: any; }) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.created_at && format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          log.action === 'create'
                            ? 'bg-green-100 text-green-800'
                            : log.action === 'update'
                            ? 'bg-blue-100 text-blue-800'
                            : log.action === 'delete'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.user_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.entity_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.entity_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32 max-w-xs">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                page === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * pageSize, totalCount)}
                </span>{' '}
                of <span className="font-medium">{totalCount}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">First</span>
                  <span>First</span>
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <span>Prev</span>
                </button>

                {/* Page numbers would go here, but for simplicity we'll just show current/total */}
                <span className="relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
                    page === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <span>Next</span>
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                    page === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Last</span>
                  <span>Last</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogViewer;
