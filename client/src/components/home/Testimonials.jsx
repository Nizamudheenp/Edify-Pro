import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Aisha Khan',
    role: 'Student',
    quote: 'Edify-Pro made learning so flexible. The lessons and quizzes helped me grasp concepts quickly!',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Rahul Verma',
    role: 'Instructor',
    quote: 'Managing my courses and tracking student progress has never been this seamless. Great platform!',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    name: 'Sneha Reddy',
    role: 'Student',
    quote: 'Assignments, video lessons, and real progress tracking — Edify-Pro helped me stay on track and motivated.',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          What Our Users Say
        </h2>
        <p className="text-gray-600 mt-4 text-lg">
          Real stories from students and instructors using Edify-Pro.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-lg transition"
          >
            <div className="flex items-center mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm italic">“{testimonial.quote}”</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
