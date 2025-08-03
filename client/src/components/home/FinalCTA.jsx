import { motion } from 'framer-motion';

const FinalCTA = () => {
  return (
    <section className="bg-blue-600 text-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Start your journey with Edify-Pro today
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-lg mb-8 text-blue-100"
        >
          Whether you're a student eager to learn or an instructor ready to teach, Edify-Pro provides all the tools you need.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center gap-4"
        >
          <a
            href="/register"
            className="bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-blue-100 transition"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="border border-white text-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-blue-600 transition"
          >
            Login
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
