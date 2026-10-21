import { useEffect, useState } from "react";

const links = [
  { href: "#work", label: "Work" },
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className='fixed inset-x-0 top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md'>
      <nav className='mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8' aria-label='Primary'>
        <a href='#top' className='font-display text-[1.35rem] leading-none text-ink' onClick={close}>
          Riocodex
        </a>

        <ul className='hidden items-center gap-8 md:flex'>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className='text-[0.95rem] text-mist transition-colors hover:text-ink'>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type='button'
          className='inline-flex h-11 w-11 items-center justify-center text-ink md:hidden'
          aria-expanded={open}
          aria-controls='site-menu'
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <svg width='22' height='22' viewBox='0 0 22 22' fill='none' aria-hidden='true'>
            {open ? (
              <path d='M5 5l12 12M17 5L5 17' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
            ) : (
              <path d='M3 6h16M3 11h16M3 16h16' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div id='site-menu' className='border-t border-line bg-paper md:hidden'>
          <ul className='mx-auto flex max-w-6xl flex-col px-5 py-3 sm:px-8'>
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className='block py-3 text-[1.05rem] text-ink'
                  onClick={close}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
