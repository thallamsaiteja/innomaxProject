// src/pages/Login.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, InputGroup } from "react-bootstrap";
import api from "../services/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ✅ Helper to safely decode JWT payload (no extra library)
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

            // ✅ handle both possible backend response styles
            const token = res?.data?.token;
            const userIdFromResponse = res?.data?.userId;
            const roleFromResponse = res?.data?.role;

            if (!token) throw new Error("Missing token from server");

            // Save token
            localStorage.setItem("token", token);
            api.defaults.headers.common.Authorization = `Bearer ${token}`;

            // ✅ Decode from token if backend doesn’t return directly
            const decoded = decodeJwt(token);
            const userId = userIdFromResponse || decoded.userId || decoded.id || decoded.sub;
            const role = roleFromResponse || decoded.role || decoded.authorities?.[0] || "CLIENT";

            if (!userId) console.warn("⚠️ userId not found in token or response — check backend claims");

            // ✅ Persist details for later use (Profile, Dashboard, etc.)
            localStorage.setItem("userId", userId);
            localStorage.setItem("role", role);

            console.log("✅ Decoded role:", role);
            console.log("➡️ Navigating to:", role === "ADMIN" ? "/adminDashboard" : "/clientDashboard");


            // 🔁 Redirect based on role
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
                        {/* Email */}
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

                        {/* Password with show/hide */}
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
                </Col>
            </Row>
        </Container>
    );
}
