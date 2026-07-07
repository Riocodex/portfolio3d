import React from "react";
import { Link } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";
import { fadeIn, textVariant } from "../utils/motion";

const normalizeUrl = (url) => {
  if (!url?.trim()) return "";
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const ProjectCard = ({
  index,
  name,
  description,
  tags = [],
  image,
  source_code_link,
  website_link,
}) => {
  const projectLink = normalizeUrl(website_link) || normalizeUrl(source_code_link);
  const githubLink = normalizeUrl(source_code_link);
  const safeTags = Array.isArray(tags) ? tags : [];

  const openProject = () => {
    if (projectLink) {
      window.open(projectLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      initial='hidden'
      animate='show'
    >
      <div
        className={projectLink ? "cursor-pointer" : ""}
        onClick={openProject}
        onKeyDown={(e) => {
          if (projectLink && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            openProject();
          }
        }}
        role={projectLink ? "link" : undefined}
        tabIndex={projectLink ? 0 : undefined}
      >
        <Tilt
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className='bg-tertiary p-5 rounded-2xl w-full flex flex-col'
        >
          <div className='relative w-full h-[230px] flex-shrink-0'>
            <img
              src={image}
              alt='project_image'
              className='w-full h-full object-cover rounded-2xl'
            />

            {githubLink && (
              <div className='absolute inset-0 flex justify-end m-3 card-img_hover pointer-events-none'>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(githubLink, "_blank", "noopener,noreferrer");
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  role='button'
                  tabIndex={0}
                  className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer pointer-events-auto'
                >
                  <img
                    src={github}
                    alt='source code'
                    className='w-1/2 h-1/2 object-contain'
                  />
                </div>
              </div>
            )}
          </div>

          <div className='mt-5 flex flex-col flex-1'>
            <h3 className='text-white font-bold text-[24px] leading-[32px]'>
              {name}
            </h3>
            <p className='mt-2 text-secondary text-[14px] leading-[22px]'>
              {description}
            </p>
          </div>

          {safeTags.length > 0 && (
            <div className='mt-4 flex flex-wrap gap-2'>
            {safeTags.map((tag) => (
              <p
                key={`${name}-${tag?.name ?? tag}`}
                className={`text-[14px] ${tag?.color ?? ""}`}
              >
                #{tag?.name ?? tag}
              </p>
            ))}
            </div>
          )}
        </Tilt>
      </div>
    </motion.div>
  );
};

const Works = () => {
  const { projects, loading, error } = useProjects();
  const { user, logout } = useAuth();

  return (
    <>
      <motion.div variants={textVariant()}>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className={`${styles.sectionSubText} `}>My work</p>
            <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
          </div>
          {user && (
            <div className='flex flex-wrap items-center gap-3'>
              <Link
                to='/add-project'
                className='bg-[#915EFF] py-3 px-6 rounded-xl text-white font-bold text-[14px] hover:opacity-90 transition-opacity'
              >
                + Add Project
              </Link>
              <button
                type='button'
                onClick={logout}
                className='bg-tertiary py-3 px-6 rounded-xl text-white font-bold text-[14px] hover:opacity-90 transition-opacity'
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>
      </div>

      {loading && (
        <p className='mt-20 text-secondary text-[17px]'>Loading projects...</p>
      )}

      {error && (
        <p className='mt-20 text-red-400 text-[17px]'>{error}</p>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className='mt-20 text-secondary text-[17px]'>
          No projects yet.
        </p>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className='mt-20 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7'>
          {projects.map((project, index) => (
            <ProjectCard key={project.id ?? `project-${index}`} index={index} {...project} />
          ))}
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Works, "projects");
