'use client';

import { useState } from 'react';
import AdminInputSearch from '../AdminInputSearch/AdminInputSearch';

interface Column<T> {
    key: string;
    label: string;
    render: (item: T) => React.ReactNode;
    className?: string;
}

interface AdminTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchFields: (keyof T)[];
    searchPlaceholder?: string;
    itemName: string; // e.g., "articles", "users", "categories"
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    getItemId: (item: T) => string;
}

export default function AdminTable<T>({
    data,
    columns,
    searchFields,
    searchPlaceholder = "Search...",
    itemName,
    onEdit,
    onDelete,
    getItemId
}: AdminTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    // Search functionality
    const filteredData = searchTerm
        ? data.filter(item =>
            searchFields.some(field => {
                const value = item[field];
                return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
            })
        )
        : data;

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredData.slice(startIndex, endIndex);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    return (
        <div>
            <div className="mb-4">
                <AdminInputSearch
                    id="search"
                    name="search"
                    label={`Search ${itemName}`}
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder={searchPlaceholder}
                />
            </div>

            <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Show</span>
                    <select 
                        value={itemsPerPage} 
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        className="border rounded px-2 py-1 text-sm"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-700">{itemName} per page</span>
                </div>
                <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} {itemName}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column) => (
                                    <th 
                                        key={column.key}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentItems.map((item, index) => (
                                <tr key={getItemId(item) || `item-${index}`}>
                                    {columns.map((column) => (
                                        <td 
                                            key={column.key}
                                            className={column.className || "px-6 py-4 text-sm text-gray-900"}
                                        >
                                            {column.render(item)}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(item)}
                                            className="text-red-600 hover:text-red-900 cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="mt-4 flex justify-center items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                    >
                        Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 border rounded text-sm cursor-pointer ${
                                currentPage === page 
                                    ? 'bg-blue-500 text-white border-blue-500' 
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}