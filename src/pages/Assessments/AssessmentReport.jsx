import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AssessmentReport = () => {
    const { assessmentId, userId } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                setError(null);

                // Replace 'YOUR_BEARER_TOKEN' with actual token
                const token = localStorage.getItem("token"); // or any auth storage

                const response = await axios.get(
                    `http://localhost:8080/api/v1/assessments/admin/result/${assessmentId}/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setReport(response.data); // assuming API returns report in response.data
            } catch (err) {
                console.error(err);
                setError("Failed to fetch assessment report");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [assessmentId, userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!report) return <div>No report found</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Assessment Report</h1>

            {/* Basic Info */}
            <div className="mb-6">
                <p><strong>Name:</strong> {report.name}</p>
                <p><strong>Email:</strong> {report.email}</p>
                <p><strong>Status:</strong> <span className="capitalize">{report.status}</span></p>
                <p><strong>Score:</strong> {report.score}</p>
                <p><strong>Remarks:</strong> {report.remarks || "-"}</p>
                <p><strong>Last Attempt:</strong> {report.lastAttempt ? new Date(report.lastAttempt).toLocaleString() : "-"}</p>
                <p><strong>Assessment Submission Time:</strong> {report.assessmentSubmissionTime} mins</p>
                <p><strong>Proctoring Violations:</strong> {Object.entries(report.proctoringViolations).map(([key, value]) => `${key}: ${value}`).join(", ")}</p>
            </div>

            {/* Questions Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="py-2 px-4 border-b">Question</th>
                            <th className="py-2 px-4 border-b">Submitted Answer</th>
                            <th className="py-2 px-4 border-b">Correct Answer</th>
                            <th className="py-2 px-4 border-b">Is Correct</th>
                            <th className="py-2 px-4 border-b">Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.questions.map((q) => (
                            <tr key={q.questionId} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{q.question}</td>
                                <td className="py-2 px-4 border-b">{q.submittedAnswer ? q.options[q.submittedAnswer] : "-"}</td>
                                <td className="py-2 px-4 border-b">{q.correctAnswer ? q.options[q.correctAnswer] : "-"}</td>
                                <td className="py-2 px-4 border-b">
                                    {q.isCorrect === true ? (
                                        <span className="text-green-600 font-semibold">Correct</span>
                                    ) : q.isCorrect === false ? (
                                        <span className="text-red-600 font-semibold">Incorrect</span>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">{q.isCorrect ? q.maxMarks : q.isSubmitted ? `-${q.negativeMarks}` : 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssessmentReport;
