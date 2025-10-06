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

    const skillChips = formData.key_skills
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const eduChips = formData.educational_qualification
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const isSuccess = responseMsg.startsWith("✅");
    const isError = responseMsg.startsWith("❌");

    return (
        <div className="mx-auto w-full max-w-5xl">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] mt-6">
                {/* Accent bar */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500" />

                <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-slate-800">Create Job</h2>
                            <p className="mt-1 text-sm text-slate-500">Fill the details to publish a new job listing.</p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                            Admin
                        </span>
                    </div>

                    {/* Alerts */}
                    {responseMsg && (
                        <div
                            className={[
                                "mb-6 rounded-xl border px-4 py-3 text-sm",
                                isSuccess
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                    : isError
                                    ? "border-red-200 bg-red-50 text-red-700"
                                    : "border-slate-200 bg-slate-50 text-slate-700",
                            ].join(" ")}
                            role="status"
                            aria-live="polite"
                        >
                            {responseMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section: Type & Meta */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-medium uppercase tracking-wide text-slate-600">Type & Metadata</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Job Type</label>
                                    <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option value="inhouse">Inhouse</option>
                                        <option value="outSource">OutSource</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Position</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        placeholder="Software Engineer"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Employment Type</label>
                                    <select
                                        name="employment_type"
                                        value={formData.employment_type}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Internship</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Work Mode</label>
                                    <select
                                        name="work_mode"
                                        value={formData.work_mode}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option>Hybrid</option>
                                        <option>Onsite</option>
                                        <option>Remote</option>
                                    </select>
                                </div>

                                {/* Conditional Job URL */}
                                {formData.jobType === "outSource" && (
                                    <div className="sm:col-span-2">
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Job URL</label>
                                        <input
                                            type="text"
                                            name="job_url"
                                            value={formData.job_url}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                            placeholder="https://example.com/job"
                                        />
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Section: Experience & Compensation */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-medium uppercase tracking-wide text-slate-600">Experience & Compensation</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Experience From (Years)</label>
                                    <input
                                        type="number"
                                        name="work_experience_from"
                                        value={formData.work_experience_from}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Experience To (Years)</label>
                                    <input
                                        type="number"
                                        name="work_experience_to"
                                        value={formData.work_experience_to}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Salary From</label>
                                    <input
                                        type="number"
                                        name="annual_salary_from"
                                        value={formData.annual_salary_from}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Salary To</label>
                                    <input
                                        type="number"
                                        name="annual_salary_to"
                                        value={formData.annual_salary_to}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section: Company Details */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-medium uppercase tracking-wide text-slate-600">Company Details</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Company Name</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Company Industry</label>
                                    <input
                                        type="text"
                                        name="company_industry"
                                        value={formData.company_industry}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        placeholder="Information Technology"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Company Website</label>
                                    <input
                                        type="url"
                                        name="company_website_link"
                                        value={formData.company_website_link}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        placeholder="https://www.techcorp.com"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Company Address</label>
                                    <input
                                        type="text"
                                        name="company_address"
                                        value={formData.company_address}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        placeholder="123 TechPark, Bangalore, India"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Company Logo URL</label>
                                    <input
                                        type="url"
                                        name="logoUrl"
                                        value={formData.logoUrl}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        placeholder="https://example.com/logo.png"
                                    />
                                    {formData.logoUrl?.trim() && (
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="h-16 w-16 overflow-hidden rounded-lg ring-1 ring-slate-200">
                                                
                                                <img
                                                    src={formData.logoUrl}
                                                    alt="Logo preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500">Live logo preview</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Section: Role Details */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-medium uppercase tracking-wide text-slate-600">Role Details</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Role Category</label>
                                    <input
                                        type="text"
                                        name="role_category"
                                        value={formData.role_category}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        placeholder="Engineering"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        placeholder="Bangalore, India"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Interview Mode</label>
                                    <select
                                        name="interview_mode"
                                        value={formData.interview_mode}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option>Online</option>
                                        <option>Offline</option>
                                        <option>Hybrid</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Publish Status</label>
                                    <select
                                        name="publishStatus"
                                        value={formData.publishStatus}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Last Date</label>
                                    <input
                                        type="date"
                                        name="lastDate"
                                        value={formData.lastDate}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Key Skills <span className="text-slate-400 font-normal">(comma separated)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="key_skills"
                                        value={formData.key_skills}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        placeholder="JavaScript, Node.js, React"
                                    />
                                    {skillChips?.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {skillChips.map((s, i) => (
                                                <span
                                                    key={`${s}-${i}`}
                                                    className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200"
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Section: Descriptions */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-medium uppercase tracking-wide text-slate-600">Descriptions</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Job Description</label>
                                    <textarea
                                        name="job_description"
                                        value={formData.job_description}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Educational Qualification <span className="text-slate-400 font-normal">(comma separated)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="educational_qualification"
                                        value={formData.educational_qualification}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        placeholder="B.Tech, M.Tech"
                                    />
                                    {eduChips?.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {eduChips.map((s, i) => (
                                                <span
                                                    key={`${s}-${i}`}
                                                    className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">About Company</label>
                                    <textarea
                                        name="about_company"
                                        value={formData.about_company}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="TechCorp is a leading IT solutions provider..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Submit */}
                        <div className="flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <span className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 via-white/10 to-blue-600/0 opacity-0 transition group-hover:opacity-100" />
                                {loading ? "Submitting..." : "Submit Job"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
