import React, { useState, useEffect } from "react";
import { Button, ProgressBar, Alert, Spinner } from "react-bootstrap";
import api from "../../services/api";

export default function RiskProfile() {
    const userId = localStorage.getItem("userId");

    const [answers, setAnswers] = useState(Array(12).fill(null));
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [riskType, setRiskType] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const questions = [
        "How comfortable are you with investment risk?",
        "How long do you plan to invest?",
        "How would you react if your portfolio dropped by 20%?",
        "Do you prefer fixed returns or market-based returns?",
        "Do you track the stock market regularly?",
        "What’s your primary investment goal?",
        "How soon might you need your invested funds?",
        "Do you have existing loans or EMIs?",
        "Do you invest in mutual funds or equities?",
        "How do you feel about market volatility?",
        "Do you diversify your portfolio?",
        "Would you increase investments after a market dip?",
    ];

    // ✅ Fetch previous result on page load
    useEffect(() => {
        const fetchPreviousResult = async () => {
            try {
                const res = await api.get(`/api/client/risk-profile/${userId}`);
                if (res.data) {
                    setScore(res.data.score);
                    setRiskType(res.data.riskType);
                    setSubmitted(true);
                    setMessage("✅ You already completed the assessment.");
                }
            } catch (err) {
                // No previous result found — user can take test
                console.log("No previous risk profile found, user can take test.");
            } finally {
                setLoading(false);
            }
        };

        fetchPreviousResult();
    }, [userId]);

    const handleAnswer = (qIndex, value) => {
        const updated = [...answers];
        updated[qIndex] = value;
        setAnswers(updated);
    };

    const calculateRisk = async () => {
        const total = answers.reduce((a, b) => a + (b || 0), 0);
        setScore(total);

        let risk = "Conservative";
        if (total > 10 && total <= 20) risk = "Moderate";
        else if (total > 20) risk = "Aggressive";
        setRiskType(risk);

        try {
            await api.post(`/api/client/risk-profile/${userId}/submit`, answers);
            setMessage("✅ Risk profile saved successfully!");
        } catch (error) {
            console.error("Error saving risk profile:", error);
            setMessage("❌ Error saving risk profile.");
        }

        setSubmitted(true);
    };

    const retakeQuiz = async () => {
        try {
            const res = await api.delete(`/api/client/risk-profile/${userId}/retake`);
            if (res.status === 200) {
                setAnswers(Array(12).fill(null));
                setSubmitted(false);
                setMessage("");
            } else {
                alert("Failed to reset quiz. Please try again.");
            }
        } catch (error) {
            console.error("Error retaking quiz:", error);
            if (error.response?.status === 401) {
                alert("Unauthorized: please log in again.");
            } else {
                alert("Failed to reset quiz");
            }
        }
    };


    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" /> <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <h4 className="fw-semibold mb-3">Risk Profile Assessment</h4>
            {message && <Alert variant={message.startsWith("✅") ? "success" : "info"}>{message}</Alert>}

            {!submitted ? (
                <>
                    {questions.map((q, i) => (
                        <div key={i} className="mb-3">
                            <p className="fw-medium">{i + 1}. {q}</p>
                            {[1, 2].map((val) => (
                                <Button
                                    key={val}
                                    variant={answers[i] === val ? "primary" : "outline-secondary"}
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleAnswer(i, val)}
                                >
                                    {val === 1 ? "No" : "Yes"}
                                </Button>
                            ))}
                        </div>
                    ))}
                    <Button
                        variant="success"
                        onClick={calculateRisk}
                        disabled={answers.includes(null)}
                    >
                        Submit Quiz
                    </Button>
                </>
            ) : (
                <div className="text-center mt-5">
                    <h5>Your Score: {score}</h5>
                    <ProgressBar
                        now={(score / 24) * 100}
                        className="mb-3"
                        variant={
                            riskType === "Aggressive" ? "danger"
                                : riskType === "Moderate" ? "warning"
                                    : "success"
                        }
                    />
                    <h4>Risk Type: {riskType}</h4>
                    <Button variant="outline-dark" className="mt-3" onClick={retakeQuiz}>
                        Retake Quiz
                    </Button>
                </div>
            )}
        </div>
    );
}
