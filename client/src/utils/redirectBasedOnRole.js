export const redirectBasedOnRole = (role, navigate) => {
  if (role === 'admin') {
    navigate('/admin/dashboard');
  } else if (role === 'instructor') {
    navigate('/instructor/dashboard');
  } else {
    navigate('/student/dashboard');
  }
};
