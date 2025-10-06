import { useState } from "react";

export default function MentorForm() {
    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        company: "",
        experience: "",
        description: "",
        imageUrl: "",
        perHoursRate: "",
    });

    const [skills, setSkills] = useState([""]);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...skills];
        newSkills[index] = value;
        setSkills(newSkills);
    };

    const addSkill = () => setSkills([...skills, ""]);
    const removeSkill = (index) =>
        setSkills(skills.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);

        try {
            const token = localStorage.getItem("token");

            const payload = {
                ...formData,
                perHoursRate: Number(formData.perHoursRate),
                skills: skills.filter((s) => s.trim() !== ""),
            };

            const res = await fetch("https://api.slanster.com/api/v1/mentor/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            setResponse(data);

            // ✅ On success: alert + full page refresh
            if (res.ok) {
                alert("Mentor added successfully!");
                window.location.reload();
            } else {
                // Optional: show why it failed
                alert(data?.message || "Failed to add mentor. Please try again.");
            }
        } catch (error) {
            setResponse({ error: "Something went wrong" });
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filledSkills = skills.filter((s) => s.trim() !== "");

    return (
        <div className="mx-auto w-full max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500" />
                <div className="p-6 sm:p-8">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
                                Create Mentor
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Add a new mentor to your catalog. Fields marked with <span className="font-semibold text-slate-700">*</span> are required.
                            </p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                            Admin
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <section className="space-y-4">
                            <h3 className="text-sm font-medium uppercase tracking-wide text-slate-600">
                                Mentor Details
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {["name", "designation", "company", "experience", "description", "imageUrl", "perHoursRate"].map(
                                    (field) => (
                                        <div key={field} className={field === "imageUrl" ? "sm:col-span-2" : ""}>
                                            <label className="mb-1.5 block text-sm font-medium capitalize text-slate-700">
                                                {field}
                                                {field !== "imageUrl" && <span className="text-red-500">*</span>}
                                            </label>
                                            <input
                                                type={field === "perHoursRate" ? "number" : "text"}
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleChange}
                                                placeholder={`Enter ${field}`}
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                                required={field !== "imageUrl"}
                                            />
                                            {field === "imageUrl" && formData.imageUrl?.trim() !== "" && (
                                                <div className="mt-2 flex items-center gap-3">
                                                    <div className="h-16 w-16 overflow-hidden rounded-lg ring-1 ring-slate-200">
                                                        
                                                        <img
                                                            src={formData.imageUrl}
                                                            alt="Preview"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-slate-500">
                                                        Preview generated from the provided URL.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium uppercase tracking-wide text-slate-600">
                                    Skills
                                </h3>
                                {filledSkills.length > 0 && (
                                    <span className="text-xs text-slate-500">
                                        {filledSkills.length} skill{filledSkills.length > 1 ? "s" : ""} added
                                    </span>
                                )}
                            </div>

                            {filledSkills.length > 0 && (
                                <div className="mb-2 flex flex-wrap gap-2">
                                    {filledSkills.map((s, i) => (
                                        <span
                                            key={`${s}-${i}`}
                                            className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-2">
                                {skills.map((skill, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={skill}
                                            onChange={(e) => handleSkillChange(index, e.target.value)}
                                            placeholder="Enter skill"
                                            className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                            required
                                        />
                                        {skills.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(index)}
                                                className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-2.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:shadow"
                                                aria-label="Remove skill"
                                                title="Remove skill"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={addSkill}
                                className="mt-2 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 px-3.5 py-2 text-sm font-semibold text-white shadow hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                            >
                                + Add Skill
                            </button>
                        </section>

                        {response && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="mb-2 text-sm font-medium text-slate-700">Server Response</div>
                                <pre className="whitespace-pre-wrap break-words text-xs text-slate-700">
                                    {JSON.stringify(response.message, null, 2)}
                                </pre>
                                {"error" in response && (
                                    <div className="mt-2 text-sm text-red-600">{response.error}</div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <span className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 via-white/10 to-blue-600/0 opacity-0 transition group-hover:opacity-100" />
                                {loading ? "Submitting..." : "Create Mentor"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
