import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './pages/student/StudentDashboardLayout.jsx.jsx';
import AdminDashboard from './pages/admin/AdminDashboard';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import MyCourses from './pages/instructor/MyCourses';
import CreateCourse from './pages/instructor/CreateCourse';
import DashboardLayout from './pages/instructor/DashboardLayout.jsx';
import Overview from './pages/instructor/Overview.jsx.jsx';
import LessonManagement from './pages/instructor/LessonManagement.jsx';
import EnrolledStudents from './pages/instructor/EnrolledStudents.jsx';
import StudentOverview from './pages/student/StudentOverview.jsx';
import ProgressTracker from './pages/student/ProgressTracker.jsx';
import StudentCourses from './pages/student/StudentCourses.jsx';
import StudentCourseDetail from './pages/student/StudentCourseDetail.jsx';
import MyEnrolledCourses from './pages/student/MyEnrolledCourses.jsx';
import StudentLessonView from './pages/student/StudentLessonView.jsx';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentOverview />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="courses/:id" element={<StudentCourseDetail />} />
          <Route path="my-courses" element={<MyEnrolledCourses />} />
          <Route path="progress" element={<ProgressTracker />} />
          <Route path="lessons/:id" element={<StudentLessonView />} />
        </Route>

        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="course/:courseId/lessons" element={<LessonManagement />} />
          <Route path="enrollments/:courseId" element={<EnrolledStudents />} />

        </Route>

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
};

export default App;
