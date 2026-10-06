import { capabilities } from "../../content/profile";

const Capabilities = () => (
  <section className='border-t border-line' aria-labelledby='capabilities-heading'>
    <div className='mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28'>
      <div className='max-w-2xl'>
        <h2 id='capabilities-heading' className='font-display text-4xl font-medium tracking-[-0.03em] text-ink sm:text-5xl'>
          What I can build
        </h2>
        <p className='mt-4 text-[1.02rem] leading-7 text-mist'>
          The kinds of software I take from a problem through to something people can use.
        </p>
      </div>
      <div className='mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2'>
        {capabilities.map((item) => (
          <article key={item.title} className='border-t border-line pt-6'>
            <h3 className='font-display text-2xl font-medium tracking-[-0.02em] text-ink'>{item.title}</h3>
            <p className='mt-3 max-w-md text-[1.02rem] leading-7 text-mist'>{item.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Capabilities;
