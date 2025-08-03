import { Lightbulb, Users, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Lightbulb className="w-8 h-8 text-blue-600" />,
    title: 'Interactive Learning',
    description: 'Engaging lessons with video, quizzes, and assignments to keep learners involved and active.',
  },
  {
    icon: <Users className="w-8 h-8 text-blue-600" />,
    title: 'Built for Everyone',
    description: 'Whether student or instructor, Edify-Pro adapts to your needs with dedicated dashboards.',
  },
  {
    icon: <ClipboardList className="w-8 h-8 text-blue-600" />,
    title: 'Smart Tracking',
    description: 'Monitor lesson completion, grades, and progress in real-time with visual insights.',
  },
];

const WhyEdify = () => {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Why Choose <span className="text-blue-600">Edify-Pro</span>?
        </h2>
        <p className="text-gray-600 mt-4 text-lg">
          A comprehensive platform designed to empower both educators and learners.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-xl shadow-md p-6 text-left hover:shadow-lg transition"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyEdify;
