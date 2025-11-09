import React, { useState } from "react";
import api from "../services/api"; import { Form, Button, Alert, Card, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState(location.state?.token || "");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        try {
            const res = await api.post("/api/auth/reset-password", { token, newPassword });
            setMessage(res.data.message);
            // After successful reset, redirect to login in 2 sec
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Something went wrong"
            );
        }
    };
    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
            <Card className="p-4" style={{ maxWidth: 400, width: "100%" }}>
                <h4 className="mb-3 text-center">Reset Password</h4>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Reset Token</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Paste the reset token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" variant="primary" className="w-100">
                        Reset Password
                    </Button>
                </Form>
            </Card>
        </Container>
    );
}
