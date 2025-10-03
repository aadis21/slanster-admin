import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddMentor from "./pages/Mentor/AddMentor";
import Login from "./pages/Login/Login";
import ProtectedLayout from "./pages/ProtectedLayout/ProtectedLayout";
import JobForm from "./pages/Jobs/JobForm";
import CreateCourse from "./pages/Courses/CreateCourse";
import CoursesList from "./pages/Courses/CoursesList";
import EditCourse from "./pages/Courses/EditCourse";
import JobList from "./pages/Jobs/JobList";
import EditJob from "./pages/Jobs/EditJob";
import MentorList from "./pages/Mentor/MentorList";
import AssessmentsList from "./pages/Assessments/AssessmentsList";
import CreateAssessment from "./pages/Assessments/CreateAssessment";
import EditAssessment from "./pages/Assessments/EditAssessment";
import AssignedList from "./pages/Assessments/AssignedList";
import AssessmentReport from "./pages/Assessments/AssessmentReport";
import Layout from "./Layout";
import DashboardHeader from "./pages/Dashboard/DashboardHeader";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route element={<Layout />}>
            <Route path="/*" element={<DashboardHeader />} />
            
            <Route path="/add-mentor" element={<AddMentor />} />
            <Route path="/list-mentor" element={<MentorList />} />
            <Route path="/list-job" element={<JobList />} />
            <Route path="/add-job" element={<JobForm />} />
            <Route path="/edit-job/:jobId" element={<EditJob />} />
            <Route path="/list-courses" element={<CoursesList />} />
            <Route path="/add-course" element={<CreateCourse />} />
            <Route path="/edit-course/:id" element={<EditCourse />} />
            <Route path="/list-assessment" element={<AssessmentsList />} />
            <Route path="/create-assessments" element={<CreateAssessment />} />
            <Route
              path="/assessments/edit/:assessmentId"
              element={<EditAssessment />}
            />
            <Route
              path="/assessments/assigned/:assessmentId"
              element={<AssignedList />}
            />
            <Route
              path="/assessments/user-report/:assessmentId/:userId"
              element={<AssessmentReport />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
