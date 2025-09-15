import { useState } from "react";

export default function JobForm() {
    const [formData, setFormData] = useState({
        jobType: "inhouse",
        position: "",
        employment_type: "Full-time",
        key_skills: "",
        company: "",
        role_category: "",
        work_mode: "Hybrid",
        location: "",
        work_experience_from: "",
        work_experience_to: "",
        annual_salary_from: "",
        annual_salary_to: "",
        company_industry: "",
        educational_qualification: "",
        interview_mode: "Online",
        job_description: "",
        about_company: "",
        company_website_link: "",
        company_address: "",
        logoUrl: "",
        publishStatus: "active",
        lastDate: "",
        job_url: "",
    });

    const [loading, setLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponseMsg("");

        const token = localStorage.getItem("token"); // get token from localStorage
        const payload = {
            jobType: formData.jobType,
            position: formData.position,
            employment_type: formData.employment_type,
            key_skills: formData.key_skills.split(",").map((s) => s.trim()),
            company: formData.company,
            role_category: formData.role_category,
            work_mode: formData.work_mode,
            location: formData.location,
            work_experience: {
                isFresher: false,
                from: Number(formData.work_experience_from),
                to: Number(formData.work_experience_to),
            },
            annual_salary_range: {
                from: Number(formData.annual_salary_from),
                to: Number(formData.annual_salary_to),
            },
            company_industry: formData.company_industry,
            educational_qualification: formData.educational_qualification
                .split(",")
                .map((q) => q.trim()),
            interview_mode: formData.interview_mode,
            job_description: formData.job_description,
            about_company: formData.about_company,
            company_website_link: formData.company_website_link,
            company_address: formData.company_address,
            logoUrl: formData.logoUrl,
            publishStatus: formData.publishStatus,
            lastDate: formData.lastDate,
            ...(formData.jobType === "outSource" && { job_url: formData.job_url }),
        };

        try {
            const res = await fetch("https://api.slanster.com/api/v1/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // add token here
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.success === false) {
                setResponseMsg(`❌ ${data.message}`);
            }
            else {
                setResponseMsg("✅ Job created successfully");
            }
        } catch (error) {
            setResponseMsg("❌ Error creating job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6">
            <h2 className="text-2xl font-bold mb-4">Create Job</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Job Type */}
                <div>
                    <label className="block font-medium">Job Type</label>
                    <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="inhouse">Inhouse</option>
                        <option value="outSource">OutSource</option>
                    </select>
                </div>

                {/* Conditional Job URL */}
                {formData.jobType === "outSource" && (
                    <div>
                        <label className="block font-medium">Job URL</label>
                        <input
                            type="text"
                            name="job_url"
                            value={formData.job_url}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="https://example.com/job"
                        />
                    </div>
                )}

                {/* Position */}
                <div>
                    <label className="block font-medium">Position</label>
                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Software Engineer"
                    />
                </div>

                {/* Key Skills */}
                <div>
                    <label className="block font-medium">Key Skills (comma separated)</label>
                    <input
                        type="text"
                        name="key_skills"
                        value={formData.key_skills}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="JavaScript, Node.js, React"
                    />
                </div>

                {/* Work Experience */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium">Experience From (Years)</label>
                        <input
                            type="number"
                            name="work_experience_from"
                            value={formData.work_experience_from}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Experience To (Years)</label>
                        <input
                            type="number"
                            name="work_experience_to"
                            value={formData.work_experience_to}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                </div>

                {/* Salary Range */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium">Salary From</label>
                        <input
                            type="number"
                            name="annual_salary_from"
                            value={formData.annual_salary_from}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Salary To</label>
                        <input
                            type="number"
                            name="annual_salary_to"
                            value={formData.annual_salary_to}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                </div>

                {/* Company Details */}
                <div>
                    <label className="block font-medium">Company Name</label>
                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* Job Description */}
                <div>
                    <label className="block font-medium">Job Description</label>
                    <textarea
                        name="job_description"
                        value={formData.job_description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        rows="4"
                    />
                </div>

                {/* Last Date */}
                <div>
                    <label className="block font-medium">Last Date</label>
                    <input
                        type="date"
                        name="lastDate"
                        value={formData.lastDate}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* Role Category */}
                <div>
                    <label className="block font-medium">Role Category</label>
                    <input
                        type="text"
                        name="role_category"
                        value={formData.role_category}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Engineering"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block font-medium">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Bangalore, India"
                    />
                </div>

                {/* Company Industry */}
                <div>
                    <label className="block font-medium">Company Industry</label>
                    <input
                        type="text"
                        name="company_industry"
                        value={formData.company_industry}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Information Technology"
                    />
                </div>

                {/* About Company */}
                <div>
                    <label className="block font-medium">About Company</label>
                    <textarea
                        name="about_company"
                        value={formData.about_company}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        rows="3"
                        placeholder="TechCorp is a leading IT solutions provider..."
                    />
                </div>

                {/* Company Website */}
                <div>
                    <label className="block font-medium">Company Website</label>
                    <input
                        type="url"
                        name="company_website_link"
                        value={formData.company_website_link}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="https://www.techcorp.com"
                    />
                </div>

                {/* Company Address */}
                <div>
                    <label className="block font-medium">Company Address</label>
                    <input
                        type="text"
                        name="company_address"
                        value={formData.company_address}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="123 TechPark, Bangalore, India"
                    />
                </div>

                {/* Company Logo */}
                <div>
                    <label className="block font-medium">Company Logo URL</label>
                    <input
                        type="url"
                        name="logoUrl"
                        value={formData.logoUrl}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="https://example.com/logo.png"
                    />
                </div>

                {/* Educational Qualification */}
                <div>
                    <label className="block font-medium">Educational Qualification (comma separated)</label>
                    <input
                        type="text"
                        name="educational_qualification"
                        value={formData.educational_qualification}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="B.Tech, M.Tech"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                    {loading ? "Submitting..." : "Submit Job"}
                </button>
            </form>

            {responseMsg && (
                <p className="mt-4 text-center font-medium">{responseMsg}</p>
            )}
        </div>
    );
}
