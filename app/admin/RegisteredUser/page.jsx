'use client';

import { useEffect, useState } from 'react';

export default function AdminUsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/Registered');
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading users...</p>;
  }

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Registered Users</h2>
      <table className="min-w-full border border-gray-300 text-sm md:text-base">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Profession</th>
            <th className="border px-4 py-2">Experiences</th>
            <th className="border px-4 py-2">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2 capitalize">{user.role}</td>
                <td className="border px-4 py-2">{user.profession || '-'}</td>
                <td className="border px-4 py-2">
                  {user.experiences && user.experiences.length > 0 
                    ? user.experiences.join(', ') 
                    : '-'}
                </td>
                <td className="border px-4 py-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
