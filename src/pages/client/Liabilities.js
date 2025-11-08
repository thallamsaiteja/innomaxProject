import React, { useEffect, useState } from "react";
import { Table, Form, Button, Alert, Row, Col } from "react-bootstrap";
import api from "../../services/api";

export default function Liabilities() {
    const userId = localStorage.getItem("userId"); // ✅ get userId dynamically
    const [liabilities, setLiabilities] = useState([]);
    const [form, setForm] = useState({
        liabilityType: "",
        amount: "",
        remainingAmount: "",
        monthlyEMI: "",
        lender: "",
        dueDate: "", // ✅ added
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // 🔹 Fetch all liabilities
    const fetchLiabilities = async () => {
        try {
            const res = await api.get(`/api/client/liabilities/${userId}`);
            setLiabilities(res.data);
        } catch (err) {
            console.error("Error fetching liabilities:", err);
        }
    };

    useEffect(() => {
        fetchLiabilities();
    }, []);

    // 🔹 Handle input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔹 Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!userId) {
            setError("User ID not found. Please log in again.");
            return;
        }

        try {
            await api.post(`/api/client/liabilities/${userId}`, form);
            setMessage("✅ Liability added successfully!");
            setForm({
                liabilityType: "",
                amount: "",
                remainingAmount: "",
                monthlyEMI: "",
                lender: "",
                dueDate: "",
            });
            fetchLiabilities();
        } catch (err) {
            console.error("Failed to add liability:", err);
            setError("❌ Failed to add liability. Try again.");
        }
    };

    // 🔹 Delete a liability
    const handleDelete = async (liabilityId) => {
        if (!window.confirm("Are you sure you want to delete this liability?")) return;
        try {
            await api.delete(`/api/client/liabilities/${userId}/${liabilityId}`);
            fetchLiabilities();
        } catch (err) {
            console.error("Error deleting liability:", err);
            alert("Failed to delete liability.");
        }
    };

    return (
        <div>
            <h4 className="fw-semibold mb-4">Your Liabilities</h4>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* 🔹 Add Liability Form */}
            <Form onSubmit={handleSubmit} className="mb-4">
                <Row>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Liability Type</Form.Label>
                            <Form.Control
                                name="liabilityType"
                                value={form.liabilityType}
                                onChange={handleChange}
                                placeholder="e.g. Home Loan"
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Total Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Remaining Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="remainingAmount"
                                value={form.remainingAmount}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Monthly EMI</Form.Label>
                            <Form.Control
                                type="number"
                                name="monthlyEMI"
                                value={form.monthlyEMI}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Lender</Form.Label>
                            <Form.Control
                                name="lender"
                                value={form.lender}
                                onChange={handleChange}
                                placeholder="e.g. HDFC Bank"
                            />
                        </Form.Group>
                    </Col>

                    {/* ✅ Due Date Field */}
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="dueDate"
                                value={form.dueDate}
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

            {/* 🔹 Liabilities Table */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Total</th>
                        <th>Remaining</th>
                        <th>EMI</th>
                        <th>Lender</th>
                        <th>Due Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {liabilities.length > 0 ? (
                        liabilities.map((item) => (
                            <tr key={item.id}>
                                <td>{item.liabilityType}</td>
                                <td>₹{item.amount.toLocaleString()}</td>
                                <td>₹{item.remainingAmount.toLocaleString()}</td>
                                <td>₹{item.monthlyEMI?.toLocaleString() || "-"}</td>
                                <td>{item.lender || "-"}</td>
                                <td>{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "-"}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No liabilities added yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}
