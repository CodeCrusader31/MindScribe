

'use client'
import SubsTableItem from '@/components/Admin-Components/SubsTableItem'
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { FiSearch, FiMail, FiUsers, FiRefreshCw, FiTrash2, FiCalendar } from 'react-icons/fi';

const Page = () => {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

    const fetchEmails = async () => { 
        setLoading(true);
        try {
            const response = await axios.get('/api/email');
            setEmails(response.data.emails);
        } catch (error) {
            toast.error("Failed to fetch subscriptions");
            console.error("Error fetching emails:", error);
        } finally {
            setLoading(false);
        }
    }

    const deleteEmail = async (mongoId) => {
        if (!window.confirm("Are you sure you want to delete this subscription?")) return;
        
        try {
            const response = await axios.delete(`/api/email`, {
                params: { id: mongoId }
            });
            if(response.data.success){
                toast.success(response.data.msg);
                fetchEmails();
            } else {
                toast.error("Error deleting subscription");
            }
        } catch (error) {
            toast.error("Failed to delete subscription");
            console.error("Error deleting email:", error);
        }
    }

    const deleteAllEmails = async () => {
        if (!window.confirm("Are you sure you want to delete ALL subscriptions? This cannot be undone.")) return;
        
        try {
            // This would need to be implemented in your API
            // For now, this is just a placeholder
            toast.info("Bulk delete functionality would be implemented here");
        } catch (error) {
            toast.error("Failed to delete subscriptions");
            console.error("Error deleting emails:", error);
        }
    }

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }

    const sortedEmails = React.useMemo(() => {
        if (!emails.length) return [];
        
        const sortedArray = [...emails];
        sortedArray.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sortedArray;
    }, [emails, sortConfig]);

    const filteredEmails = sortedEmails.filter(email => 
        email.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchEmails();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <FiMail className="text-blue-600" />
                        Email Subscriptions
                    </h1>
                    <p className="text-gray-600 mt-2">Manage all newsletter subscriptions</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                            <p className="text-2xl font-bold text-gray-800">{emails.length}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FiUsers className="text-blue-600 text-xl" />
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">New This Month</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {emails.filter(email => {
                                    const emailDate = new Date(email.date);
                                    const now = new Date();
                                    return emailDate.getMonth() === now.getMonth() && 
                                           emailDate.getFullYear() === now.getFullYear();
                                }).length}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <FiCalendar className="text-green-600 text-xl" />
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Actions</p>
                            <div className="flex gap-2 mt-2">
                                <button 
                                    onClick={fetchEmails}
                                    className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                                >
                                    <FiRefreshCw size={14} /> Refresh
                                </button>
                                <button 
                                    onClick={deleteAllEmails}
                                    className="flex items-center gap-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md transition-colors"
                                >
                                    <FiTrash2 size={14} /> Clear All
                                </button>
                            </div>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <FiTrash2 className="text-red-600 text-xl" />
                        </div>
                    </div>
                </div>

                {/* Search and Controls */}
                <div className="bg-white rounded-lg shadow mb-6 p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search subscriptions..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-gray-600">
                            {filteredEmails.length} of {emails.length} subscriptions
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : filteredEmails.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('email')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Email Address
                                                {sortConfig.key === 'email' && (
                                                    <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                                                )}
                                            </div>
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden sm:table-cell"
                                            onClick={() => handleSort('date')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Subscription Date
                                                {sortConfig.key === 'date' && (
                                                    <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredEmails.map((item, index) => (
                                        <SubsTableItem 
                                            key={item._id} 
                                            mongoId={item._id} 
                                            deleteEmail={deleteEmail} 
                                            email={item.email} 
                                            date={item.date} 
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FiMail className="mx-auto text-gray-400 text-4xl mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No subscriptions found</h3>
                            <p className="text-gray-500 mt-1">
                                {searchTerm ? 'Try adjusting your search term' : 'No email subscriptions yet'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination (would be implemented with backend API) */}
                {filteredEmails.length > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEmails.length}</span> of{' '}
                            <span className="font-medium">{filteredEmails.length}</span> results
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Page;