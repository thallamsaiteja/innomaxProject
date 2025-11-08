import React, { useEffect, useState } from "react";
import { Table, Form, Button, Alert, Row, Col } from "react-bootstrap";
import api from "../../services/api";

export default function SIPs() {
    const userId = localStorage.getItem("userId");
    const [sips, setSips] = useState([]);
    const [form, setForm] = useState({
        planName: "",
        monthlyAmount: "",
        durationMonths: "",
        startDate: "",
        returnsExpected: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchSIPs = async () => {
        try {
            const res = await api.get(`/api/client/sips/${userId}`);
            setSips(res.data);
        } catch (err) {
            console.error("Error fetching SIPs:", err);
        }
    };

    useEffect(() => {
        fetchSIPs();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            await api.post(`/api/client/sips/${userId}`, form);
            setMessage("✅ SIP added successfully!");
            setForm({
                planName: "",
                monthlyAmount: "",
                durationMonths: "",
                startDate: "",
                returnsExpected: "",
            });
            fetchSIPs();
        } catch (err) {
            console.error("Failed to add SIP:", err);
            setError("❌ Failed to add SIP. Try again.");
        }
    };

    const handleDelete = async (sipId) => {
        if (!window.confirm("Are you sure you want to delete this SIP?")) return;
        try {
            await api.delete(`/api/client/sips/${userId}/${sipId}`);
            fetchSIPs();
        } catch (err) {
            alert("Error deleting SIP");
        }
    };

    return (
        <div>
            <h4 className="fw-semibold mb-4">Your SIP Plans</h4>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} className="mb-4">
                <Row>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Plan Name</Form.Label>
                            <Form.Control
                                name="planName"
                                value={form.planName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Monthly Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="monthlyAmount"
                                value={form.monthlyAmount}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Duration (Months)</Form.Label>
                            <Form.Control
                                type="number"
                                name="durationMonths"
                                value={form.durationMonths}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Expected Return (%)</Form.Label>
                            <Form.Control
                                type="number"
                                name="returnsExpected"
                                value={form.returnsExpected}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={2} className="d-flex align-items-end">
                        <Button type="submit" variant="primary" className="w-100">
                            Add
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Plan</th>
                        <th>Monthly</th>
                        <th>Duration</th>
                        <th>Total Invested</th>
                        <th>Expected Return</th>
                        <th>Next Due Date</th>
                        <th>Start Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sips.length > 0 ? (
                        sips.map((sip) => (
                            <tr key={sip.id}>
                                <td>{sip.planName}</td>
                                <td>₹{sip.monthlyAmount.toLocaleString()}</td>
                                <td>{sip.durationMonths} mo</td>
                                <td>₹{sip.totalInvested?.toLocaleString()}</td>
                                <td>{sip.returnsExpected || "-"}%</td>
                                <td>{sip.nextDueDate || "-"}</td>
                                <td>{sip.startDate}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(sip.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">
                                No SIPs added yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}
