import AdminLayout from '@/layouts/admin.layout';
import VisitorLayout from '@/layouts/visitor.layout';
import { withAuth } from './with-auth';

// Create protected versions of your layouts
export const ProtectedAdminLayout = withAuth(AdminLayout, ["admin"]);
export const ProtectedVisitorLayout = withAuth(VisitorLayout, ["visitor"]);
