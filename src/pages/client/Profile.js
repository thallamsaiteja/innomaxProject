import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import api from "../../services/api";

export default function Profile() {
    // ✅ Use stored userId (set during login)
    const userId = localStorage.getItem("userId");

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        // mobile: "",
        pan: "",
        dateOfBirth: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        occupation: "",
        company: "",
        designation: "",
        department: "",
        yearsOfExperience: "",
        annualSalary: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ✅ Fetch profile data from backend
    const fetchProfile = async () => {
        try {
            const res = await api.get(`/api/client/profile/${userId}`);
            if (res.data) {
                setForm({
                    firstName: res.data.firstName || "",
                    lastName: res.data.lastName || "",
                    // mobile: res.data.mobile || "",
                    pan: res.data.pan || "", dateOfBirth: res.data.dateOfBirth || "",
                    addressLine1: res.data.addressLine1 || "",
                    addressLine2: res.data.addressLine2 || "",
                    city: res.data.city || "",
                    state: res.data.state || "",
                    country: res.data.country || "",
                    pincode: res.data.pincode || "",
                    occupation: res.data.occupation || "",
                    company: res.data.company || "",
                    designation: res.data.designation || "",
                    department: res.data.department || "",
                    yearsOfExperience: res.data.yearsOfExperience || "",
                    annualSalary: res.data.annualSalary || "",
                });
            }
        } catch {
            console.log("No existing profile found — new user.");
        }
    };

    useEffect(() => {
        if (userId) fetchProfile();
    }, [userId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ Submit profile (Create or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!userId) {
            setError("User not logged in.");
            return;
        }

        const payload = {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            // mobile: form.mobile.trim(),
            pan: form.pan,
            dateOfBirth: form.dateOfBirth,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
            city: form.city,
            state: form.state,
            country: form.country,
            pincode: form.pincode,
            occupation: form.occupation,
            company: form.company,
            designation: form.designation,
            department: form.department,
            yearsOfExperience: form.yearsOfExperience,
            annualSalary: form.annualSalary,
        };

        try {
            await api.post(`/api/client/profile/${userId}`, payload);
            setMessage("✅ Profile saved successfully!");
        } catch (err) {
            console.error("Profile save error:", err);
            setError("❌ Failed to save profile. Please try again.");
        }
    };

    return (
        <>
            <h4 className="fw-semibold mb-4">Profile Details</h4>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    {/* <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col> */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateOfBirth"
                                value={form.dateOfBirth}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>PAN Number</Form.Label>
                    <Form.Control
                        name="pan"
                        value={form.pan}
                        onChange={handleChange}
                        maxLength={10}
                        placeholder="ABCDE1234F"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control
                        name="addressLine1"
                        value={form.addressLine1}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Address Line 2</Form.Label>
                    <Form.Control
                        name="addressLine2"
                        value={form.addressLine2}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Pincode</Form.Label>
                            <Form.Control
                                name="pincode"
                                value={form.pincode}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={8}>
                        <Form.Group className="mb-3">
                            <Form.Label>Occupation</Form.Label>
                            <Form.Control
                                name="occupation"
                                value={form.occupation}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Company</Form.Label>
                            <Form.Control
                                name="company"
                                value={form.company}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Designation</Form.Label>
                            <Form.Control
                                name="designation"
                                value={form.designation}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Department</Form.Label>
                            <Form.Control
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group className="mb-3">
                            <Form.Label>Years of Experience</Form.Label>
                            <Form.Control
                                name="yearsOfExperience"
                                value={form.yearsOfExperience}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group className="mb-3">
                            <Form.Label>Annual Salary</Form.Label>
                            <Form.Control
                                name="annualSalary"
                                value={form.annualSalary}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button type="submit" variant="primary">
                    Save Profile
                </Button>
            </Form>
        </>
    );
}
