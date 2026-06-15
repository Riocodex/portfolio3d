import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import { auth } from "../firebase/config";
import { styles } from "../styles";
import { slideIn } from "../utils/motion";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/add-project");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative z-0 bg-primary min-h-screen'>
      <Navbar />

      <div className={`${styles.padding} max-w-md mx-auto pt-28 pb-16`}>
        <motion.div
          variants={slideIn("up", "tween", 0.2, 1)}
          initial='hidden'
          animate='show'
          className='bg-black-100 p-8 rounded-2xl'
        >
          <p className={styles.sectionSubText}>Admin</p>
          <h3 className={`${styles.sectionHeadText} text-[40px]`}>Login.</h3>

          <form onSubmit={handleSubmit} className='mt-10 flex flex-col gap-6'>
            {error && (
              <p className='text-red-400 text-[14px]'>{error}</p>
            )}

            <label className='flex flex-col'>
              <span className='text-white font-medium mb-4'>Email</span>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='admin@example.com'
                required
                className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
              />
            </label>

            <label className='flex flex-col'>
              <span className='text-white font-medium mb-4'>Password</span>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Your password'
                required
                className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
              />
            </label>

            <button
              type='submit'
              disabled={loading}
              className='bg-[#915EFF] py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary disabled:opacity-50'
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <Link to='/' className='text-secondary text-[14px] hover:text-white'>
              ← Back to portfolio
            </Link>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
