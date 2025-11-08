import { useEffect, useState } from "react";
import { Row, Col, Card, ProgressBar, Spinner, Alert, Table } from "react-bootstrap";
import api from "../../services/api";

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/api/dashboard/client")
            .then((res) => setData(res.data))
            .catch((err) => setError(err?.response?.data?.message || "Error fetching dashboard data"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!data) return null;

    const { totalAssets, totalLiabilities, netWorth, goals, riskProfile } = data;

    return (
        <>
            <Row className="mb-3">
                <Col><Card><Card.Body><h6>Total Assets</h6><h3>₹{totalAssets?.toLocaleString()}</h3></Card.Body></Card></Col>
                <Col><Card><Card.Body><h6>Total Liabilities</h6><h3>₹{totalLiabilities?.toLocaleString()}</h3></Card.Body></Card></Col>
                <Col><Card><Card.Body><h6>Net Worth</h6><h3>₹{netWorth?.toLocaleString()}</h3></Card.Body></Card></Col>
            </Row>

            <Row>
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Your Goals</Card.Title>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Goal</th><th>Target</th><th>Achieved</th><th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {goals.map((g, i) => (
                                        <tr key={i}>
                                            <td>{g.goalName}</td>
                                            <td>₹{g.targetAmount.toLocaleString()}</td>
                                            <td>₹{g.achievedAmount.toLocaleString()}</td>
                                            <td style={{ width: 220 }}>
                                                <ProgressBar now={g.progress} label={`${g.progress}%`} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Risk Profile</Card.Title>
                            <div>Type: <strong>{riskProfile?.riskType || "Not Completed"}</strong></div>
                            <div>Score: <strong>{riskProfile?.score || "—"}</strong></div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
