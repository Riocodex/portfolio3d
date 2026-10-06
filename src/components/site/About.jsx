const About = () => (
  <section id='about' className='scroll-mt-24 border-t border-line' aria-labelledby='about-heading'>
    <div className='mx-auto grid max-w-6xl gap-8 px-5 py-20 sm:px-8 md:grid-cols-12 md:py-28'>
      <h2 id='about-heading' className='font-display text-4xl font-medium tracking-[-0.03em] text-ink md:col-span-4 sm:text-5xl'>
        About
      </h2>
      <div className='max-w-xl space-y-5 text-[1.05rem] leading-8 text-mist md:col-span-7 md:col-start-6'>
        <p>I&apos;m Rosario Onwuka, a Computer Science graduate based in Malta.</p>
        <p>
          I came up through frontend and full-stack work, including time on a production engineering team, and I still take products from an idea through to something that ships.
        </p>
        <p>
          I start with the workflow. If a process is clumsy, I want to understand who uses it before I decide what to build.
        </p>
      </div>
    </div>
  </section>
);

export default About;
