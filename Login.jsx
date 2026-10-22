import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Apple,
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronLeft,
  Fingerprint,
  Github,
  Heart,
  HeartHandshake,
  KeyRound,
  Lock,
  Mail,
  MessageSquareText,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a6.01 6.01 0 0 1-2.21 3.31v2.77h3.57a10.98 10.98 0 0 0 3.28-8.09Z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23Z" fill="#34A853" />
    <path d="M5.84 14.09A6.95 6.95 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A10.95 10.95 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l2.85-2.22.81-.62Z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" fill="#EA4335" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="2" width="9" height="9" fill="#F25022" />
    <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
    <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
    <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M24 12a12 12 0 1 0-13.88 11.86v-8.39H7.08V12h3.04V9.36c0-3 1.79-4.66 4.52-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.31l-.53 3.47h-2.78v8.39A12 12 0 0 0 24 12Z" fill="#1877F2" />
    <path d="M16.64 15.47 17.17 12h-3.31V9.75c0-.95.46-1.87 1.95-1.87h1.51V4.93s-1.37-.23-2.68-.23c-2.73 0-4.52 1.66-4.52 4.66V12H7.08v3.47h3.04v8.39a12.13 12.13 0 0 0 3.74 0v-8.39h2.78Z" fill="#fff" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="24" height="24" rx="5" fill="#0A66C2" />
    <path d="M7.1 9.1a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1ZM5.8 10.55h2.6v7.65H5.8v-7.65ZM9.95 10.55h2.5v1.04h.04c.35-.66 1.2-1.35 2.47-1.35 2.64 0 3.14 1.74 3.14 4V18.2h-2.6v-3.5c0-.84-.01-1.92-1.17-1.92-1.17 0-1.35.91-1.35 1.86v3.56h-2.6v-7.65Z" fill="#fff" />
  </svg>
);

const XIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M18.9 3H21l-4.58 5.24L21.8 21h-4.58l-3.58-4.68L9.56 21H7.45l4.9-5.6L3 3h4.7l3.24 4.28L14.67 3h4.23Zm-1.61 15.46h1.27L6.01 5.46H4.65l12.64 13Z" fill="currentColor" />
  </svg>
);

const SlackIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9.84 2a1.84 1.84 0 0 1 1.84 1.84v4.6H7.08V3.84A1.84 1.84 0 0 1 8.92 2h.92Z" fill="#E01E5A" />
    <path d="M9.84 15.56a1.84 1.84 0 0 1 1.84 1.84v4.76a1.84 1.84 0 0 1-3.68 0v-4.76a1.84 1.84 0 0 1 1.84-1.84Z" fill="#36C5F0" />
    <path d="M22 9.84a1.84 1.84 0 0 1-1.84 1.84h-4.6V7.08h4.6A1.84 1.84 0 0 1 22 8.92v.92Z" fill="#2EB67D" />
    <path d="M8.44 9.84a1.84 1.84 0 0 1-1.84 1.84H1.84a1.84 1.84 0 0 1 0-3.68H6.6a1.84 1.84 0 0 1 1.84 1.84Z" fill="#ECB22E" />
    <path d="M7.08 20.16A1.84 1.84 0 0 1 5.24 22h-.92a1.84 1.84 0 0 1 0-3.68h2.76V20.16Z" fill="#E01E5A" />
    <path d="M16.92 3.84A1.84 1.84 0 0 1 18.76 2h.92a1.84 1.84 0 0 1 0 3.68h-2.76V3.84Z" fill="#36C5F0" />
    <path d="M3.84 7.08A1.84 1.84 0 0 1 2 5.24v-.92a1.84 1.84 0 0 1 3.68 0v2.76H3.84Z" fill="#2EB67D" />
    <path d="M20.16 16.92A1.84 1.84 0 0 1 22 18.76v.92a1.84 1.84 0 0 1-3.68 0v-2.76h1.84Z" fill="#ECB22E" />
  </svg>
);

const primaryOptions = [
  { label: "Google", icon: <GoogleIcon /> },
  { label: "Apple", icon: <Apple className="h-5 w-5" /> },
  { label: "Microsoft", icon: <MicrosoftIcon /> },
  { label: "GitHub", icon: <Github className="h-5 w-5" /> },
  { label: "Facebook", icon: <FacebookIcon /> },
  { label: "LinkedIn", icon: <LinkedInIcon /> },
  { label: "X", icon: <XIcon /> },
  { label: "Slack", icon: <SlackIcon /> },
];

const alternateOptions = [
  { label: "Phone OTP", description: "Fast login with a verification code", icon: Smartphone },
  { label: "Magic Link", description: "One-tap sign in from your inbox", icon: Mail },
  { label: "Enterprise SSO", description: "SAML and workplace account access", icon: Building2 },
  { label: "Passkey", description: "Face ID, fingerprint, and device-based sign in", icon: Fingerprint },
];

const trustPoints = [
  "Friendly access to your reports, history, and saved preferences",
  "Secure options for personal, family, and clinic workflows",
  "A calm visual tone that fits a healthcare product without feeling cold",
];

const welcomeStats = [
  { value: "10+", label: "language journeys" },
  { value: "24/7", label: "care-ready access" },
  { value: "1 tap", label: "return via magic link" },
];

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organization: "",
  });

  const isSignUp = mode === "signup";

  const title = useMemo(
    () =>
      isSignUp
        ? "Create your calm, connected MediClear account"
        : "Welcome back to your care space",
    [isSignUp]
  );

  const subtitle = useMemo(
    () =>
      isSignUp
        ? "Set up a friendly account in seconds, then continue with email, phone, passkey, or your preferred provider."
        : "Pick the easiest way to sign in and get back to your reports, recommendations, and saved history.",
    [isSignUp]
  );

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleAuth = (event) => {
    event.preventDefault();
    navigate("/");
  };

  const handleProviderAuth = () => {
    navigate("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_28%),radial-gradient(circle_at_85%_12%,_rgba(45,212,191,0.22),_transparent_24%),linear-gradient(180deg,_rgba(248,252,255,1)_0%,_rgba(240,249,255,1)_48%,_rgba(236,253,245,0.9)_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_30%),radial-gradient(circle_at_85%_12%,_rgba(45,212,191,0.16),_transparent_24%),linear-gradient(180deg,_rgba(2,6,23,1)_0%,_rgba(10,18,34,1)_52%,_rgba(6,24,31,1)_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <motion.div
          animate={{ x: [0, 24, 0], y: [0, 18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[8%] top-[10%] h-52 w-52 rounded-full bg-primary/15 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, -26, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[8%] right-[10%] h-64 w-64 rounded-full bg-accent/15 blur-3xl"
        />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur transition hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary shadow-sm sm:inline-flex">
            <ShieldCheck className="h-4 w-4" />
            Secure, premium account access
          </div>
        </div>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.section
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-[32px] border border-white/40 bg-slate-950 px-6 py-8 text-white shadow-[0_40px_100px_-40px_rgba(15,23,42,0.75)] sm:px-8 lg:px-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.35),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(45,212,191,0.22),_transparent_28%),linear-gradient(135deg,_rgba(2,6,23,0.96),_rgba(8,47,73,0.88)_52%,_rgba(6,95,70,0.72))]" />
            <div className="absolute right-[-4rem] top-[-5rem] h-48 w-48 rounded-full border border-white/10 bg-white/5 blur-2xl" />
            <div className="absolute bottom-[-3rem] left-[-2rem] h-40 w-40 rounded-full border border-white/10 bg-primary/20 blur-2xl" />

            <div className="relative flex h-full flex-col">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <Heart className="h-6 w-6 text-cyan-200" />
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-tight">MediClear</p>
                  <p className="text-sm text-cyan-50/70">Medical clarity with a human feel</p>
                </div>
              </div>

              <div className="max-w-xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/90">
                  <Sparkles className="h-3.5 w-3.5" />
                  Friendly premium access
                </div>
                <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                  One welcoming place to sign in, sign up, and stay connected to your care.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-slate-200/90 sm:text-lg">
                  The experience is built to feel light, trustworthy, and easy even when someone is already worried about a report, prescription, or next medical step.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {welcomeStats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-200/80">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="mb-4 flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-cyan-200" />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100/90">
                    Why it fits the product mood
                  </p>
                </div>
                <div className="space-y-3">
                  {trustPoints.map((point) => (
                    <div key={point} className="flex items-start gap-3 rounded-2xl bg-black/10 px-4 py-3">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      <p className="text-sm leading-6 text-slate-100/90">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/80">
                  Flexible connection methods
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Email", "Google", "Apple", "Microsoft", "Phone OTP", "Passkeys", "Enterprise SSO", "Magic Link"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/12 bg-white/10 px-3 py-2 text-xs font-medium text-slate-100/90"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="flex items-center"
          >
            <div className="w-full rounded-[32px] border border-white/60 bg-card/80 p-5 shadow-[0_35px_80px_-45px_rgba(14,165,233,0.5)] backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                    Account access
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{subtitle}</p>
                </div>
                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:flex">
                  <ShieldCheck className="h-7 w-7" />
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 rounded-2xl border border-border/70 bg-muted/50 p-1">
                {[
                  { id: "signin", label: "Sign in" },
                  { id: "signup", label: "Sign up" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    className={`rounded-[14px] px-4 py-3 text-sm font-semibold transition ${
                      mode === item.id
                        ? "bg-card text-foreground shadow-sm ring-1 ring-primary/20"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <AnimatePresence initial={false}>
                  {isSignUp && (
                    <motion.div
                      key="signup-fields"
                      initial={{ opacity: 0, height: 0, y: -8 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="grid gap-4 sm:grid-cols-2"
                    >
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-foreground">Full name</span>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            value={form.name}
                            onChange={updateField("name")}
                            placeholder="Aarav Sharma"
                            required={isSignUp}
                            className="h-12 w-full rounded-2xl border border-border bg-background/90 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                          />
                        </div>
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-foreground">Organization</span>
                        <div className="relative">
                          <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            value={form.organization}
                            onChange={updateField("organization")}
                            placeholder="Family, clinic, or workplace"
                            className="h-12 w-full rounded-2xl border border-border bg-background/90 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                          />
                        </div>
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Email address</span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={updateField("email")}
                      placeholder="name@example.com"
                      required
                      className="h-12 w-full rounded-2xl border border-border bg-background/90 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                </label>

                <label className="block">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground">Password</span>
                    {!isSignUp && (
                      <button type="button" className="text-xs font-semibold text-primary transition hover:text-primary/80">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      value={form.password}
                      onChange={updateField("password")}
                      placeholder="Enter a secure password"
                      required
                      className="h-12 w-full rounded-2xl border border-border bg-background/90 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                </label>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-muted/35 px-4 py-3 text-sm">
                  <label className="inline-flex items-center gap-2 text-muted-foreground">
                    <input type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                    Keep me signed in on this device
                  </label>
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    Protected with secure sign-in flows
                  </span>
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                >
                  {isSignUp ? "Create account" : "Continue to MediClear"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Or connect with
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {primaryOptions.map((provider) => (
                  <button
                    key={provider.label}
                    type="button"
                    onClick={handleProviderAuth}
                    className="inline-flex items-center gap-3 rounded-2xl border border-border/80 bg-background/85 px-4 py-3 text-left text-sm font-medium text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                      {provider.icon}
                    </span>
                    <span>{provider.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-[28px] border border-primary/10 bg-primary/5 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">More ways to access your account</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {alternateOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={handleProviderAuth}
                        className="rounded-2xl border border-border/70 bg-card/90 p-4 text-left transition hover:border-primary/40 hover:bg-background"
                      >
                        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">{option.label}</p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="leading-6">
                    Users can sign in, create an account, connect a provider, or join through workplace access from the same screen.
                  </p>
                </div>
              </div>

              <p className="mt-6 text-center text-xs leading-6 text-muted-foreground">
                By continuing, you agree to MediClear&apos;s terms, privacy practices, and secure account protections for healthcare-related data access.
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
