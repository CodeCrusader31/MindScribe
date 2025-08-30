// 'use client';

// import { useEffect, useState } from 'react';

// export default function AdminUsersTable() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch('/api/admin/Registered');
//         const data = await res.json();
//         if (data.success) {
//           setUsers(data.users);
//         }
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   if (loading) {
//     return <p className="text-center mt-8">Loading users...</p>;
//   }

//   return (
//     <div className="overflow-x-auto p-4">
//       <h2 className="text-2xl font-bold mb-4 text-center">Registered Users</h2>
//       <table className="min-w-full border border-gray-300 text-sm md:text-base">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border px-4 py-2">Username</th>
//             <th className="border px-4 py-2">Email</th>
//             <th className="border px-4 py-2">Role</th>
//             <th className="border px-4 py-2">Profession</th>
//             <th className="border px-4 py-2">Experiences</th>
//             <th className="border px-4 py-2">Joined</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.length === 0 ? (
//             <tr>
//               <td colSpan="6" className="text-center p-4">No users found.</td>
//             </tr>
//           ) : (
//             users.map((user) => (
//               <tr key={user._id} className="hover:bg-gray-50">
//                 <td className="border px-4 py-2">{user.username}</td>
//                 <td className="border px-4 py-2">{user.email}</td>
//                 <td className="border px-4 py-2 capitalize">{user.role}</td>
//                 <td className="border px-4 py-2">{user.profession || '-'}</td>
//                 <td className="border px-4 py-2">
//                   {user.experiences && user.experiences.length > 0 
//                     ? user.experiences.join(', ') 
//                     : '-'}
//                 </td>
//                 <td className="border px-4 py-2">
//                   {new Date(user.createdAt).toLocaleDateString()}
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiMail,
  FiAward,
  FiCalendar,
  FiBriefcase,
  FiShield,
  FiAlertCircle
} from 'react-icons/fi';

export default function AdminUsersTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/Registered');
      const data = await res.json();
      
      if (data.success) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error loading users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort users
  useEffect(() => {
  if (!users || !Array.isArray(users)) {
    setFilteredUsers([]); // safeguard if users is undefined/null
    return;
  }

  let result = [...users];

  // ✅ Apply search filter (safe with null/undefined values)
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(user => {
      const username = user?.username?.toLowerCase() || "";
      const email = user?.email?.toLowerCase() || "";
      const profession = user?.profession?.toLowerCase() || "";

      return (
        username.includes(query) ||
        email.includes(query) ||
        profession.includes(query)
      );
    });
  }

  // ✅ Apply role filter
  if (roleFilter !== "all") {
    result = result.filter(user => user?.role === roleFilter);
  }

  // ✅ Apply sorting (null/undefined safe)
  if (sortConfig?.key) {
    result.sort((a, b) => {
      let aValue = a?.[sortConfig.key];
      let bValue = b?.[sortConfig.key];

      // Handle nested properties or special cases
      if (sortConfig.key === "experiences") {
        aValue = Array.isArray(a?.experiences) ? a.experiences.length : 0;
        bValue = Array.isArray(b?.experiences) ? b.experiences.length : 0;
      }

      // Normalize strings to lowercase for consistent sorting
      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  setFilteredUsers(result);
}, [users, searchQuery, roleFilter, sortConfig]);


  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'author': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-md p-6">
          <FiAlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FiRefreshCw className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage all registered users and their permissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <FiUser className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100">
                <FiShield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <FiAward className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Authors</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'author').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gray-100">
                <FiUser className="w-5 h-5 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Regular Users</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'user').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name, email or profession..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <FiFilter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="author">Author</option>
                  <option value="reader">reader</option>
                </select>
              </div>
              
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
              >
                <FiRefreshCw className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('username')}
                  >
                    <div className="flex items-center">
                      <FiUser className="mr-2" />
                      Username
                      {sortConfig.key === 'username' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      <FiMail className="mr-2" />
                      Email
                      {sortConfig.key === 'email' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center">
                      <FiShield className="mr-2" />
                      Role
                      {sortConfig.key === 'role' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('profession')}
                  >
                    <div className="flex items-center">
                      <FiBriefcase className="mr-2" />
                      Profession
                      {sortConfig.key === 'profession' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('experiences')}
                  >
                    <div className="flex items-center">
                      <FiAward className="mr-2" />
                      Experiences
                      {sortConfig.key === 'experiences' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      <FiCalendar className="mr-2" />
                      Joined
                      {sortConfig.key === 'createdAt' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      {searchQuery || roleFilter !== 'all' ? (
                        <div className="flex flex-col items-center">
                          <FiSearch className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">No users found matching your criteria</p>
                          <button 
                            onClick={() => {
                              setSearchQuery('');
                              setRoleFilter('all');
                            }}
                            className="mt-2 text-blue-600 hover:text-blue-800"
                          >
                            Clear filters
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <FiUser className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">No users available</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                              {user.username?.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.profession || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.experiences && user.experiences.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {user.experiences.slice(0, 3).map((exp, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                                  {exp}
                                </span>
                              ))}
                              {user.experiences.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                                  +{user.experiences.length - 3} more
                                </span>
                              )}
                            </div>
                          ) : (
                            '-'
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
