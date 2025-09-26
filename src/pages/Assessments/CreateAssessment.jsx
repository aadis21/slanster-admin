import React, { useState } from "react";

const CreateAssessmentForm = () => {
    const [formData, setFormData] = useState({
        assessmentName: "",
        assessmentDesc: "",
        maxMarks: "",
        timelimit: "",
        shuffleQuestions: false,
        negativeMarking: false,
        passingPercentage: "",
        isVisible: true,
        startDate: "", // added
        endDate: "",   // added
        isProtected: false,
        ProctoringFor: {
            mic: { inUse: false, maxViolations: 0 },
            invisiblecam: { inUse: false, maxViolations: 0 },
            webcam: { inUse: false, maxViolations: 0 },
            TabSwitch: { inUse: false, maxViolations: 0 },
            multiplePersonInFrame: { inUse: false, maxViolations: 0 },
            PhoneinFrame: { inUse: false, maxViolations: 0 },
            ControlKeyPressed: { inUse: false, maxViolations: 0 },
        },
        Assessmentmodules: [
            {
                module_id: "",
                moduleName: "",
                timelimit: "",
                noOfQuestions: "",
            },
        ],
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleProctoringChange = (field, key, value) => {
        setFormData((prev) => ({
            ...prev,
            ProctoringFor: {
                ...prev.ProctoringFor,
                [field]: {
                    ...prev.ProctoringFor[field],
                    [key]: value,
                },
            },
        }));
    };

    const handleModuleChange = (index, field, value) => {
        const updatedModules = [...formData.Assessmentmodules];
        updatedModules[index][field] = value;
        setFormData((prev) => ({
            ...prev,
            Assessmentmodules: updatedModules,
        }));
    };

    const addModule = () => {
        setFormData((prev) => ({
            ...prev,
            Assessmentmodules: [
                ...prev.Assessmentmodules,
                { module_id: "", moduleName: "", timelimit: "", noOfQuestions: "" },
            ],
        }));
    };

    const removeModule = (index) => {
        setFormData((prev) => ({
            ...prev,
            Assessmentmodules: prev.Assessmentmodules.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("No token found. Please log in.");
                return;
            }
            const res = await fetch("https://api.slanster.com/api/v1/assessment/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            console.log("✅ Assessment Created:", data);
            alert("Assessment Created Successfully!");
        } catch (error) {
            console.error("❌ Error:", error);
            alert("Error creating assessment.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Create Assessment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Fields */}
                <input
                    type="text"
                    name="assessmentName"
                    placeholder="Assessment Name"
                    value={formData.assessmentName}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />
                <textarea
                    name="assessmentDesc"
                    placeholder="Assessment Description"
                    value={formData.assessmentDesc}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />
                <input
                    type="number"
                    name="maxMarks"
                    placeholder="Max Marks"
                    value={formData.maxMarks}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />
                <input
                    type="number"
                    name="timelimit"
                    placeholder="Time Limit (minutes)"
                    value={formData.timelimit}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />
                <input
                    type="number"
                    name="passingPercentage"
                    placeholder="Passing Percentage"
                    value={formData.passingPercentage}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />

                {/* Date Fields */}
                <label>
                    Start Date:
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="border p-2 w-full rounded mt-1"
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="border p-2 w-full rounded mt-1"
                    />
                </label>

                {/* Checkboxes */}
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="shuffleQuestions"
                        checked={formData.shuffleQuestions}
                        onChange={handleChange}
                    />
                    <span>Shuffle Questions</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="negativeMarking"
                        checked={formData.negativeMarking}
                        onChange={handleChange}
                    />
                    <span>Negative Marking</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isVisible"
                        checked={formData.isVisible}
                        onChange={handleChange}
                    />
                    <span>Open for users</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isProtected"
                        checked={formData.isProtected}
                        onChange={handleChange}
                    />
                    <span>Protected</span>
                </label>

                {/* Proctoring Settings (only if protected) */}
                {formData.isProtected && (
                    <div className="border p-4 rounded bg-gray-50">
                        <h3 className="font-semibold mb-2">Proctoring Settings</h3>
                        {Object.keys(formData.ProctoringFor).map((key) => (
                            <div key={key} className="flex items-center space-x-2 mb-2">
                                <label className="capitalize">{key}</label>
                                <input
                                    type="checkbox"
                                    checked={formData.ProctoringFor[key].inUse}
                                    onChange={(e) =>
                                        handleProctoringChange(key, "inUse", e.target.checked)
                                    }
                                />
                                <input
                                    type="number"
                                    placeholder="Max Violations"
                                    value={formData.ProctoringFor[key].maxViolations}
                                    onChange={(e) =>
                                        handleProctoringChange(
                                            key,
                                            "maxViolations",
                                            e.target.value
                                        )
                                    }
                                    className="border p-1 rounded w-24"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Module Settings */}
                <div className="border p-4 rounded bg-gray-50">
                    <h3 className="font-semibold mb-2">Assessment Modules</h3>
                    {formData.Assessmentmodules.map((module, index) => (
                        <div key={index} className="grid grid-cols-5 gap-2 mb-2 items-center">
                            <input
                                type="number"
                                placeholder="Module ID"
                                value={module.module_id}
                                onChange={(e) =>
                                    handleModuleChange(index, "module_id", e.target.value)
                                }
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Module Name"
                                value={module.moduleName}
                                onChange={(e) =>
                                    handleModuleChange(index, "moduleName", e.target.value)
                                }
                                className="border p-2 rounded"
                            />
                            <input
                                type="number"
                                placeholder="Time Limit"
                                value={module.timelimit}
                                onChange={(e) =>
                                    handleModuleChange(index, "timelimit", e.target.value)
                                }
                                className="border p-2 rounded"
                            />
                            <input
                                type="number"
                                placeholder="No. of Questions"
                                value={module.noOfQuestions}
                                onChange={(e) =>
                                    handleModuleChange(index, "noOfQuestions", e.target.value)
                                }
                                className="border p-2 rounded"
                            />
                            <button
                                type="button"
                                onClick={() => removeModule(index)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addModule}
                        className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                    >
                        + Add Module
                    </button>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Create Assessment
                </button>
            </form>
        </div>
    );
};

export default CreateAssessmentForm;
