import React, { useEffect, useState } from "react";
import { FaMicrophone, FaVideo, FaUserFriends, FaMobileAlt, FaEdit, FaTrash } from "react-icons/fa";
import { MdVisibilityOff, MdTab, MdKeyboard } from "react-icons/md";

const iconMap = {
    mic: <FaMicrophone className="text-red-500" />,
    invisiblecam: <MdVisibilityOff className="text-gray-500" />,
    webcam: <FaVideo className="text-blue-500" />,
    TabSwitch: <MdTab className="text-yellow-500" />,
    multiplePersonInFrame: <FaUserFriends className="text-purple-500" />,
    PhoneinFrame: <FaMobileAlt className="text-green-500" />,
    ControlKeyPressed: <MdKeyboard className="text-orange-500" />,
};

export default function AssessmentsList() {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch assessments
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found, please login.");
            setLoading(false);
            return;
        }
        fetch("https://api.slanster.com/api/v1/assessments/admin", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setAssessments(data.data);
                }
            })
            .catch((err) => console.error("Error fetching assessments:", err))
            .finally(() => setLoading(false));
    }, []);

    // Handle delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this assessment?")) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`https://api.slanster.com/api/v1/assessments/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.success) {
                setAssessments((prev) => prev.filter((a) => a._id !== id));
                alert("Assessment deleted successfully");
            } else {
                alert(data.message || "Failed to delete assessment");
            }
        } catch (err) {
            console.error("Error deleting assessment:", err);
            alert("Error deleting assessment");
        }
    };

    // Handle edit
    const handleEdit = (id) => {
        // Redirect to edit page (you can adjust route as per your setup)
        window.location.href = `/assessments/edit/${id}`;
    };

    if (loading) return <p className="text-center text-lg">Loading assessments...</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-6">All Assessments</h1>
                <button
                    onClick={() => (window.location.href = "/create-assessments")}
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create New Assessment
                </button>
            </div>

            {assessments.length === 0 ? (
                <p>No assessments found</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {assessments.map((a) => (
                        <div
                            key={a._id}
                            className="border rounded-xl shadow-md p-5 hover:shadow-lg transition relative"
                        >
                            {/* Title */}
                            <h2 className="text-xl font-semibold">{a.assessmentName}</h2>
                            <p className="text-gray-600">{a.assessmentDesc}</p>

                            {/* Actions */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => handleEdit(a._id)}
                                    className="p-2 rounded-full bg-blue-100 hover:bg-blue-200"
                                    title="Edit"
                                >
                                    <FaEdit className="text-blue-600" />
                                </button>
                                <button
                                    onClick={() => handleDelete(a._id)}
                                    className="p-2 rounded-full bg-red-100 hover:bg-red-200"
                                    title="Delete"
                                >
                                    <FaTrash className="text-red-600" />
                                </button>
                                <button
                                    onClick={() => (window.location.href = `/assessments/assigned/${a._id}`)}
                                    className="p-2 rounded-full bg-green-100 hover:bg-green-200"
                                    title="Assign"
                                >
                                    Results
                                </button>

                            </div>

                            {/* Assessment Info */}
                            <div className="mt-3">
                                <p><strong>Max Marks:</strong> {a.maxMarks}</p>
                                <p><strong>Passing %:</strong> {a.passingPercentage}</p>
                                <p><strong>Time Limit:</strong> {a.timelimit} mins</p>
                            </div>

                            {/* Proctoring Section */}
                            <div className="mt-4">
                                <h3 className="font-semibold mb-2">Proctoring Rules</h3>
                                <div className="flex flex-wrap gap-3">
                                    {Object.entries(a.ProctoringFor).map(([key, value]) =>
                                        value.inUse ? (
                                            <div
                                                key={value._id}
                                                className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
                                            >
                                                {iconMap[key]}
                                                <span className="text-sm">
                                                    {key} (max: {value.maxViolations})
                                                </span>
                                            </div>
                                        ) : null
                                    )}
                                </div>
                            </div>

                            {/* Modules */}
                            <div className="mt-4">
                                <h3 className="font-semibold">Modules</h3>
                                <ul className="list-disc list-inside">
                                    {a.Assessmentmodules.map((m) => (
                                        <li key={m._id}>
                                            {m.module.moduleName} ({m.module.noOfQuestions} questions,{" "}
                                            {m.module.timelimit} mins)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
