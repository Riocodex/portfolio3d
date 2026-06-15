import { BrowserRouter, Routes, Route } from "react-router-dom";

import { About, Contact, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas } from "./components";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AddProject from "./pages/AddProject";
import AdminLogin from "./pages/AdminLogin";

const Portfolio = () => (
  <>
    <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
      <Navbar />
      <Hero />
    </div>
    <About />
    <Tech />
    <Works />
    <Feedbacks />
    <div className='relative z-0'>
      <Contact />
      <StarsCanvas />
    </div>
  </>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className='relative z-0 bg-primary'>
          <Routes>
            <Route path='/' element={<Portfolio />} />
            <Route path='/admin/login' element={<AdminLogin />} />
            <Route
              path='/add-project'
              element={
                <ProtectedRoute>
                  <AddProject />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
