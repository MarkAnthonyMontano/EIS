import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DepartmentRegistration from './components/DprtmntRegistration';
import DepartmentRoom from './components/DprtmntRoom';
import DepartmentProf from './components/DprtmntProf';
import SideBar from './components/Sidebar';
import ProgramTagging from './components/ProgramTagging';
import CourseManagement from './pages/CourseManagement';
import CoursePanel from './components/CoursePanel';
import ProgramPanel from './components/ProgramPanel';
import CurriculumPanel from './components/CurriculumPanel';
import SectionPanel from './components/SectionPanel';
import DepartmentSection from './components/DepartmentSection';
import ProtectedRoute from './components/ProtectedRoute';
import LoginProf from './components/LoginProf';
import RegisterProf from './components/RegisterProf';
import StudentProfileForm from './components/StudentProfile';
import YearLevelPanel from './components/YearLevelPanel';
import YearPanel from './components/YearPanel';
import YearUpdateForm from './components/YearUpdateForm';
import SemesterPanel from './components/SemesterPanel';
import SchoolYearPanel from './components/SchoolYearPanel';
import SchoolYearActivatorPanel from './components/SchoolYearActivatorPanel';
import RequirementsForm from './components/RequirementsForm';
import AdmissionDashboardPanel from './pages/AdmissionDashboard';
import SystemDashboardPanel from './pages/SystemDashboard';
import DepartmentManagement from './pages/DepartmentDashboard';
import StudentNumbering from './components/StudentNumbering';
import CourseTagging from './components/CourseTagging';
import ChangeGradingPeriod from './components/ChangeYearGradPer';
import AccountDashboard from './pages/AccountDashboard';
import ScheduleChecker from './components/ScheduleChecker';
import SearchStudentCOR from './components/SearchCertificateOfGrades';
import RoomRegistration from './components/RoomRegistration';
import ScheduleFilterer from './pages/SchedulePlottingFilter';

import FacultyDashboard from './pages/FacultyDashboard'; //For Professors & Faculty Members
import Dashboard from './pages/Dashboard'; // For SuperAdmin & Admin
import ApplicantDashboard from './pages/ApplicantDashboard';

import Unauthorized from './components/Unauthorized';
import RequirementUploader from './components/RequirementUploader';
import GradingSheet from './components/GradingSheet';
import FacultyWorkload from './components/FacultyWorkload';
import FacultyMasterList from './components/FacultyMasterlist';
import FacultyStudentClassList from './components/FacultyStudentClassList';
import FacultySchedule from './components/FacultySchedule';
import StudentDashboard from './pages/StudentDashboard';


import ExaminationProfile from './components/ExaminationProfile';
import Dashboard1 from './components/Dashboard1';
import Dashboard2 from './components/Dashboard2';
import Dashboard3 from './components/Dashboard3';
import Dashboard4 from './components/Dashboard4';
import Dashboard5 from './components/Dashboard5';

import PersonalDataForm from './components/PersonalDataForm';
import ECATApplicationForm from './components/ECATApplicationForm';
import AdmissionFormProcess from './components/AdmissionFormProcess';
import AdmissionServices from './components/AdmissionServices';
import OfficeOfTheRegistrar from './components/OfficeOfTheRegistrar';

import LoginEnrollment from './components/LoginEnrollment';
import ExamScheduler from './components/ExamScheduler';
import ExamScheduler2 from './components/ExamScheduler2';

import ClassList from './components/ClassList';
import ClassRoster from './components/ClassRoster';
import StudentList from './components/StudentList';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchAuthentication = () => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      setIsAuthenticated(true);
    }
  }

  useEffect(() => {
    fetchAuthentication();
  }, []);

  const theme = createTheme({
    typography: {
      fontFamily: "Poppins, sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        <header>
          <Navbar isAuthenticated={isAuthenticated} />
        </header>

        <div className="flex">
          {isAuthenticated && (
            <article className='min-w-[21rem] min-h-screen flex'>
              <SideBar setIsAuthenticated={setIsAuthenticated} style={{ height: '100%' }} />
            </article>
          )}

          <main className='w-full'>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/register_prof" element={<RegisterProf />} />
              <Route path="/" element={<LoginEnrollment setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/login_applicant" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/login_prof" element={<LoginProf setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/login" element={<LoginEnrollment setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['registrar']}><Dashboard /></ProtectedRoute>} />
              <Route path="/faculty_dashboard" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
              <Route path="/applicant_dashboard" element={<ProtectedRoute><ApplicantDashboard /></ProtectedRoute>} />
              <Route path="/room_registration" element={<ProtectedRoute><RoomRegistration /></ProtectedRoute>} />
              <Route path="/course_management" element={<ProtectedRoute><CourseManagement /></ProtectedRoute>} />
              <Route path="/program_tagging" element={<ProtectedRoute><ProgramTagging /></ProtectedRoute>} />
              <Route path="/course_panel" element={<ProtectedRoute><CoursePanel /></ProtectedRoute>} />
              <Route path="/program_panel" element={<ProtectedRoute><ProgramPanel /></ProtectedRoute>} />
              <Route path="/department_section_panel" element={<ProtectedRoute><DepartmentSection /></ProtectedRoute>} />
              <Route path="/curriculum_panel" element={<ProtectedRoute><CurriculumPanel /></ProtectedRoute>} />
              <Route path="/department_registration" element={<ProtectedRoute><DepartmentRegistration /></ProtectedRoute>} />
              <Route path="/section_panel" element={<ProtectedRoute><SectionPanel /></ProtectedRoute>} />
              <Route path="/professor_registration" element={<ProtectedRoute><DepartmentProf /></ProtectedRoute>} />
              <Route path="/student_profile_form" element={<ProtectedRoute><StudentProfileForm /></ProtectedRoute>} />
              <Route path="/year_level_panel" element={<ProtectedRoute><YearLevelPanel /></ProtectedRoute>} />
              <Route path="/year_panel" element={<ProtectedRoute><YearPanel /></ProtectedRoute>} />
              <Route path="/year_update_panel" element={<ProtectedRoute><YearUpdateForm /></ProtectedRoute>} />
              <Route path="/semester_panel" element={<ProtectedRoute><SemesterPanel /></ProtectedRoute>} />
              <Route path="/school_year_panel" element={<ProtectedRoute><SchoolYearPanel /></ProtectedRoute>} />
              <Route path="/school_year_activator_panel" element={<ProtectedRoute><SchoolYearActivatorPanel /></ProtectedRoute>} />

              <Route path="/requirements_form" element={<ProtectedRoute><RequirementsForm /></ProtectedRoute>} />
              <Route path="/admission_dashboard" element={<ProtectedRoute><AdmissionDashboardPanel /></ProtectedRoute>} />
              <Route path="/department_dashboard" element={<ProtectedRoute><DepartmentManagement /></ProtectedRoute>} />
              <Route path="/system_dashboard" element={<ProtectedRoute><SystemDashboardPanel /></ProtectedRoute>} />
              <Route path="/account_dashboard" element={<ProtectedRoute><AccountDashboard /></ProtectedRoute>} />
              <Route path="/student_numbering" element={<ProtectedRoute><StudentNumbering /></ProtectedRoute>} />
              <Route path="/course_tagging" element={<ProtectedRoute><CourseTagging /></ProtectedRoute>} />
              <Route path="/schedule_checker/:dprtmnt_id" element={<ProtectedRoute><ScheduleChecker /></ProtectedRoute>} />
              <Route path="/change_grade_period" element={<ProtectedRoute><ChangeGradingPeriod /></ProtectedRoute>} />
              <Route path="/department_room" element={<ProtectedRoute><DepartmentRoom /></ProtectedRoute>} />
              <Route path="/search_cor" element={<ProtectedRoute><SearchStudentCOR /></ProtectedRoute>} />
              <Route path="/select_college" element={<ProtectedRoute><ScheduleFilterer /></ProtectedRoute>} />
              <Route path="/examination_profile" element={<ProtectedRoute><ExaminationProfile /></ProtectedRoute>} />

              <Route path="/grading_sheet" element={<ProtectedRoute><GradingSheet /></ProtectedRoute>} />
              <Route path="/faculty_workload" element={<ProtectedRoute><FacultyWorkload /></ProtectedRoute>} />
              <Route path="/faculty_masterlist" element={<ProtectedRoute><FacultyMasterList /></ProtectedRoute>} />
              <Route path="/subject_masterlist/:subject_id/:department_section_id/:school_year_id" element={<ProtectedRoute><FacultyStudentClassList /></ProtectedRoute>} />
              <Route path="/faculty_schedule" element={<ProtectedRoute><FacultySchedule /></ProtectedRoute>} />

              <Route path="/student_dashboard" element={<ProtectedRoute allowedRoles={'student'}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route path="/dashboard1" element={<ProtectedRoute allowedRoles={['applicant', 'registrar']}><Dashboard1 /></ProtectedRoute>} />
              <Route path="/dashboard2" element={<ProtectedRoute allowedRoles={['applicant', 'registrar']}><Dashboard2 /></ProtectedRoute>} />
              <Route path="/dashboard3" element={<ProtectedRoute allowedRoles={['applicant', 'registrar']}><Dashboard3 /></ProtectedRoute>} />
              <Route path="/dashboard4" element={<ProtectedRoute allowedRoles={['applicant', 'registrar']}><Dashboard4 /></ProtectedRoute>} />
              <Route path="/dashboard5" element={<ProtectedRoute allowedRoles={['applicant', 'registrar']}><Dashboard5 /></ProtectedRoute>} />
              <Route path="/requirements_uploader" element={<ProtectedRoute allowedRoles={['applicant', 'registrar']}><RequirementUploader /></ProtectedRoute>} />

              <Route path="/personal_data_form" element={<ProtectedRoute allowedRoles={['applicant', 'registrar']}><PersonalDataForm /></ProtectedRoute>} />
              <Route path="/ecat_application_form" element={<ProtectedRoute allowedRoles={['applicant', 'registrar']}><ECATApplicationForm /></ProtectedRoute>} />
              <Route path="/admission_form_process" element={<ProtectedRoute allowedRoles={['applicant', 'registrar']}><AdmissionFormProcess /></ProtectedRoute>} />
              <Route path="/admission_services" element={<ProtectedRoute allowedRoles={['applicant', 'registrar']}><AdmissionServices /></ProtectedRoute>} />
              <Route path="/office_of_the_registrar" element={<ProtectedRoute allowedRoles={['applicant', 'registrar']}><OfficeOfTheRegistrar /></ProtectedRoute>} />


              <Route path="/class_roster" element={<ProtectedRoute allowedRoles={'registrar'}><ClassRoster /></ProtectedRoute>} />
              <Route path="/class_roster/class_list/ccs/:curriculum_id" element={<ProtectedRoute allowedRoles={'registrar'}><ClassList /></ProtectedRoute>} />
              <Route path="/class_list/ccs/:curriculum_id/:dstID" element={<ProtectedRoute allowedRoles={'registrar'}><StudentList /></ProtectedRoute>} />



              <Route path="/add_exam_schedule" element={<ProtectedRoute><ExamScheduler /></ProtectedRoute>} />
              <Route path="/assigning_schedule" element={<ProtectedRoute><ExamScheduler2 /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>

        <footer>
          <Footer />
        </footer>

      </Router>
    </ThemeProvider>
  )
}

export default App