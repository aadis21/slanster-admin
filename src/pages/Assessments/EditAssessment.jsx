import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditAssessment = () => {
    const [assessment, setAssessment] = useState(null);
    const { assessmentId } = useParams();

    useEffect(() => {
        // Fetch existing assessment
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No token found. Please log in.");
            return;
        }
        axios
            .get(`https://api.slanster.com/api/v1/assessments/${assessmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setAssessment(res.data.data))
            .catch((err) => console.error(err));
    }, [assessmentId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAssessment((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleModuleChange = (index, field, value) => {
        const updatedModules = [...assessment.Assessmentmodules];
        updatedModules[index].module[field] = value;
        setAssessment((prev) => ({
            ...prev,
            Assessmentmodules: updatedModules,
        }));
    };

    const addModule = () => {
        setAssessment((prev) => ({
            ...prev,
            Assessmentmodules: [
                ...prev.Assessmentmodules,
                { module: { moduleName: "", timelimit: 0, noOfQuestions: 0 } },
            ],
        }));
    };

    const removeModule = (index) => {
        const updatedModules = [...assessment.Assessmentmodules];
        updatedModules.splice(index, 1);
        setAssessment((prev) => ({
            ...prev,
            Assessmentmodules: updatedModules,
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
            const res = await axios.put(
                `https://api.slanster.com/api/v1/assessments/admin/${assessmentId}`,
                assessment,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Assessment updated successfully!");
            console.log(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to update assessment");
        }
    };

    if (!assessment) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div>
                <label>Assessment Name:</label>
                <input
                    type="text"
                    name="assessmentName"
                    value={assessment.assessmentName}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            <div>
                <label>Description:</label>
                <textarea
                    name="assessmentDesc"
                    value={assessment.assessmentDesc}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            <div>
                <label>Max Marks:</label>
                <input
                    type="number"
                    name="maxMarks"
                    value={assessment.maxMarks}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            <div>
                <label>Time Limit (minutes):</label>
                <input
                    type="number"
                    name="timelimit"
                    value={assessment.timelimit}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            <div>
                <label>Shuffle Questions:</label>
                <input
                    type="checkbox"
                    name="shuffleQuestions"
                    checked={assessment.shuffleQuestions}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Negative Marking:</label>
                <input
                    type="checkbox"
                    name="negativeMarking"
                    checked={assessment.negativeMarking}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Passing Percentage:</label>
                <input
                    type="number"
                    name="passingPercentage"
                    value={assessment.passingPercentage}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            <div>
                <label>Is Protected:</label>
                <input
                    type="checkbox"
                    name="isProtected"
                    checked={assessment.isProtected}
                    onChange={handleChange}
                />
            </div>

            {/* Modules */}
            <div>
                <h3 className="font-bold">Modules:</h3>
                {assessment?.Assessmentmodules?.map((m, index) => (
                    <div key={index} className="border p-2 mb-2">
                        <input
                            type="text"
                            placeholder="Module Name"
                            value={m.module.moduleName}
                            onChange={(e) =>
                                handleModuleChange(index, "moduleName", e.target.value)
                            }
                            className="border p-1 w-full mb-1"
                        />
                        <input
                            type="number"
                            placeholder="Time Limit"
                            value={m.module.timelimit || ""}
                            onChange={(e) =>
                                handleModuleChange(index, "timelimit", e.target.value)
                            }
                            className="border p-1 w-full mb-1"
                        />
                        <input
                            type="number"
                            placeholder="Number of Questions"
                            value={m.module.noOfQuestions || ""}
                            onChange={(e) =>
                                handleModuleChange(index, "noOfQuestions", e.target.value)
                            }
                            className="border p-1 w-full mb-1"
                        />
                        <button
                            type="button"
                            onClick={() => removeModule(index)}
                            className="bg-red-500 text-white px-2 py-1 mt-1"
                        >
                            Remove Module
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addModule}
                    className="bg-green-500 text-white px-2 py-1"
                >
                    Add Module
                </button>
            </div>

            {/* Proctoring (shown only if isProtected) */}
            {assessment.isProtected && (
                <div>
                    <h3 className="font-bold">Proctoring Options:</h3>
                    {Object.keys(assessment.ProctoringFor).map((key) => (
                        <div key={key} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={assessment.ProctoringFor[key].inUse}
                                onChange={(e) => {
                                    const updated = { ...assessment.ProctoringFor };
                                    updated[key].inUse = e.target.checked;
                                    setAssessment((prev) => ({ ...prev, ProctoringFor: updated }));
                                }}
                            />
                            <span>{key}</span>
                            <input
                                type="number"
                                min={0}
                                value={assessment.ProctoringFor[key].maxViolations}
                                onChange={(e) => {
                                    const updated = { ...assessment.ProctoringFor };
                                    updated[key].maxViolations = parseInt(e.target.value, 10);
                                    setAssessment((prev) => ({ ...prev, ProctoringFor: updated }));
                                }}
                                className="border p-1 w-20"
                            />
                        </div>
                    ))}
                </div>
            )}

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 mt-4"
            >
                Update Assessment
            </button>
        </form>
    );
};

export default EditAssessment;
