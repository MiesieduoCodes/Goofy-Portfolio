"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Loader2 } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { SectionLabel } from "@/components/sections/BigCta";
import { LOCATIONS, PlaceTime } from "@/components/world-clock";
import { contactSchema, fieldErrors, type ContactField } from "@/lib/contact";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EMAIL = "miesieduoveria@gmail.com";
const PHONE = { display: "+234 906 046 2206", href: "tel:+2349060462206" };

const TOPICS = ["Website", "Mobile app", "Game", "Photography", "Music", "Something else"];

const socials = [
  { name: "GitHub", href: "https://github.com/MiesieduoCodes" },
  { name: "LinkedIn", href: "https://ng.linkedin.com/in/goofydidthis" },
  { name: "Instagram", href: "https://www.instagram.com/goofy_did_this/" },
  { name: "X / Twitter", href: "https://x.com/MiesieduoVeria" },
];

type Field = ContactField;
type Status = "idle" | "sending" | "sent" | "error";

function Input({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  multiline,
  autoComplete,
}: {
  id: Field;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const shared = {
    id,
    name: id,
    value,
    autoComplete,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : undefined,
    placeholder: " ",
    className:
      "peer w-full rounded-none border-0 border-b bg-transparent px-0 pb-3 pt-7 text-lg md:text-2xl text-white outline-none transition-colors placeholder:text-transparent focus:border-white " +
      (error ? "border-red-400/70" : "border-white/20"),
  };
  return (
    <div className="relative">
      {multiline ? (
        <textarea {...shared} rows={4} onChange={(e) => onChange(e.target.value)} className={shared.className + " resize-none"} />
      ) : (
        <input {...shared} type={type} onChange={(e) => onChange(e.target.value)} />
      )}
      {/* Floating label: sits in the field until it has focus or content */}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-7 text-lg md:text-2xl text-white/40 transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.3em] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.3em]"
      >
        {label}
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", subject: "", message: "" });
  const [topic, setTopic] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const set = (field: Field) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});

    setStatus("sending");
    setServerMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          subject: topic ? `[${topic}] ${parsed.data.subject}` : parsed.data.subject,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus("sent");
        return;
      }
      if (Array.isArray(data.errors)) {
        const fieldErrors: Partial<Record<Field, string>> = {};
        data.errors.forEach((err: { field: Field; message: string }) => (fieldErrors[err.field] = err.message));
        setErrors(fieldErrors);
      }
      setServerMessage(data.message || "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setServerMessage(`Couldn't reach the server. You can email me directly at ${EMAIL}.`);
      setStatus("error");
    }
  };

  const reset = () => {
    setValues({ name: "", email: "", subject: "", message: "" });
    setTopic(null);
    setStatus("idle");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="px-6 md:px-10 pt-36 md:pt-44">
        {/* ── Header ── */}
        <section className="pb-20 md:pb-28">
          <SectionLabel index="01">Contact</SectionLabel>
          <h1 className="text-[18vw] md:text-[13vw] font-black uppercase leading-[0.82] tracking-tighter">
            {["Let's", "Talk"].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className={`inline-block font-black ${i === 1 ? "text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.5)]" : ""}`}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.6 }}
            className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <p className="max-w-md text-lg md:text-xl leading-relaxed text-white/50">
              Let&apos;s build something that doesn&apos;t feel like a website. Tell me about your project.
            </p>
            <div className="flex items-center gap-3">
              <a href={`mailto:${EMAIL}`} className="link-underline text-xl md:text-3xl font-semibold">
                {EMAIL}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-transparent p-0 text-white transition-colors hover:bg-white hover:text-black"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
              <span aria-live="polite" className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                {copied ? "Copied" : ""}
              </span>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-16 pb-28 md:grid-cols-12 md:pb-40">
          {/* ── Form ── */}
          <div className="md:col-span-7">
            <SectionLabel index="02">Send a message</SectionLabel>
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE_OUT }}
                  className="border-y border-white/10 py-16"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black"
                  >
                    <Check className="h-7 w-7" />
                  </motion.span>
                  <h2 className="mt-8 text-4xl md:text-6xl font-black uppercase tracking-tighter">Message sent</h2>
                  <p className="mt-4 max-w-md text-white/50">
                    Thanks, {values.name.split(" ")[0]}. I usually reply within 24–48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-8 rounded-full border border-white/25 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" noValidate onSubmit={handleSubmit} exit={{ opacity: 0 }} className="space-y-10">
                  {/* Topic chips */}
                  <fieldset>
                    <legend className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/40">What&apos;s it about?</legend>
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={topic === t}
                          onClick={() => setTopic((cur) => (cur === t ? null : t))}
                          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
                            topic === t ? "border-white bg-white text-black" : "border-white/20 bg-transparent text-white/60 hover:border-white/60 hover:text-white"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid gap-10 md:grid-cols-2">
                    <Input id="name" label="Your name" value={values.name} error={errors.name} onChange={set("name")} autoComplete="name" />
                    <Input id="email" label="Email" type="email" value={values.email} error={errors.email} onChange={set("email")} autoComplete="email" />
                  </div>
                  <Input id="subject" label="Subject" value={values.subject} error={errors.subject} onChange={set("subject")} />
                  <Input id="message" label="Tell me about your project" value={values.message} error={errors.message} onChange={set("message")} multiline />

                  {status === "error" && serverMessage && (
                    <p role="alert" className="border-l-2 border-red-400/70 pl-4 text-sm text-red-300">
                      {serverMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group flex items-center gap-4 rounded-full bg-white py-4 pl-8 pr-4 text-base font-semibold text-black transition-opacity disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Send message"}
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform duration-500 group-hover:rotate-45">
                      {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
                    </span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ── Details ── */}
          <aside className="md:col-span-4 md:col-start-9">
            <SectionLabel index="03">Details</SectionLabel>
            <dl className="divide-y divide-white/10 border-y border-white/10">
              <div className="py-5">
                <dt className="text-[10px] uppercase tracking-[0.3em] text-white/40">Phone</dt>
                <dd className="mt-2 text-lg font-semibold">
                  <a href={PHONE.href} className="link-underline">
                    {PHONE.display}
                  </a>
                </dd>
              </div>
              <div className="py-5">
                <dt className="text-[10px] uppercase tracking-[0.3em] text-white/40">Currently</dt>
                <dd className="mt-2 text-lg font-semibold">
                  {LOCATIONS.current.label} · <PlaceTime timeZone={LOCATIONS.current.timeZone} />
                </dd>
                <dd className="text-sm text-white/40">Working remotely, worldwide</dd>
              </div>
              <div className="py-5">
                <dt className="text-[10px] uppercase tracking-[0.3em] text-white/40">Response time</dt>
                <dd className="mt-2 text-lg font-semibold">24–48 hours</dd>
              </div>
            </dl>

            <p className="mb-2 mt-12 text-[10px] uppercase tracking-[0.3em] text-white/40">Elsewhere</p>
            <ul>
              {socials.map((s) => (
                <li key={s.name} className="border-b border-white/10">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-4 text-2xl font-black uppercase tracking-tighter"
                  >
                    <span className="transition-transform duration-500 group-hover:translate-x-2">{s.name}</span>
                    <ArrowUpRight className="h-5 w-5 text-white/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-white" />
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
