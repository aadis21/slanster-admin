import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CoursesList() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("https://api.slanster.com/api/v1/dashboard/courses", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // add token here
                    },
                }); // <-- adjust endpoint
                const data = await res.json();
                setCourses(data.courses || []);
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`https://api.slanster.com/api/v1/offline/course/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to delete course");
            }

            // Remove deleted course from state
            setCourses((prev) => prev.filter((course) => course._id !== id));
        } catch (err) {
            console.error("Error deleting course:", err);
            alert("Failed to delete course. Try again!");
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-6">Courses</h1>
                <button
                    onClick={() => navigate("/add-course")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    + Add New Course
                </button>
            </div>

            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : courses.length === 0 ? (
                <p className="text-gray-600">No courses found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg shadow-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">#</th>
                                <th className="px-4 py-2 border">Title</th>
                                <th className="px-4 py-2 border">Category</th>
                                <th className="px-4 py-2 border">Level</th>
                                <th className="px-4 py-2 border">Duration</th>
                                <th className="px-4 py-2 border">Price</th>
                                <th className="px-4 py-2 border">Enrollments</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course, idx) => (
                                <tr key={course._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border text-center">{idx + 1}</td>
                                    <td className="px-4 py-2 border font-medium">{course.title}</td>
                                    <td className="px-4 py-2 border">{course.category}</td>
                                    <td className="px-4 py-2 border">{course.level}</td>
                                    <td className="px-4 py-2 border">{course.duration} mins</td>
                                    <td className="px-4 py-2 border">₹{course.base_price}</td>
                                    <td className="px-4 py-2 border text-center">{course.enrollments}</td>
                                    <td className="px-4 py-2 border">
                                        {course.isActive ? (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 border text-center">
                                        <button
                                            onClick={() => navigate(`/edit-course/${course._id}`)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2">
                                            View/ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
