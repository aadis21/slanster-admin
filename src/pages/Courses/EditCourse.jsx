// src/pages/EditCourse.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditCourse() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [response, setResponse] = useState(null);

    // fetch existing course
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`https://api.slanster.com/api/v1/offline/course/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setFormData(data.course);
            } catch (err) {
                console.error("Error fetching course:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    // handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (field, index, value) => {
        const arr = [...formData[field]];
        arr[index] = value;
        setFormData((prev) => ({ ...prev, [field]: arr }));
    };

    const addArrayField = (field) => {
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const removeArrayField = (field, index) => {
        const arr = [...formData[field]];
        arr.splice(index, 1);
        setFormData((prev) => ({ ...prev, [field]: arr }));
    };

    const handleCurriculumChange = (mIndex, field, value) => {
        const updated = [...formData.curriculum];
        updated[mIndex][field] = value;
        setFormData((prev) => ({ ...prev, curriculum: updated }));
    };

    const handleLessonChange = (mIndex, lIndex, field, value) => {
        const updated = [...formData.curriculum];
        updated[mIndex].lessons[lIndex][field] = value;
        setFormData((prev) => ({ ...prev, curriculum: updated }));
    };

    const addModule = () => {
        setFormData((prev) => ({
            ...prev,
            curriculum: [
                ...prev.curriculum,
                { module_name: "", module_time: "", lessons: [{ lesson_name: "", duration: "", video: "" }] },
            ],
        }));
    };

    const removeModule = (mIndex) => {
        const updated = [...formData.curriculum];
        updated.splice(mIndex, 1);
        setFormData((prev) => ({ ...prev, curriculum: updated }));
    };

    const addLesson = (mIndex) => {
        const updated = [...formData.curriculum];
        updated[mIndex].lessons.push({ lesson_name: "", duration: "", video: "" });
        setFormData((prev) => ({ ...prev, curriculum: updated }));
    };

    const removeLesson = (mIndex, lIndex) => {
        const updated = [...formData.curriculum];
        updated[mIndex].lessons.splice(lIndex, 1);
        setFormData((prev) => ({ ...prev, curriculum: updated }));
    };

    const handleFaqChange = (index, field, value) => {
        const updated = [...formData.faqs];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, faqs: updated }));
    };

    const addFaq = () => {
        setFormData((prev) => ({ ...prev, faqs: [...prev.faqs, { question: "", answer: "" }] }));
    };

    const removeFaq = (index) => {
        const updated = [...formData.faqs];
        updated.splice(index, 1);
        setFormData((prev) => ({ ...prev, faqs: updated }));
    };

    // submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setResponse(null);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`https://api.slanster.com/api/v1/offline/course/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    duration: Number(formData.duration),
                    enrollments: Number(formData.enrollments),
                    total_lessons: Number(formData.total_lessons),
                    total_quiz: Number(formData.total_quiz),
                    base_price: Number(formData.base_price),
                    discount_percentage: Number(formData.discount_percentage),
                    rating: Number(formData.rating),
                    credits: Number(formData.credits),
                    curriculum: formData.curriculum.map((m) => ({
                        ...m,
                        module_time: Number(m.module_time),
                    })),
                }),
            });

            const data = await res.json();
            setResponse(data);
            if (res.ok) {
                alert("Course updated successfully!");
                navigate("/list-courses");
            }
        } catch (err) {
            setResponse({ success: false, message: err.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="p-6">Loading...</p>;
    if (!formData) return <p className="p-6 text-red-500">Course not found.</p>;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Edit Course</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Basic Fields */}
                {[
                    "courseID", "title", "featured_image", "featured_video", "bannerImg", "duration",
                    "enrollments", "level", "total_lessons", "total_quiz", "category", "subcategory",
                    "base_price", "discount_percentage", "rating", "credits", "coursePeriod"
                ].map((field) => (
                    <div key={field}>
                        <label className="block font-medium capitalize mb-1">{field}</label>
                        <input
                            type="text"
                            name={field}
                            value={formData[field] || ""}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                    </div>
                ))}

                {/* Overview */}
                <div>
                    <label className="block font-medium mb-1">Overview</label>
                    <textarea
                        name="overview"
                        value={formData.overview || ""}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                        rows="3"
                    />
                </div>

                {/* What Will I Learn */}
                <div>
                    <label className="block font-medium mb-2">What Will I Learn</label>
                    {formData.whatWillILearn.map((val, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={val}
                                onChange={(e) => handleArrayChange("whatWillILearn", i, e.target.value)}
                                className="w-full border px-3 py-2 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayField("whatWillILearn", i)}
                                className="bg-red-500 text-white px-3 rounded-lg"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayField("whatWillILearn")}
                        className="bg-blue-500 text-white px-4 py-1 rounded-lg"
                    >
                        + Add
                    </button>
                </div>

                {/* Curriculum */}
                <div>
                    <label className="block font-medium mb-2">Curriculum</label>
                    {formData.curriculum.map((module, mIndex) => (
                        <div key={mIndex} className="border p-4 mb-4 rounded-lg">
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Module Name"
                                    value={module.module_name}
                                    onChange={(e) => handleCurriculumChange(mIndex, "module_name", e.target.value)}
                                    className="w-1/2 border px-3 py-2 rounded-lg"
                                />
                                <input
                                    type="number"
                                    placeholder="Module Time"
                                    value={module.module_time}
                                    onChange={(e) => handleCurriculumChange(mIndex, "module_time", e.target.value)}
                                    className="w-1/2 border px-3 py-2 rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeModule(mIndex)}
                                    className="bg-red-500 text-white px-3 rounded-lg"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Lessons */}
                            <div className="ml-4">
                                {module.lessons.map((lesson, lIndex) => (
                                    <div key={lIndex} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            placeholder="Lesson Name"
                                            value={lesson.lesson_name}
                                            onChange={(e) => handleLessonChange(mIndex, lIndex, "lesson_name", e.target.value)}
                                            className="w-1/3 border px-3 py-2 rounded-lg"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Duration"
                                            value={lesson.duration}
                                            onChange={(e) => handleLessonChange(mIndex, lIndex, "duration", e.target.value)}
                                            className="w-1/3 border px-3 py-2 rounded-lg"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Video URL"
                                            value={lesson.video}
                                            onChange={(e) => handleLessonChange(mIndex, lIndex, "video", e.target.value)}
                                            className="w-1/3 border px-3 py-2 rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeLesson(mIndex, lIndex)}
                                            className="bg-red-500 text-white px-3 rounded-lg"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addLesson(mIndex)}
                                    className="bg-blue-500 text-white px-4 py-1 rounded-lg"
                                >
                                    + Add Lesson
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addModule}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        + Add Module
                    </button>
                </div>

                {/* FAQs */}
                <div>
                    <label className="block font-medium mb-2">FAQs</label>
                    {formData.faqs.map((faq, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Question"
                                value={faq.question}
                                onChange={(e) => handleFaqChange(i, "question", e.target.value)}
                                className="w-1/2 border px-3 py-2 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Answer"
                                value={faq.answer}
                                onChange={(e) => handleFaqChange(i, "answer", e.target.value)}
                                className="w-1/2 border px-3 py-2 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeFaq(i)}
                                className="bg-red-500 text-white px-3 rounded-lg"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addFaq}
                        className="bg-blue-500 text-white px-4 py-1 rounded-lg"
                    >
                        + Add FAQ
                    </button>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>

            {response && (
                <div
                    className={`mt-4 p-3 rounded-lg ${response.success ? "bg-green-100" : "bg-red-100"}`}
                >
                    <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
