import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { manualProjects } from "../../content/profile";
import { useProjects } from "../../hooks/useProjects";

const normalizeUrl = (url) => {
  if (!url?.trim()) return "";
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const tagName = (tag) => {
  if (typeof tag === "string") return tag.trim();
  if (tag && typeof tag.name === "string") return tag.name.trim();
  return "";
};

const ProjectCard = ({ project }) => {
  const website = normalizeUrl(project.website_link);
  const code = normalizeUrl(project.source_code_link);
  const href = website || code;
  const action = website ? "View project" : code ? "View code" : "";
  const tags = Array.isArray(project.tags) ? project.tags.map(tagName).filter(Boolean) : [];

  return (
    <article className='group border-t border-line pt-8'>
      <div className='overflow-hidden bg-[#ebe6de]'>
        {project.image ? (
          href ? (
            <a href={href} target='_blank' rel='noreferrer' className='block' aria-label={`${project.name} screenshot`}>
              <img
                src={project.image}
                alt={`${project.name} screenshot`}
                className='aspect-[16/10] w-full object-cover transition duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100'
              />
            </a>
          ) : (
            <img
              src={project.image}
              alt={`${project.name} screenshot`}
              className='aspect-[16/10] w-full object-cover'
            />
          )
        ) : (
          <div className='flex aspect-[16/10] items-center justify-center text-sm text-mist'>No image</div>
        )}
      </div>

      <div className='mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='max-w-2xl'>
          <h3 className='font-display text-2xl font-medium tracking-[-0.02em] text-ink sm:text-3xl'>
            {project.name}
          </h3>
          {project.description && (
            <p className='mt-3 text-[0.98rem] leading-7 text-mist'>{project.description}</p>
          )}
          {tags.length > 0 && (
            <ul className='mt-4 flex flex-wrap gap-2'>
              {tags.map((tag) => (
                <li key={tag} className='border border-line px-2 py-1 text-[0.75rem] uppercase tracking-[0.08em] text-mist'>
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='flex shrink-0 flex-col items-start gap-2 sm:items-end'>
          {href && (
            <a href={href} target='_blank' rel='noreferrer' className='text-[0.95rem] text-ink underline decoration-line underline-offset-4 hover:decoration-ink'>
              {action}
            </a>
          )}
          {website && code && (
            <a href={code} target='_blank' rel='noreferrer' className='text-[0.85rem] text-mist underline decoration-line underline-offset-4 hover:text-ink'>
              View code
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

const ManualProjectCard = ({ project }) => (
  <article className='border-t border-line pt-8'>
    <div className='overflow-hidden bg-black'>
      <img
        src={project.image}
        alt={project.name}
        className='aspect-[16/10] w-full bg-black object-contain'
      />
    </div>

    <div className='mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
      <div className='max-w-2xl'>
        <p className='text-[0.75rem] font-medium uppercase tracking-[0.14em] text-mist'>{project.category}</p>
        <h3 className='mt-3 font-display text-2xl font-medium tracking-[-0.02em] text-ink sm:text-3xl'>{project.name}</h3>
        {project.summary && <p className='mt-3 text-[1.02rem] leading-7 text-ink'>{project.summary}</p>}
        <p className='mt-3 text-[0.98rem] leading-7 text-mist'>{project.description}</p>
        {project.points?.length > 0 && (
          <ul className='mt-4 space-y-1.5 text-[0.98rem] leading-7 text-mist'>
            {project.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}
        {project.note && <p className='mt-4 text-[0.98rem] leading-7 text-mist'>{project.note}</p>}
      </div>
      <p className='shrink-0 text-[0.95rem] text-ink'>
        {project.status}
        <span className='mt-1 block text-[0.85rem] text-mist'>{project.statusDetail}</span>
      </p>
    </div>
  </article>
);

const SelectedWork = () => {
  const { projects, loading, error } = useProjects();
  const { user, logout } = useAuth();

  return (
    <section id='projects' className='scroll-mt-24 border-t border-line' aria-labelledby='projects-heading'>
      <div className='mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28'>
        <div className='flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'>
          <div className='max-w-2xl'>
            <p className='text-[0.78rem] font-medium uppercase tracking-[0.16em] text-accent'>Products</p>
            <h2 id='projects-heading' className='mt-3 font-display text-4xl font-medium tracking-[-0.03em] text-ink sm:text-5xl'>
              Selected products
            </h2>
            <p className='mt-4 max-w-xl text-[1.02rem] leading-7 text-mist'>
              Software I have built. Published projects are added here from the live list.
            </p>
          </div>
          {user && (
            <div className='flex flex-wrap gap-4 text-[0.9rem]'>
              <Link to='/add-project' className='text-ink underline underline-offset-4'>
                Add project
              </Link>
              <button type='button' onClick={logout} className='text-mist underline underline-offset-4 hover:text-ink'>
                Log out
              </button>
            </div>
          )}
        </div>

        <div className='mt-12 grid gap-12 md:grid-cols-2 md:gap-10'>
          {manualProjects.map((project) => (
            <ManualProjectCard key={project.name} project={project} />
          ))}
          {!loading && !error && projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {loading && <p className='mt-12 text-mist'>Loading projects...</p>}
        {error && (
          <p className='mt-12 text-[#8d2b2b]' role='alert'>
            {error}
          </p>
        )}
      </div>
    </section>
  );
};

export default SelectedWork;
