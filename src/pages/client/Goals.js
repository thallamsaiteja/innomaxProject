import React, { useEffect, useState } from "react";
import { Table, Form, Button, Alert, Row, Col } from "react-bootstrap";
import api from "../../services/api";

export default function Goals() {
    // ✅ Get actual userId from localStorage (set during login)
    const userId = localStorage.getItem("userId");

    const [goals, setGoals] = useState([]);
    const [form, setForm] = useState({
        goalName: "",
        targetAmount: "",
        achievedAmount: "",
        timeline: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ✅ Fetch all goals for logged-in user
    const fetchGoals = async () => {
        try {
            const res = await api.get(`/api/client/goals/${userId}`);
            setGoals(res.data);
        } catch (err) {
            console.error("❌ Error fetching goals:", err);
        }
    };

    useEffect(() => {
        if (userId) fetchGoals();
    }, [userId]);

    // ✅ Update form state
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ Add goal
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!userId) {
            setError("User not logged in.");
            return;
        }

        try {
            await api.post(`/api/client/goals/${userId}`, form);
            setMessage("✅ Goal added successfully!");
            setForm({ goalName: "", targetAmount: "", achievedAmount: "", timeline: "" });
            fetchGoals();
        } catch (err) {
            console.error("❌ Error adding goal:", err);
            setError("Failed to add goal. Try again.");
        }
    };

    // ✅ Delete goal
    const handleDelete = async (goalId) => {
        if (!window.confirm("Are you sure you want to delete this goal?")) return;

        try {
            await api.delete(`/api/client/goals/${userId}/${goalId}`);
            fetchGoals();
        } catch (err) {
            console.error("❌ Error deleting goal:", err);
            alert("Error deleting goal");
        }
    };

    return (
        <div>
            <h4 className="fw-semibold mb-4">Your Goals</h4>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* ✅ Add Goal Form */}
            <Form onSubmit={handleSubmit} className="mb-4">
                <Row>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Goal Name</Form.Label>
                            <Form.Control
                                name="goalName"
                                value={form.goalName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Target Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="targetAmount"
                                value={form.targetAmount}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Achieved Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="achievedAmount"
                                value={form.achievedAmount}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Timeline</Form.Label>
                            <Form.Control
                                name="timeline"
                                value={form.timeline}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={1} className="d-flex align-items-end">
                        <Button type="submit" variant="primary" className="w-100">
                            Add
                        </Button>
                    </Col>
                </Row>
            </Form>

            {/* ✅ Goals Table */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Goal</th>
                        <th>Target</th>
                        <th>Achieved</th>
                        <th>Progress</th>
                        <th>Timeline</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {goals.length > 0 ? (
                        goals.map((goal) => (
                            <tr key={goal.id}>
                                <td>{goal.goalName}</td>
                                <td>₹{goal.targetAmount.toLocaleString()}</td>
                                <td>₹{goal.achievedAmount.toLocaleString()}</td>
                                <td>{Math.round((goal.achievedAmount / goal.targetAmount) * 100)}%</td>
                                <td>{goal.timeline}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(goal.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No goals added yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}
