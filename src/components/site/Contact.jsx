import { useState } from "react";
import emailjs from "@emailjs/browser";

const emptyForm = {
  from_name: "",
  reply_to: "",
  message: "",
};

const Contact = () => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus({
        type: "error",
        text: "The contact form is not configured yet. Please try again later.",
      });
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.from_name,
          reply_to: form.reply_to,
          from_email: form.reply_to,
          user_email: form.reply_to,
          message: form.message,
        },
        publicKey
      );

      setForm(emptyForm);
      setStatus({
        type: "success",
        text: "Thank you. I will get back to you as soon as possible.",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      const errorText = error?.text || "";
      const reconnecting =
        errorText.includes("Invalid grant") || errorText.includes("insufficient authentication");

      setStatus({
        type: "error",
        text: reconnecting
          ? "The email service needs to be reconnected. Please try again later."
          : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id='contact' className='scroll-mt-24 border-t border-line bg-ink text-paper' aria-labelledby='contact-heading'>
      <div className='mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-12 md:py-28'>
        <div className='md:col-span-5'>
          <h2 id='contact-heading' className='font-display text-4xl font-medium leading-tight tracking-[-0.03em] sm:text-5xl'>
            Have something worth building?
          </h2>
          <p className='mt-5 max-w-md text-[1.02rem] leading-7 text-[#d9d3c8]'>
            I&apos;m interested in software engineering roles, and in conversations about useful products, internal tools and business software.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5 md:col-span-6 md:col-start-7' noValidate>
          <div>
            <label htmlFor='from_name' className='block text-[0.85rem] text-[#d9d3c8]'>
              Name
            </label>
            <input
              id='from_name'
              name='from_name'
              type='text'
              required
              autoComplete='name'
              value={form.from_name}
              onChange={handleChange}
              className='field mt-2'
            />
          </div>
          <div>
            <label htmlFor='reply_to' className='block text-[0.85rem] text-[#d9d3c8]'>
              Email
            </label>
            <input
              id='reply_to'
              name='reply_to'
              type='email'
              required
              autoComplete='email'
              value={form.reply_to}
              onChange={handleChange}
              className='field mt-2'
            />
          </div>
          <div>
            <label htmlFor='message' className='block text-[0.85rem] text-[#d9d3c8]'>
              Message
            </label>
            <textarea
              id='message'
              name='message'
              required
              rows={6}
              value={form.message}
              onChange={handleChange}
              className='field mt-2'
            />
          </div>

          {status && (
            <p role={status.type === "error" ? "alert" : "status"} className={status.type === "error" ? "text-[#f0c2c2]" : "text-[#d9d3c8]"}>
              {status.text}
            </p>
          )}

          <button type='submit' className='btn btn-light' disabled={loading}>
            {loading ? "Sending..." : "Let's talk"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
