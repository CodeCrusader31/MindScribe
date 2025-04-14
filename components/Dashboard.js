import { RoleGuard } from "./RoleGuard";
import { useRole } from "@/hooks/useRole";

export default function Dashboard() {
  const { isAdmin, isAuthor, role } = useRole();

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Content visible to all authenticated users */}
      <div>
        <h2>Welcome, {role} user!</h2>
      </div>

      {/* Author-only content */}
      <RoleGuard requiredRole="author">
        <div>
          <h3>Author Tools</h3>
          <button>Create New Post</button>
        </div>
      </RoleGuard>

      {/* Admin-only content */}
      <RoleGuard requiredRole="admin">
        <div>
          <h3>Admin Panel</h3>
          <button>Manage Users</button>
        </div>
      </RoleGuard>
    </div>
  );
}