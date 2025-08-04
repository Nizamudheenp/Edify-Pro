const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">Edify-Pro</h2>
          <p className="text-sm text-gray-400">
            A modern learning management platform for both students and instructors. Learn. Teach. Grow.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Explore</h3>
          <ul className="space-y-2">
            <li><a href="/courses" className="hover:text-white">Courses</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
            <li><a href="/faq" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Connect</h3>
          <ul className="space-y-2">
            <li><a href="mailto:support@edifypro.com" className="hover:text-white">support@edifypro.com</a></li>
            <li><a href="#" className="hover:text-white">Twitter</a></li>
            <li><a href="#" className="hover:text-white">LinkedIn</a></li>
            <li><a href="#" className="hover:text-white">GitHub</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Edify-Pro. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
