import { useEffect, useState } from "react";

export default function MentorList() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");

    const fetchMentors = async () => {
        setLoading(true);
        try {
            const res = await fetch("https://api.slanster.com/api/v1/mentor/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setMentors(data.mentors);
            } else {
                setError("Failed to fetch mentors");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this mentor?");
        if (!confirm) return;

        try {
            const res = await fetch(
                `https://api.slanster.com/api/v1/mentor/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            if (data.success) {
                setMentors(mentors.filter((m) => m._id !== id));
                // ✅ success alert
                alert("Mentor deleted successfully!");
            } else {
                alert("Failed to delete mentor");
            }
        } catch (err) {
            alert("Something went wrong");
        }
    };

    useEffect(() => {
        fetchMentors();
    }, []);

    if (loading)
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-slate-600 animate-pulse">Loading mentors...</p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="mt-16 rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
                    <p className="font-medium text-red-700">{error}</p>
                </div>
            </div>
        );

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header Card */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500" />
                <div className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
                            Mentor List
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Review all mentors and manage them from here.
                        </p>
                    </div>
                    <button
                        onClick={() => (window.location.href = "/add-mentor")}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                        + Add Mentor
                    </button>
                </div>
            </div>

            {/* Grid */}
            {mentors.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <p className="text-slate-600">No mentors found. Click “Add Mentor” to create one.</p>
                </div>
            ) : (
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {mentors.map((mentor) => (
                        <div
                            key={mentor._id}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            {/* Image */}
                            <div className="relative h-48 w-full overflow-hidden">
                                
                                <img
                                    src={mentor.imageUrl}
                                    alt={mentor.name}
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                            </div>

                            {/* Body */}
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            {mentor.name}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            {mentor.designation}
                                        </p>
                                        <p className="text-sm text-slate-500">{mentor.company}</p>
                                    </div>
                                    <span className="whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                                        ₹{mentor.perHoursRate}/hr
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-slate-600">
                                    {mentor.experience}
                                </p>

                                <p className="mt-3 line-clamp-3 text-sm text-slate-700">
                                    {mentor.description}
                                </p>

                                {/* Skills */}
                                {Array.isArray(mentor.skills) && mentor.skills.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {mentor.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={() => handleDelete(mentor._id)}
                                    className="mt-4 w-full rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
