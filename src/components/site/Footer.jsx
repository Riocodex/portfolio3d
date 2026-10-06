import { githubUrl } from "../../content/profile";

const Footer = () => (
  <footer className='border-t border-[#3a3834] bg-ink text-paper'>
    <div className='mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between'>
      <div>
        <p className='font-display text-2xl'>Rosario Onwuka</p>
        <p className='mt-2 text-[0.95rem] text-[#d9d3c8]'>Software Engineer · Builder</p>
      </div>
      <ul className='flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem]'>
        <li>
          <a href={githubUrl} className='underline underline-offset-4' target='_blank' rel='noreferrer'>
            GitHub
          </a>
        </li>
      </ul>
    </div>
    <div className='mx-auto max-w-6xl px-5 pb-8 sm:px-8'>
      <p className='text-[0.85rem] text-[#8d887f]'>© {new Date().getFullYear()} Rosario Onwuka</p>
    </div>
  </footer>
);

export default Footer;
