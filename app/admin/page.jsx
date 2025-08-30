// app/admin/page.jsx
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  FiUsers, 
  FiFileText, 
  FiBarChart2, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX,
  FiTrendingUp,
  FiEye,
  FiEdit,
  FiTrash2,
  FiAlertCircle,
  FiRefreshCw,
  FiMail
} from "react-icons/fi";
import axios from "axios";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalAuthors: 0,
    recentBlogs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login");
    } else {
      fetchStats();
    }
  }, [user]);

 const fetchStats = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Fetch blogs (this endpoint exists)
    const blogsRes = await axios.get('/api/blog');
    const blogsData = blogsRes.data.blogs || [];
    
    // For users, fetch from the correct endpoint
    let usersData = [];
    try {
      const usersRes = await axios.get('/api/admin/Registered');
      // Handle different response structures
      usersData = Array.isArray(usersRes.data) 
        ? usersRes.data 
        : Array.isArray(usersRes.data.users) 
          ? usersRes.data.users 
          : Array.isArray(usersRes.data.data) 
            ? usersRes.data.data 
            : [];
    } catch (usersError) {
      console.warn("Users API not available, using fallback data");
      // Fallback: extract authors from blogs
      const authors = [...new Set(blogsData.map(blog => blog.author))];
      usersData = authors.map((author, index) => ({
        _id: `fallback-${index}`,
        username: author,
        role: 'author',
        email: `${author.toLowerCase()}@example.com`
      }));
    }
    
    // Ensure usersData is always an array
    if (!Array.isArray(usersData)) {
      usersData = [];
    }
    
    // Safely filter authors
    const totalAuthors = usersData.filter(u => 
      u && u.role && typeof u.role === 'string' && u.role.toLowerCase() === 'author'
    ).length;
    
    setStats({
      totalUsers: usersData.length,
      totalBlogs: blogsData.length,
      totalAuthors: totalAuthors,
      recentBlogs: blogsData.slice(0, 5)
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    setError("Failed to load dashboard data");
    
    // Set fallback data
    setStats({
      totalUsers: 0,
      totalBlogs: 0,
      totalAuthors: 0,
      recentBlogs: []
    });
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Function to handle navigation to external pages
  const handleNavigation = (path) => {
    router.push(path);
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`
        fixed lg:static w-64 bg-gray-900 text-white min-h-screen z-50
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">MindScribe Admin</h1>
          <p className="text-gray-400 text-sm">Welcome, {user.username}</p>
        </div>

        <nav className="p-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
              activeTab === "dashboard" 
                ? "bg-blue-600 text-white" 
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <FiBarChart2 className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigation("/admin/RegisteredUser")}
            className="w-full flex items-center space-x-3 p-3 rounded-lg mb-2 text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <FiUsers className="w-5 h-5" />
            <span>Registered Users</span>
          </button>

          <button
            onClick={() => handleNavigation("/admin/blogList")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
              activeTab === "blogs" 
                ? "bg-blue-600 text-white" 
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <FiFileText className="w-5 h-5" />
            <span>Blogs</span>
          </button>

          {/* Subscription Link */}
          <button
            onClick={() => handleNavigation("/admin/subscription")}
            className="w-full flex items-center space-x-3 p-3 rounded-lg mb-2 text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <FiMail className="w-5 h-5" />
            <span>Subscriptions</span>
          </button>

          {/* Registered Users Link */}
          

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
              activeTab === "settings" 
                ? "bg-blue-600 text-white" 
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <FiSettings className="w-5 h-5" />
            <span>Settings</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <DashboardTab 
              stats={stats} 
              loading={loading} 
              error={error} 
              onRetry={fetchStats} 
            />
          )}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "blogs" && <BlogsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Updated DashboardTab with error handling
const DashboardTab = ({ stats, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiAlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-lg text-gray-700 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FiRefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={onRetry}
          className="flex items-center px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
        >
          <FiRefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<FiUsers className="w-6 h-6 text-blue-600" />}
          label="Total Users"
          value={stats.totalUsers}
          color="blue"
        />
        
        <StatCard
          icon={<FiFileText className="w-6 h-6 text-green-600" />}
          label="Total Blogs"
          value={stats.totalBlogs}
          color="green"
        />
        
        <StatCard
          icon={<FiTrendingUp className="w-6 h-6 text-purple-600" />}
          label="Authors"
          value={stats.totalAuthors}
          color="purple"
        />
      </div>

      {/* Recent Blogs Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium">Recent Blogs</h2>
        </div>
        <div className="overflow-x-auto">
          {stats.recentBlogs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No blogs found
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentBlogs.map((blog) => (
                  <tr key={blog._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {blog.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{blog.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ icon, label, value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other tabs
const UsersTab = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Users Management</h1>
    <p className="text-gray-600">User management functionality coming soon...</p>
  </div>
);

const BlogsTab = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Blogs Management</h1>
    <p className="text-gray-600">Blog management functionality coming soon...</p>
  </div>
);

const SettingsTab = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
    <p className="text-gray-600">Settings functionality coming soon...</p>
  </div>
);