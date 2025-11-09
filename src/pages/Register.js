import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, ProgressBar } from "react-bootstrap";
import api from "../services/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^\d{10}$/;

function passwordStrength(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    // map to 0–100
    return Math.min(100, score * 20);
}

export default function Register() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        role: "CLIENT",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [serverSuccess, setServerSuccess] = useState("");
    const navigate = useNavigate();
    const strength = useMemo(() => passwordStrength(form.password), [form.password]);
    const strengthLabel = strength < 40 ? "Weak" : strength < 80 ? "Moderate" : "Strong";
    const strengthVariant = strength < 40 ? "danger" : strength < 80 ? "warning" : "success";

    function setField(name, value) {
        // update field
        setForm(prev => ({ ...prev, [name]: value }));
        // clear that field's error when user types (soft reset)
        setErrors(prev => ({ ...prev, [name]: "" }));
        // clear server messages while editing
        setServerError("");
        setServerSuccess("");
    }

    function validate() {
        const e = {};
        if (!form.fullName.trim()) e.fullName = "Full name is required";
        if (!emailRegex.test(form.email)) e.email = "Enter a valid email address";
        if (!mobileRegex.test(form.mobile)) e.mobile = "Mobile number must be 10 digits";
        if (form.password.length < 8) e.password = "Password must be at least 8 characters";
        if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
            e.password = "Password must include letters and numbers";
        }
        if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
        if (!["CLIENT", "ADMIN"].includes(form.role)) e.role = "Select a valid role";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(e) {
        e.preventDefault();
        setServerError("");
        setServerSuccess("");

        // Key change: Run validate() here to set errors before submission.
        if (!validate()) return;

        setSubmitting(true);
        try {
            const payload = {
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                mobile: form.mobile.trim(),
                password: form.password,
                role: form.role,
            };
            const res = await api.post("/api/auth/register", payload);
            if (res?.data) {
                setServerSuccess("Registration successful. You are now redirecting to login page.");
                setTimeout(() => navigate("/login"), 1500);
                // optional: reset form
                setForm({
                    fullName: "",
                    email: "",
                    mobile: "",
                    password: "",
                    confirmPassword: "",
                    role: "CLIENT",
                });
            }
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Registration failed. Try a different email/mobile.";
            setServerError(msg);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <h2 className="mb-4 fw-semibold">Register</h2>

                    {serverError && <Alert variant="danger">{serverError}</Alert>}
                    {serverSuccess && <Alert variant="success">{serverSuccess}</Alert>}

                    <Form onSubmit={onSubmit} noValidate>

                        {/* Full Name */}
                        <Form.Group className="mb-3" controlId="fullName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.fullName}
                                onChange={(e) => setField("fullName", e.target.value)}
                                isInvalid={!!errors.fullName}
                            />
                            <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Email */}
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={form.email}
                                onChange={(e) => setField("email", e.target.value)}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Mobile Number */}
                        <Form.Group className="mb-3" controlId="mobile">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                                type="tel"
                                value={form.mobile}
                                onChange={(e) => setField("mobile", e.target.value.replace(/\D/g, ""))}
                                isInvalid={!!errors.mobile}
                                maxLength={10}
                            />
                            <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Password */}
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={form.password}
                                onChange={(e) => setField("password", e.target.value)}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>

                            {/* Conditional display for password strength */}
                            {form.password && (
                                <>
                                    <div className="mt-2 small">Password strength: {strengthLabel}</div>
                                    <ProgressBar now={strength} variant={strengthVariant} className="mt-1" />
                                </>
                            )}
                        </Form.Group>

                        {/* Confirm Password */}
                        <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={form.confirmPassword}
                                onChange={(e) => setField("confirmPassword", e.target.value)}
                                isInvalid={!!errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Role (Dropdown) */}
                        <Form.Group className="mb-4" controlId="role">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={form.role}
                                onChange={(e) => setField("role", e.target.value)}
                                isInvalid={!!errors.role}
                            >
                                <option value="CLIENT">Client</option>
                                <option value="ADMIN">Admin</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Register Button */}
                        <div className="d-grid">
                            {/* Removed !formValid check so the button is clickable to initiate validation */}
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Registering..." : "Register"}
                            </Button>
                        </div>

                        <div className="text-center">
                            <span className="text-muted">
                                Already have an account?{" "}
                                <Button
                                    variant="link"
                                    className="p-0 fw-semibold text-primary"
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </Button>
                            </span>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}