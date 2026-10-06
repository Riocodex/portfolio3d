import { Link } from "react-router-dom";

const AdminBar = () => (
  <header className='w-full px-6 py-5 sm:px-16'>
    <Link to='/' className='text-[16px] font-medium text-white'>
      Back to site
    </Link>
  </header>
);

export default AdminBar;
