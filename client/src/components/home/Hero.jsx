import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gray-50 py-24 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Empowering Education with <span className="text-blue-600">Edify-Pro</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          A modern platform built for seamless teaching and learning. Connect, create, and grow with ease.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
