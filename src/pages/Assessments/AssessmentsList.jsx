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
        window.location.href = `/assessments/edit/${id}`;
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500" />
                    <div className="mt-2 space-y-4 animate-pulse">
                        <div className="h-6 w-56 rounded bg-slate-200" />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="rounded-xl border border-slate-200 p-5">
                                    <div className="h-5 w-40 rounded bg-slate-200 mb-2" />
                                    <div className="h-4 w-full rounded bg-slate-200" />
                                    <div className="mt-4 h-3 w-3/4 rounded bg-slate-200" />
                                    <div className="mt-2 h-3 w-2/3 rounded bg-slate-200" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header Card */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500" />
                <div className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">All Assessments</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Review, edit, and manage assessments from the list below.
                        </p>
                    </div>
                    <button
                        onClick={() => (window.location.href = "/create-assessments")}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                        Create New Assessment
                    </button>
                </div>
            </div>

            {/* Empty State */}
            {assessments.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-blue-50 ring-1 ring-blue-200 flex items-center justify-center">
                        <span className="text-blue-600 text-xl">ℹ️</span>
                    </div>
                    <p className="text-slate-700 font-medium">No assessments found</p>
                    <p className="text-slate-500 text-sm mt-1">Click “Create New Assessment” to get started.</p>
                </div>
            ) : (
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {assessments.map((a) => (
                        <div
                            key={a._id}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            {/* Actions */}
                            <div className="absolute right-3 top-3 z-10 flex gap-2">
                                <button
                                    onClick={() => handleEdit(a._id)}
                                    className="p-2 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100"
                                    title="Edit"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(a._id)}
                                    className="p-2 rounded-full bg-red-50 text-red-700 ring-1 ring-red-200 hover:bg-red-100"
                                    title="Delete"
                                >
                                    <FaTrash />
                                </button>
                                <button
                                    onClick={() => (window.location.href = `/assessments/assigned/${a._id}`)}
                                    className="p-2 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                                    title="Results"
                                >
                                    Results
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-5">
                                {/* Title & subtitle */}
                                <h2 className="pr-24 text-lg font-semibold text-slate-800">
                                    {a.assessmentName}
                                </h2>
                                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                                    {a.assessmentDesc}
                                </p>

                                {/* Quick stats */}
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                                        Max: {a.maxMarks}
                                    </span>
                                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
                                        Pass: {a.passingPercentage}%
                                    </span>
                                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-200">
                                        Time: {a.timelimit} min
                                    </span>
                                </div>

                                {/* Proctoring */}
                                <div className="mt-4">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Proctoring Rules</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {a?.ProctoringFor &&
                                            Object.entries(a.ProctoringFor).map(([key, value]) =>
                                                value?.inUse ? (
                                                    <div
                                                        key={value._id}
                                                        className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                                                    >
                                                        {iconMap[key]}
                                                        <span className="capitalize">
                                                            {key} • max {value.maxViolations}
                                                        </span>
                                                    </div>
                                                ) : null
                                            )}
                                    </div>
                                </div>

                                {/* Modules */}
                                <div className="mt-4">
                                    <h3 className="text-sm font-semibold text-slate-700">Modules</h3>
                                    <ul className="mt-1 space-y-2">
                                        {a.Assessmentmodules.map((m) => (
                                            <li
                                                key={m._id}
                                                className="flex flex-wrap items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                                            >
                                                <span className="font-medium text-slate-800">
                                                    {m.module.moduleName}
                                                </span>
                                                <span className="flex gap-2">
                                                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                                                        {m.module.noOfQuestions} Qs
                                                    </span>
                                                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                                                        {m.module.timelimit} min
                                                    </span>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
