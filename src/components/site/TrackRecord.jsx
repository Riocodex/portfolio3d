import { trackRecord } from "../../content/profile";

const TrackRecord = () => (
  <section id='work' className='scroll-mt-24 border-t border-line' aria-labelledby='work-heading'>
    <div className='mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28'>
      <div className='max-w-2xl'>
        <p className='text-[0.78rem] font-medium uppercase tracking-[0.16em] text-accent'>Track record</p>
        <h2 id='work-heading' className='mt-3 font-display text-4xl font-medium tracking-[-0.03em] text-ink sm:text-5xl'>
          Companies &amp; products I&apos;ve worked with
        </h2>
        <p className='mt-4 max-w-xl text-[1.02rem] leading-7 text-mist'>
          A selection of businesses and products I&apos;ve built for, worked on, or contributed to.
        </p>
      </div>

      <div className='mt-12 border-t border-line'>
        {trackRecord.map((item, index) => {
          const number = String(index + 1).padStart(2, "0");
          const href = item.url?.trim() || "";

          return (
            <article key={item.name} className='grid gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-10 md:py-12'>
              <div className='md:col-span-4'>
                <p className='font-display text-2xl text-accent'>{number}</p>
                <h3 className='mt-3 font-display text-4xl font-medium tracking-[-0.03em] text-ink'>{item.name}</h3>
                <p className='mt-3 text-[0.78rem] font-medium uppercase tracking-[0.14em] text-mist'>{item.category}</p>
              </div>

              <div className='md:col-span-4'>
                <h4 className='text-[0.75rem] font-medium uppercase tracking-[0.14em] text-ink'>What it is</h4>
                <p className='mt-3 text-[1.02rem] leading-7 text-mist'>{item.description}</p>
              </div>

              <div className='md:col-span-4'>
                <h4 className='text-[0.75rem] font-medium uppercase tracking-[0.14em] text-ink'>My relationship</h4>
                <p className='mt-3 text-[1.02rem] leading-7 text-ink'>{item.relationship}</p>
                <h4 className='mt-6 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-ink'>What I did</h4>
                <p className='mt-3 text-[1.02rem] leading-7 text-mist'>{item.involvement}</p>
                {href && (
                  <a
                    href={href}
                    target='_blank'
                    rel='noreferrer'
                    className='mt-6 inline-block text-[0.95rem] text-ink underline decoration-line underline-offset-4 hover:decoration-ink'
                  >
                    Visit website ↗
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

export default TrackRecord;
