import React, { useState } from "react";
import api from "../services/api"; import { Form, Button, Alert, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [resetToken] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        try {
            const res = await api.post("/api/auth/forgot-password", { email });
            setMessage(res.data.message);

            // AUTOMATICALLY REDIRECT after token received
            const resetToken = res.data.resetToken;
            if (resetToken) {
                navigate("/reset-password", { state: { token: resetToken } });
            }
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
                <h4 className="mb-3 text-center">Forgot Password</h4>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" variant="primary" className="w-100">
                        Send Reset Link
                    </Button>
                </Form>
                {resetToken && (
                    <Alert className="mt-3" variant="info">
                        <strong>Reset Token (for testing):</strong>
                        <br />
                        <code>{resetToken}</code>
                    </Alert>
                )}
            </Card>
        </Container>
    );
}
