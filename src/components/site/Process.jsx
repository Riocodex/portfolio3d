import { processSteps } from "../../content/profile";

const Process = () => (
  <section className='border-t border-line' aria-labelledby='process-heading'>
    <div className='mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28'>
      <h2 id='process-heading' className='font-display text-4xl font-medium tracking-[-0.03em] text-ink sm:text-5xl'>
        From problem to product
      </h2>
      <ol className='mt-12 grid gap-10 md:grid-cols-3'>
        {processSteps.map((step) => (
          <li key={step.number} className='border-t border-line pt-5'>
            <p className='font-display text-2xl text-accent'>{step.number}</p>
            <h3 className='mt-3 text-[1.15rem] font-medium text-ink'>{step.title}</h3>
            <p className='mt-3 text-[0.98rem] leading-7 text-mist'>{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Process;
