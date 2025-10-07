import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AssignedList = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate(); // for redirect
  const [students, setStudents] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `https://api.slanster.com/api/v1/assessments/admin/result/${assessmentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const studentData = await res.json();
        console.log("Fetched student data:", studentData);

        if (studentData.success && studentData.results.length > 0) {
          setStudents(studentData.results);
        } else {
          setModalMessage(studentData.message || "No students found");
          setShowModal(true);
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setModalMessage("Something went wrong while fetching students.");
        setShowModal(true);
      }
    };

    fetchStudents();
  }, [assessmentId]);

  const getStatus = (student) => {
    if (student.isAssessmentCompleted) return "Completed";
    if (student.isAssessmentSuspended) return "Suspended";
    return "Pending";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4">Students List</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
          onClick={() => alert("Add Student functionality to be implemented")}
        >
          Add Student
        </button>
      </div>

      {students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Score</th>
                <th className="py-2 px-4 border-b">Remarks</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.userId} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{student.email}</td>
                  <td className="py-2 px-4 border-b">{getStatus(student)}</td>
                  <td className="py-2 px-4 border-b">{student.score ?? "-"}</td>
                  <td className="py-2 px-4 border-b">
                    {student.remarks || "-"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() =>
                        (window.location.href = `/assessments/user-report/${assessmentId}/${student.userId}`)
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 text-center">
            <h2 className="text-lg font-semibold mb-4">Notice</h2>
            <p className="mb-6">{modalMessage}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate("/list-assessment")} // redirect on click
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedList;
