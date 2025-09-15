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
            const token = localStorage.getItem("token"); // get token from localStorage

            const payload = {
                ...formData,
                perHoursRate: Number(formData.perHoursRate),
                skills: skills.filter((s) => s.trim() !== ""), // clean empty values
            };

            const res = await fetch("https://api.slanster.com/api/v1/mentor/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // add token here
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            setResponse(data);
        } catch (error) {
            setResponse({ error: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Create Mentor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {["name", "designation", "company", "experience", "description", "imageUrl", "perHoursRate"].map(
                    (field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium capitalize mb-1">
                                {field}
                            </label>
                            <input
                                type={field === "perHoursRate" ? "number" : "text"}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                placeholder={`Enter ${field}`}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required={field !== "imageUrl"}
                            />
                        </div>
                    )
                )}

                {/* Skills Section */}
                <div>
                    <label className="block text-sm font-medium mb-2">Skills</label>
                    {skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={skill}
                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                placeholder="Enter skill"
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {skills.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeSkill(index)}
                                    className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addSkill}
                        className="mt-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        + Add Skill
                    </button>
                </div>

                {response && (
                    <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                        <pre className="text-sm">{JSON.stringify(response.message, null, 2)}</pre>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Create Mentor"}
                </button>
            </form>

        </div>
    );
}
