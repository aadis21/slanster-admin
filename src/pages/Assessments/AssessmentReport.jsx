import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AssessmentReport = () => {
  const { assessmentId, userId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://api.slanster.com/api/v1/assessments/admin/result/${assessmentId}/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setReport(response.data); // same as before
      } catch (err) {
        console.error(err);
        setError("Failed to fetch assessment report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [assessmentId, userId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500" />
          <div className="mt-2 space-y-4 animate-pulse">
            <div className="h-7 w-56 rounded bg-slate-200" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-4">
                  <div className="h-4 w-28 rounded bg-slate-200 mb-3" />
                  <div className="h-6 w-16 rounded bg-slate-200" />
                </div>
              ))}
            </div>
            <div className="h-10 w-full rounded bg-slate-200" />
            <div className="h-64 w-full rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm">
          No report found
        </div>
      </div>
    );
  }

  // Purely presentational helpers (no API/logic changes)
  const skill = (txt) =>
    txt ? (
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
        {txt}
      </span>
    ) : null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
              Assessment Report
            </h1>
            {report?.remarks && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                {report.remarks}
              </span>
            )}
          </div>

          {/* Basic Info */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Candidate
              </div>
              <div className="mt-1 font-medium text-slate-800">{report.name}</div>
              <div className="text-xs text-slate-500">{report.email}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Score
              </div>
              <div className="mt-1 text-xl font-semibold text-emerald-700">
                {report.score}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Submission Time
              </div>
              <div className="mt-1 text-xl font-semibold text-slate-800">
                {report.assessmentSubmissionTime} mins
              </div>
            </div>
          </div>

          {/* Proctoring Violations */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Proctoring Violations
              </h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(report.proctoringViolations || {}).length === 0 ? (
                <span className="text-sm text-slate-500">No violations recorded</span>
              ) : (
                Object.entries(report.proctoringViolations).map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200"
                  >
                    {skill(key)}
                    <span className="text-amber-800">{String(value)}</span>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Questions Table */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <div className="bg-slate-50/70 px-4 py-3 text-sm font-medium text-slate-700">
              Responses
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr className="text-left">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Question
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Submitted Answer
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Correct Answer
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Result
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Marks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {report.questions.map((q) => (
                    <tr key={q.questionId} className="hover:bg-slate-50">
                      <td className="px-4 py-3 align-top text-sm text-slate-800">
                        {q.question}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-700">
                        {q.submittedAnswer !== undefined && q.submittedAnswer !== null
                          ? q.options[q.submittedAnswer]
                          : "-"}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-700">
                        {q.correctAnswer !== undefined && q.correctAnswer !== null
                          ? q.options[q.correctAnswer]
                          : "-"}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {q.isCorrect === true ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                            Correct
                          </span>
                        ) : q.isCorrect === false ? (
                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                            Incorrect
                          </span>
                        ) : (
                          <span className="text-sm text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {q.isCorrect ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                            +{q.maxMarks}
                          </span>
                        ) : q.isSubmitted ? (
                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                            -{q.negativeMarks}
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                            0
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer small note */}
          <div className="mt-4 text-xs text-slate-500">
            Tip: Hover rows for quick readability. All values are rendered as returned by the API.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentReport;
