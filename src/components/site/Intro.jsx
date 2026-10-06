const Intro = () => (
  <section className='border-t border-line' aria-labelledby='intro-heading'>
    <div className='mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-12 md:py-24'>
      <h2 id='intro-heading' className='font-display text-3xl font-medium leading-tight tracking-[-0.02em] text-ink md:col-span-5 md:text-4xl'>
        Building useful software, not just interfaces.
      </h2>
      <div className='max-w-xl md:col-span-6 md:col-start-7'>
        <p className='text-[1.05rem] leading-8 text-mist'>
          I&apos;m a software engineer who builds full-stack products and the tools around how a business actually runs — from what a customer sees to the workflow behind it.
        </p>
      </div>
    </div>
  </section>
);

export default Intro;
