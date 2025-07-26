const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
        Welcome to <span className="text-blue-600">Edify-Pro</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
        Your modern platform to learn and teach efficiently. Whether you’re a student or an instructor, get started today!
      </p>
      <div className="flex gap-4">
        <a href="/register" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Get Started</a>
        <a href="/login" className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50">Login</a>
      </div>
    </div>
  );
};

export default Home;
