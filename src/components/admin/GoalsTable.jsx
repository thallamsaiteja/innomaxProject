import React, { useEffect, useState } from "react";
import { getAllGoals } from "../../services/adminApi";
import { Table, Spinner } from "react-bootstrap";

const GoalsTable = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllGoals()
            .then(setGoals)
            .catch((err) => console.error("Error fetching goals:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );

    if (!goals.length)
        return <p className="text-center text-muted py-3">No goals found.</p>;

    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-3 text-gray-800">🎯 Goals Overview</h2>
            <div className="table-responsive">
                <Table bordered hover>
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Goal Name</th>
                            <th>Category</th>
                            <th>Target Amount</th>
                            <th>User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goals.map((g, i) => (
                            <tr key={g.goalId || i}>
                                <td>{i + 1}</td>
                                <td>{g.goalName || "—"}</td>
                                <td>{g.category || "—"}</td>
                                <td>₹{g.targetAmount?.toLocaleString("en-IN") || "—"}</td>
                                <td>{g.user?.fullName || "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default GoalsTable;
