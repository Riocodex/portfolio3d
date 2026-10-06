const Hero = () => (
  <section id='top' className='mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36'>
    <div className='max-w-4xl'>
      <p className='text-[0.78rem] font-medium uppercase tracking-[0.16em] text-accent'>
        Software Engineer · Builder
      </p>
      <h1 className='mt-5 font-display text-[2.7rem] font-medium leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl lg:text-[4.6rem]'>
        I build software that solves real business problems.
      </h1>
      <p className='mt-6 max-w-2xl text-[1.05rem] leading-7 text-mist sm:text-lg sm:leading-8'>
        Full-stack applications, AI-powered systems and business software — from customer-facing products to internal operational tools.
      </p>
      <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
        <a href='#work' className='btn btn-primary'>
          View my work
        </a>
        <a href='#contact' className='btn btn-secondary'>
          Let&apos;s talk
        </a>
      </div>
    </div>
  </section>
);

export default Hero;
