import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaUserTie,
  FaChalkboardTeacher,
  FaBook,
  FaBriefcase,
  FaClipboardList,
  FaPlusCircle,
} from "react-icons/fa";
import Header from "./Header";
// import Header from "./pages/componensts/header/Header";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="text-2xl font-bold p-6 border-b border-gray-700">
          Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {/* Mentor */}
          <NavLink
            to="/add-mentor"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <FaUserTie /> Add Mentor
          </NavLink>
          <NavLink
            to="/list-mentor"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <FaChalkboardTeacher /> Mentor List
          </NavLink>

          {/* Jobs */}
          <NavLink
            to="/add-job"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <FaPlusCircle /> Add Job
          </NavLink>
          <NavLink
            to="/list-job"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <FaBriefcase /> Job List
          </NavLink>

          {/* Courses */}
          <NavLink
            to="/add-course"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <FaPlusCircle /> Add Course
          </NavLink>
          <NavLink
            to="/list-courses"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <FaBook /> Course List
          </NavLink>

          {/* Assessments */}
          <NavLink
            to="/create-assessments"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <FaPlusCircle /> Create Assessment
          </NavLink>
          <NavLink
            to="/list-assessment"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <FaClipboardList /> Assessment List
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
            <Header />
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
