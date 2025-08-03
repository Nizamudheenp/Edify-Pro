import { motion } from 'framer-motion';
import { BookOpenCheck, PlayCircle, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: <BookOpenCheck className="w-8 h-8 text-white" />,
    title: 'Enroll in Courses',
    description: 'Browse and enroll in a wide range of instructor-led courses tailored for your goals.',
  },
  {
    icon: <PlayCircle className="w-8 h-8 text-white" />,
    title: 'Learn Interactively',
    description: 'Watch lessons, complete assignments, and take quizzes at your own pace.',
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-white" />,
    title: 'Track Your Progress',
    description: 'View your lesson completion, quiz results, and assignment grades all in one place.',
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          How <span className="text-blue-600">Edify-Pro</span> Works
        </h2>
        <p className="text-gray-600 mt-4 text-lg">
          A simple 3-step process to accelerate your learning journey.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
