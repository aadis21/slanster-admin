import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Sample data (replace with API fetch if needed)

const AssignedList = () => {
    const { assessmentId } = useParams();
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // Replace this with API call if needed
        const fetchStudents = async () => {
            // Simulate API call delay
            try {
                // In real scenario, fetch from API
                const res = await fetch(`https://api.slanster.com/api/v1/assessments/admin/result/${assessmentId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const studentData = await res.json();
                const data = studentData; // Using sample data here
                if (data.success) {
                    setStudents(data.results);
                } else {
                    console.error("Failed to fetch students");
                }
            } catch (err) {
                console.error("Error fetching students:", err);
            }
        }
        fetchStudents();
    }, [assessmentId]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-4">Students List</h1>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
                    onClick={() => alert("Add Student functionality to be implemented")}
                >
                    Add Student
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Score</th>
                            <th className="py-2 px-4 border-b">Attempts</th>
                            <th className="py-2 px-4 border-b">Last Attempt</th>
                            <th className="py-2 px-4 border-b">Remarks</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.userId} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{student.email}</td>
                                <td className="py-2 px-4 border-b capitalize">{student.status}</td>
                                <td className="py-2 px-4 border-b">{student.score}</td>
                                <td className="py-2 px-4 border-b">{student.attemptCount}</td>
                                <td className="py-2 px-4 border-b">
                                    {student.lastAttempt
                                        ? new Date(student.lastAttempt).toLocaleString()
                                        : "-"}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {student.remarks || "-"}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        onClick={() => window.location.href = `/assessments/user-report/${assessmentId}/${student.userId}`}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignedList;
