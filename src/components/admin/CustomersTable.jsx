import React, { useEffect, useState } from "react";
import { Table, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { getAllClients } from "../../services/adminApi";
import "../../styles/AdminDashboard.css";

const CustomersTable = () => {
    const [clients, setClients] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState({ name: "", email: "", role: "" });

    useEffect(() => {
        getAllClients()
            .then((res) => {
                console.log("✅ Backend client response:", res); // <-- log once to verify
                setClients(res || []);
                setFiltered(res || []);
            })
            .catch((err) => console.error("Error loading clients:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = (field, value) => {
        const updated = { ...search, [field]: value };
        setSearch(updated);

        const result = clients.filter((c) => {
            const name = c.fullName || c.full_name || "";
            const email = c.email || "";
            const role = c.role || "";

            const matchesName = name.toLowerCase().includes(updated.name.toLowerCase());
            const matchesEmail = email.toLowerCase().includes(updated.email.toLowerCase());
            const matchesRole = role.toLowerCase().includes(updated.role.toLowerCase());

            return matchesName && matchesEmail && matchesRole;
        });

        setFiltered(result);
    };

    if (loading)
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );

    return (
        <div className="client-container">
            {/* --- Search Filters --- */}
            <Form className="mb-4">
                <Row className="g-3">
                    <Col md={4} sm={12}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Name"
                            value={search.name}
                            onChange={(e) => handleSearch("name", e.target.value)}
                        />
                    </Col>
                    <Col md={4} sm={12}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Email"
                            value={search.email}
                            onChange={(e) => handleSearch("email", e.target.value)}
                        />
                    </Col>
                    <Col md={4} sm={12}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Role"
                            value={search.role}
                            onChange={(e) => handleSearch("role", e.target.value)}
                        />
                    </Col>
                </Row>
            </Form>

            {/* --- Table --- */}
            {filtered.length === 0 ? (
                <Alert variant="secondary">No clients found.</Alert>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((client, index) => (
                                <tr key={client.userId || client.id || index}>
                                    <td>{index + 1}</td>
                                    <td>{client.fullName || client.full_name || "—"}</td>
                                    <td>{client.email || "—"}</td>
                                    <td>{client.role || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default CustomersTable;
