import { motion } from "motion/react";
import { Briefcase, Zap, ArrowRight } from "lucide-react";
import { GlitchText } from "./GlitchText";
import { Typewriter } from "./Typewriter";

interface HeaderProps {
  onStart: () => void;
}

export function Header({ onStart }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-10">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center" style={{ border: "1px solid rgba(20,184,166,0.4)" }}>
            <Briefcase size={15} className="text-teal-400" />
            <motion.div
              className="absolute inset-0 rounded-lg"
              style={{ border: "1px solid rgba(20,184,166,0.6)" }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
          <span className="text-slate-200 tracking-tight text-sm" style={{ fontWeight: 600 }}>24h Job Finder</span>
        </motion.div>
        <div className="hidden md:flex items-center gap-6">
          {["How it works", "Features", "Docs"].map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-slate-400 text-sm cursor-pointer hover:text-teal-400 transition-colors"
            >
              {item}
            </motion.span>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center px-6 py-14 md:py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mb-7 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ border: "1px solid rgba(20,184,166,0.3)", background: "rgba(20,184,166,0.08)" }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap size={11} className="text-teal-400" />
          </motion.div>
          <span className="text-teal-400 text-xs tracking-widest" style={{ fontWeight: 600 }}>
            POWERED BY AI · REAL-TIME JOB SEARCH
          </span>
        </motion.div>

        {/* Title with glitch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-5 relative"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", lineHeight: 1.12, letterSpacing: "-0.025em" }}
        >
          <span className="text-slate-100" style={{ fontWeight: 800 }}>Find Jobs in the{" "}</span>
          <GlitchText
            text="Last 24 Hours"
            gradient="linear-gradient(135deg, #2dd4bf, #38bdf8, #818cf8)"
            style={{ fontWeight: 800 }}
          />
        </motion.div>

        {/* Subtitle with typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-slate-400 max-w-lg mb-10 min-h-[3rem] flex items-center justify-center"
          style={{ fontSize: "1.05rem", lineHeight: 1.7 }}
        >
          <Typewriter
            text="Find and append recent job postings to your Google Sheet — automatically matched to your skills and experience."
            delay={700}
            speed={28}
          />
        </motion.div>

        {/* CTA Button with orbit rings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="relative flex items-center justify-center mb-14"
        >
          {/* Orbit rings */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 160, height: 160, border: "1px solid rgba(20,184,166,0.15)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="absolute w-2 h-2 rounded-full bg-teal-400"
              style={{ top: -4, left: "50%", transform: "translateX(-50%)", boxShadow: "0 0 8px #14b8a6" }}
            />
          </motion.div>
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 200, height: 200, border: "1px solid rgba(56,189,248,0.1)" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="absolute w-1.5 h-1.5 rounded-full bg-sky-400"
              style={{ bottom: -3, left: "50%", transform: "translateX(-50%)", boxShadow: "0 0 6px #38bdf8" }}
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={onStart}
            className="relative z-10 flex items-center gap-2.5 px-8 py-4 rounded-xl text-white cursor-pointer overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #0d9488, #0891b2)",
              fontWeight: 600,
              fontSize: "0.95rem",
              boxShadow: "0 4px 24px rgba(13,148,136,0.4), 0 0 0 1px rgba(20,184,166,0.3)",
            }}
          >
            {/* Shimmer overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
            />
            Get Started — It's Free
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={16} />
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {[
            { value: "10,000+", label: "Jobs scanned daily" },
            { value: "50+", label: "Job boards supported" },
            { value: "< 2 min", label: "Average runtime" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + i * 0.15 }}
            >
              <span className="text-teal-400" style={{ fontSize: "1.4rem", fontWeight: 700 }}>{stat.value}</span>
              <span className="text-slate-500 text-xs">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
