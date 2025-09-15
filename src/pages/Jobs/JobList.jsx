import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobList() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://api.slanster.com/api/v1/admin/jobs", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.success) {
                setJobs(data.data);
            } else {
                setError(data.message || "Failed to fetch jobs");
            }
        } catch (err) {
            setError("Error fetching jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (jobId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`https://api.slanster.com/api/v1/jobs/${jobId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.success) {
                setJobs(jobs.filter((job) => job._id !== jobId));
                alert("Job deleted successfully");
            } else {
                alert("Failed to delete job");
            }
        } catch (err) {
            alert("Error deleting job");
        }
    };

    const handleApprove = async (jobId) => {
        const confirmApprove = window.confirm("Approve this job?");
        if (!confirmApprove) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`https://api.slanster.com/api/v1/jobs/${jobId}/approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.success) {
                alert("Job approved successfully");
                // Update job in local state
                setJobs((prevJobs) =>
                    prevJobs.map((job) =>
                        job._id === jobId ? { ...job, isApproved: true } : job
                    )
                );
            } else {
                alert("Failed to approve job");
            }
        } catch (err) {
            alert("Error approving job");
        }
    };

    if (loading) return <p className="p-4">Loading jobs...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-4">All Jobs</h1>
                <button
                    onClick={() => navigate("/add-job")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4">
                    + Add New Job
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b">Position</th>
                            <th className="py-2 px-4 border-b">Company</th>
                            <th className="py-2 px-4 border-b">Job Type</th>
                            <th className="py-2 px-4 border-b">Location</th>
                            <th className="py-2 px-4 border-b">Work Mode</th>
                            <th className="py-2 px-4 border-b">Job Approved</th>
                            <th className="py-2 px-4 border-b">Last Date</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job._id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{job.position}</td>
                                <td className="py-2 px-4 border-b">{job.company}</td>
                                <td className="py-2 px-4 border-b">{job.jobType}</td>
                                <td className="py-2 px-4 border-b">{job.location}</td>
                                <td className="py-2 px-4 border-b">{job.work_mode}</td>
                                <td className="py-2 px-4 border-b">{job.isApproved ? "Yes" : "No"}</td>
                                <td className="py-2 px-4 border-b">
                                    {new Date(job.lastDate).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-4 border-b space-x-2">
                                    <button
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                        onClick={() => navigate(`/edit-job/${job._id}`)}
                                    >
                                        View/Edit
                                    </button>
                                    {!job.isApproved && (
                                        <button
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                            onClick={() => handleApprove(job._id)}
                                        >
                                            Approve
                                        </button>
                                    )}
                                    <button
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        onClick={() => handleDelete(job._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {jobs.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center py-4">
                                    No jobs found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
