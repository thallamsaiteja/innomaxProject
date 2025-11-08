import React, { useEffect, useState } from "react";
import { getAllClients } from "../../services/adminApi";

const CustomersTable = () => {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getAllClients().then(setClients).catch(console.error);
    }, []);

    const filtered = clients.filter(
        (c) =>
            c.fullName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Client Information</h2>
            <input
                type="text"
                placeholder="Search by name or email..."
                className="border px-3 py-2 rounded w-full mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="overflow-auto">
                <table className="min-w-full bg-white rounded shadow">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((client) => (
                            <tr key={client.userId} className="border-b hover:bg-gray-50">
                                <td className="p-2">{client.fullName}</td>
                                <td className="p-2">{client.email}</td>
                                <td className="p-2">{client.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomersTable;
