import React, { useEffect, useState } from "react";
import { getAllRisks } from "../../services/adminApi";
import { Table, Spinner } from "react-bootstrap";

const RisksTable = () => {
    const [risks, setRisks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllRisks()
            .then(setRisks)
            .catch((err) => console.error("Error fetching risks:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );

    if (!risks.length)
        return <p className="text-center text-muted py-3">No risk profiles found.</p>;

    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-3 text-gray-800">⚖️ Risk Profiles</h2>
            <div className="table-responsive">
                <Table bordered hover>
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Risk Type</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {risks.map((r, i) => (
                            <tr key={r.id || i}>
                                <td>{i + 1}</td>
                                <td>{r.user?.fullName || "—"}</td>
                                <td>{r.riskType || "—"}</td>
                                <td>{r.score || "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default RisksTable;
