import React, { useEffect, useState } from "react";
import { getAllSIPs } from "../../services/adminApi";
import { Table, Spinner } from "react-bootstrap";

const SIPsTable = () => {
    const [sips, setSips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllSIPs()
            .then(setSips)
            .catch((err) => console.error("Error fetching SIPs:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );

    if (!sips.length)
        return <p className="text-center text-muted py-3">No SIP data found.</p>;

    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-3 text-gray-800">💰 SIP Plans</h2>
            <div className="table-responsive">
                <Table bordered hover>
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Fund Name</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sips.map((s, i) => (
                            <tr key={s.id || i}>
                                <td>{i + 1}</td>
                                <td>{s.user?.fullName || "—"}</td>
                                <td>{s.fundName || "—"}</td>
                                <td>₹{s.amount?.toLocaleString("en-IN") || "—"}</td>
                                <td>{s.isActive ? "Active ✅" : "Completed ❌"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default SIPsTable;
