import { Link } from 'react-router-dom';
import { BookOpenText, PlusSquare, UsersRound } from 'lucide-react';
import { motion } from 'framer-motion';

const InstructorOverview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome Back, Instructor! 🎯
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Manage your courses, lessons, students, and assignments from one place.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <Link
            to="/instructor/dashboard/courses"
            className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition border border-gray-100"
          >
            <BookOpenText className="text-indigo-600 mb-3 h-8 w-8" />
            <h3 className="text-xl font-semibold mb-1">My Courses</h3>
            <p className="text-gray-600 text-sm">
              View and manage all the courses you've created.
            </p>
          </Link>

          <Link
            to="/instructor/dashboard/create-course"
            className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition border border-gray-100"
          >
            <PlusSquare className="text-green-600 mb-3 h-8 w-8" />
            <h3 className="text-xl font-semibold mb-1">Create Course</h3>
            <p className="text-gray-600 text-sm">
              Start a new course and structure its content and assessments.
            </p>
          </Link>

          <Link
            to="/instructor/dashboard/courses" 
            className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition border border-gray-100"
          >
            <UsersRound className="text-blue-600 mb-3 h-8 w-8" />
            <h3 className="text-xl font-semibold mb-1">Student Enrollments</h3>
            <p className="text-gray-600 text-sm">
              View who’s enrolled in your courses and track engagement.
            </p>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default InstructorOverview;
