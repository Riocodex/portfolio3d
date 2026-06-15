import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import { styles } from "../styles";
import { useProjects } from "../hooks/useProjects";
import { slideIn } from "../utils/motion";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const AddProject = () => {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    source_code_link: "",
    website_link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      alert("Image must be under 2MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.source_code_link || !imageFile) {
      alert("Please fill in name, description, GitHub link, and image.");
      return;
    }

    setLoading(true);

    try {
      await addProject({
        name: form.name,
        description: form.description,
        source_code_link: form.source_code_link,
        website_link: form.website_link,
        imageFile,
        tags: [],
      });

      navigate("/");
      window.location.hash = "projects";
    } catch (err) {
      console.error("Failed to add project:", err);
      const message =
        err?.code === "storage/unauthorized"
          ? "Storage permission denied. In Firebase Console → Storage → Rules, allow writes (see storage.rules in the project)."
          : err?.code === "permission-denied"
            ? "Firestore permission denied. In Firebase Console → Firestore → Rules, allow writes (see firestore.rules in the project)."
            : err?.message || "Unknown error";
      alert(`Failed to add project: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative z-0 bg-primary min-h-screen'>
      <Navbar />

      <div className={`${styles.padding} max-w-3xl mx-auto pt-28 pb-16`}>
        <motion.div
          variants={slideIn("up", "tween", 0.2, 1)}
          initial='hidden'
          animate='show'
          className='bg-black-100 p-8 rounded-2xl'
        >
          <p className={styles.sectionSubText}>Portfolio</p>
          <h3 className={styles.sectionHeadText}>Add Project.</h3>

          <form onSubmit={handleSubmit} className='mt-12 flex flex-col gap-8'>
            <label className='flex flex-col'>
              <span className='text-white font-medium mb-4'>Project Name</span>
              <input
                type='text'
                name='name'
                value={form.name}
                onChange={handleChange}
                placeholder='My awesome project'
                className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
              />
            </label>

            <label className='flex flex-col'>
              <span className='text-white font-medium mb-4'>Description</span>
              <textarea
                rows={5}
                name='description'
                value={form.description}
                onChange={handleChange}
                placeholder='Briefly describe what this project does...'
                className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
              />
            </label>

            <label className='flex flex-col'>
              <span className='text-white font-medium mb-4'>GitHub Link</span>
              <input
                type='url'
                name='source_code_link'
                value={form.source_code_link}
                onChange={handleChange}
                placeholder='https://github.com/username/repo'
                className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
              />
            </label>

            <label className='flex flex-col'>
              <span className='text-white font-medium mb-4'>Website Link</span>
              <input
                type='url'
                name='website_link'
                value={form.website_link}
                onChange={handleChange}
                placeholder='https://myproject.com (optional)'
                className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
              />
            </label>

            <label className='flex flex-col'>
              <span className='text-white font-medium mb-4'>Project Image</span>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='bg-tertiary py-4 px-6 text-secondary rounded-lg outline-none border-none font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#915EFF] file:text-white file:font-medium file:cursor-pointer'
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt='Preview'
                  className='mt-4 w-full h-[230px] object-cover rounded-2xl'
                />
              )}
            </label>

            <div className='flex flex-wrap gap-4'>
              <button
                type='submit'
                disabled={loading}
                className='bg-[#915EFF] py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary disabled:opacity-50'
              >
                {loading ? "Uploading..." : "Add Project"}
              </button>
              <Link
                to='/'
                className='bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold'
              >
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProject;
