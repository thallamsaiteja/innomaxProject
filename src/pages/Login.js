// src/pages/Login.js

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, InputGroup } from "react-bootstrap";
import api from "../services/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper to decode JWT payload
function decodeJwt(token) {
    try {
        const base64 = token.split(".")[1];
        const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json);
    } catch {
        return {};
    }
}

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const setField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setServerError("");
    };

    const validate = () => {
        const e = {};
        if (!emailRegex.test(form.email)) e.email = "Enter a valid email address";
        if (!form.password) e.password = "Password is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setServerError("");

        try {
            const res = await api.post("/api/auth/login", {
                email: form.email.trim(),
                password: form.password,
            });
            console.log("🔹 Login response:", res.data);

            const token = res?.data?.token;
            const userIdFromResponse = res?.data?.userId;
            const roleFromResponse = res?.data?.role;

            if (!token) throw new Error("Missing token from server");

            // Save token globally for API calls
            localStorage.setItem("token", token);
            api.defaults.headers.common.Authorization = `Bearer ${token}`;

            // Decode token for userId and role if not present in response
            const decoded = decodeJwt(token);
            const userId = userIdFromResponse || decoded.userId || decoded.id || decoded.sub;
            const role = roleFromResponse || decoded.role || decoded.authorities?.[0] || "CLIENT";

            if (!userId) console.warn("⚠️ userId not found in token or response — check backend claims");

            localStorage.setItem("userId", userId);
            localStorage.setItem("role", role);

            console.log("✅ Decoded role:", role);
            console.log("➡️ Navigating to:", role === "ADMIN" ? "/adminDashboard" : "/clientDashboard");

            // Redirect according to role
            if (role === "ADMIN") navigate("/adminDashboard", { replace: true });
            else navigate("/clientDashboard", { replace: true });

        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Login failed. Check your credentials.";
            setServerError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <h2 className="mb-4 fw-semibold">Login</h2>

                    {serverError && <Alert variant="danger">{serverError}</Alert>}

                    <Form onSubmit={onSubmit} noValidate>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={form.email}
                                onChange={(e) => setField("email", e.target.value)}
                                isInvalid={!!errors.email}
                                autoComplete="username"
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPw ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) => setField("password", e.target.value)}
                                    isInvalid={!!errors.password}
                                    autoComplete="current-password"
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPw((s) => !s)}
                                    tabIndex={-1}
                                >
                                    {showPw ? "Hide" : "Show"}
                                </Button>
                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <div className="d-grid">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Signing in..." : "Login"}
                            </Button>
                        </div>
                    </Form>

                    <div className="mt-3 text-center">
                        <small>
                            Don’t have an account? <Link to="/register">Register</Link>
                        </small>
                    </div>

                    <div className="mt-2 text-center">
                        <small>
                            <Link to="/forgot-password">Forgot password?</Link>
                        </small>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
