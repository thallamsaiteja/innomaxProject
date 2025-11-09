import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Row, Col, Card, Container } from "react-bootstrap";
import api from "../../services/api";
import "../../styles/Profile.css";

export default function Profile() {
    const userId = localStorage.getItem("userId");

    const initialForm = {
        firstName: "",
        lastName: "",
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
    };

    const [form, setForm] = useState(initialForm);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(true);
    const [profileExists, setProfileExists] = useState(false);

    // ✅ Fetch profile data
    const fetchProfile = async () => {
        try {
            const res = await api.get(`/api/client/profile/${userId}`);
            if (res.data && (res.data.firstName || res.data.pan)) {
                setForm({ ...initialForm, ...res.data });
                setProfileExists(true);
                setIsEditing(false);
            } else {
                setForm(initialForm);
                setProfileExists(false);
                setIsEditing(true);
            }
        } catch (err) {
            console.log("No existing profile found — new user.", err);
            setForm(initialForm);
            setProfileExists(false);
            setIsEditing(true);
        }
    };

    useEffect(() => {
        if (userId) fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        try {
            await api.post(`/api/client/profile/${userId}`, form);
            setMessage("✅ Profile saved successfully!");
            setProfileExists(true);
            setIsEditing(false);
        } catch (err) {
            console.error("Profile save error:", err);
            setError("❌ Failed to save profile. Please try again.");
        }
    };

    return (
        <Container className="profile-page py-5">
            <Card className="profile-card shadow-lg p-4">
                <h3 className="text-center mb-4 profile-title">
                    {isEditing ? "Edit Profile" : "Profile Details"}
                </h3>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form
                    onSubmit={handleSubmit}
                    key={isEditing ? "edit-mode" : "view-mode"}
                >
                    <fieldset disabled={!isEditing}>
                        {/* Personal Info */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        placeholder="Enter first name"
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
                                        placeholder="Enter last name"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
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
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>PAN Number</Form.Label>
                                    <Form.Control
                                        name="pan"
                                        value={form.pan}
                                        onChange={handleChange}
                                        maxLength={10}
                                        placeholder="ABCDE1234F"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Address Info */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Address Line 1</Form.Label>
                                    <Form.Control
                                        name="addressLine1"
                                        value={form.addressLine1}
                                        onChange={handleChange}
                                        placeholder="Flat / Street / Area"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Address Line 2</Form.Label>
                                    <Form.Control
                                        name="addressLine2"
                                        value={form.addressLine2}
                                        onChange={handleChange}
                                        placeholder="Landmark / Optional"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
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
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Job Info */}
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Pincode</Form.Label>
                                    <Form.Control
                                        name="pincode"
                                        value={form.pincode}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Occupation</Form.Label>
                                    <Form.Control
                                        name="occupationType"
                                        value={form.occupationType}
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
                                    <Form.Label>Experience (Years)</Form.Label>
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
                    </fieldset>

                    {/* Buttons */}
                    <div className="text-center mt-4">
                        {isEditing ? (
                            <Button type="submit" className="save-btn px-5 py-2">
                                {profileExists ? "Save Edit" : "Save Profile"}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => {
                                    setIsEditing(true);
                                    setMessage("");
                                    setError("");
                                }}
                                className="edit-btn px-5 py-2"
                            >
                                ✏️ Update Profile
                            </Button>
                        )}
                    </div>
                </Form>
            </Card>
        </Container>
    );
}
