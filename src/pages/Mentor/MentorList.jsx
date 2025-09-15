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

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold mb-6 text-center">Mentor List</h2>
                <button
                    onClick={() => (window.location.href = "/add-mentor")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
                >
                    + Add Mentor
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                    <div
                        key={mentor._id}
                        className="border rounded-xl p-4 shadow hover:shadow-lg transition"
                    >
                        <img
                            src={mentor.imageUrl}
                            alt={mentor.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-semibold">{mentor.name}</h3>
                        <p className="text-gray-600">{mentor.designation}</p>
                        <p className="text-gray-600">{mentor.company}</p>
                        <p className="text-gray-600">{mentor.experience}</p>
                        <p className="mt-2 text-gray-700">{mentor.description}</p>
                        <p className="mt-2 font-medium">Rate: ₹{mentor.perHoursRate}/hr</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {mentor.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <button
                            onClick={() => handleDelete(mentor._id)}
                            className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
