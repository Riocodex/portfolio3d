import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/site/Home";
import { AuthProvider } from "./context/AuthContext";
import AddProject from "./pages/AddProject";
import AdminLogin from "./pages/AdminLogin";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />
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
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
