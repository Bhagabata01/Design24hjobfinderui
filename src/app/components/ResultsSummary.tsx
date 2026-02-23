import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2, Building2, Sparkles, Globe,
  RotateCcw, ExternalLink, TrendingUp,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ResultsSummaryProps {
  jobSources: string[];
  onReset: () => void;
}

const MOCK_COMPANIES = [
  { name: "Google", count: 8, color: "#4285f4" },
  { name: "Stripe", count: 6, color: "#635bff" },
  { name: "Airbnb", count: 5, color: "#ff5a5f" },
  { name: "Meta", count: 5, color: "#1877f2" },
  { name: "Microsoft", count: 4, color: "#00a4ef" },
  { name: "Vercel", count: 3, color: "#e2e8f0" },
];

const MOCK_SKILLS = [
  { name: "React", score: 95 },
  { name: "TypeScript", score: 90 },
  { name: "Node.js", score: 82 },
  { name: "Python", score: 78 },
  { name: "AWS", score: 70 },
  { name: "GraphQL", score: 65 },
  { name: "Docker", score: 60 },
  { name: "PostgreSQL", score: 55 },
  { name: "Redis", score: 45 },
  { name: "Kubernetes", score: 40 },
];

const CHART_DATA = [
  { day: "Mon", jobs: 6 },
  { day: "Tue", jobs: 9 },
  { day: "Wed", jobs: 12 },
  { day: "Thu", jobs: 8 },
  { day: "Fri", jobs: 7 },
  { day: "Sat", jobs: 3 },
  { day: "Sun", jobs: 2 },
];

const SOURCE_COLORS: Record<string, string> = {
  Indeed: "#2557a7",
  LinkedIn: "#0a66c2",
  Glassdoor: "#0caa41",
  Wellfound: "#ff6154",
  "Remote.co": "#7c3aed",
  Dice: "#eb5f1e",
  ZipRecruiter: "#00b050",
  Monster: "#6900b8",
};

// Count-up hook
function useCountUp(target: number, duration = 1400, delay = 300) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let start = 0;
      const step = target / (duration / 16);
      const id = setInterval(() => {
        start = Math.min(start + step, target);
        setCount(Math.floor(start));
        if (start >= target) clearInterval(id);
      }, 16);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return count;
}

// Tilt card hook
function useTilt(maxTilt = 6) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * maxTilt * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * maxTilt * -2;
    setRotation({ x: y, y: x });
    setHovered(true);
  };
  const onLeave = () => { setRotation({ x: 0, y: 0 }); setHovered(false); };

  return { ref, rotation, hovered, onMove, onLeave };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div
        className="rounded-lg px-3 py-2 text-xs"
        style={{ background: "#1a2b3c", border: "1px solid rgba(20,184,166,0.4)", boxShadow: "0 0 12px rgba(20,184,166,0.2)" }}
      >
        <p className="text-slate-400">{label}</p>
        <p className="text-teal-400" style={{ fontWeight: 700 }}>{payload[0].value} jobs</p>
      </div>
    );
  }
  return null;
};

const CARD_BASE = {
  background: "linear-gradient(145deg, #1a2b3c, #15222f)",
  border: "1px solid rgba(148,163,184,0.08)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
};

// Reusable tilt card wrapper
function TiltCard({ children, className = "", delay = 0, cornerBrackets = false }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  cornerBrackets?: boolean;
}) {
  const { ref, rotation, hovered, onMove, onLeave } = useTilt(5);
  const cornerStyle: React.CSSProperties = {
    position: "absolute", width: 12, height: 12,
    borderColor: "rgba(20,184,166,0.4)", borderStyle: "solid", zIndex: 10,
    transition: "opacity 0.3s",
    opacity: hovered ? 1 : 0.4,
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        ...CARD_BASE,
        transformStyle: "preserve-3d",
        transform: `perspective(900px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: hovered ? "transform 0.06s ease, box-shadow 0.3s" : "transform 0.5s ease, box-shadow 0.3s",
        boxShadow: hovered
          ? "0 8px 30px rgba(0,0,0,0.5), 0 0 24px rgba(20,184,166,0.12)"
          : CARD_BASE.boxShadow,
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Scanline sweep */}
      <motion.div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          height: "60px",
          background: "linear-gradient(180deg, transparent 0%, rgba(20,184,166,0.03) 50%, transparent 100%)",
          zIndex: 5,
        }}
        animate={{ top: ["-60px", "110%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      />
      {cornerBrackets && (
        <>
          <span style={{ ...cornerStyle, top: 8, left: 8, borderWidth: "1px 0 0 1px" }} />
          <span style={{ ...cornerStyle, top: 8, right: 8, borderWidth: "1px 1px 0 0" }} />
          <span style={{ ...cornerStyle, bottom: 8, left: 8, borderWidth: "0 0 1px 1px" }} />
          <span style={{ ...cornerStyle, bottom: 8, right: 8, borderWidth: "0 1px 1px 0" }} />
        </>
      )}
      <div className="relative z-10 p-6">{children}</div>
    </motion.div>
  );
}

export function ResultsSummary({ jobSources, onReset }: ResultsSummaryProps) {
  const totalJobs = CHART_DATA.reduce((a, b) => a + b.jobs, 0);
  const countedJobs = useCountUp(totalJobs);
  const filteredSources = jobSources.length > 0 ? jobSources : ["Indeed", "LinkedIn"];

  const sourceJobCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredSources.forEach((source, i) => {
      counts[source] = [12, 8, 15, 7, 5, 10, 9, 6][i % 8];
    });
    return counts;
  }, [filteredSources]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto px-4 pb-12"
    >
      {/* Success banner — holographic shimmer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, type: "spring", stiffness: 180 }}
        className="rounded-2xl p-6 mb-5 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(13,148,136,0.18), rgba(8,145,178,0.1), rgba(99,102,241,0.1))",
          border: "1px solid rgba(20,184,166,0.3)",
        }}
      >
        {/* Holographic shimmer */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.06) 50%, transparent 80%)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
        />
        {/* Pulsing border */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: "1px solid rgba(20,184,166,0.5)" }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <div className="flex items-center gap-3 relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 18 }}
            style={{ filter: "drop-shadow(0 0 10px rgba(20,184,166,0.6))" }}
          >
            <CheckCircle2 size={38} className="text-teal-400" />
          </motion.div>
          <div>
            <p className="text-slate-100" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
              Jobs added to Google Sheet!
            </p>
            <p className="text-slate-400 text-sm">
              {totalJobs} matching jobs appended successfully.{" "}
              <span className="text-teal-400 cursor-pointer hover:underline inline-flex items-center gap-1">
                Open Sheet <ExternalLink size={11} />
              </span>
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 16px rgba(20,184,166,0.25)" }}
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          className="relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer text-sm"
          style={{
            background: "rgba(148,163,184,0.08)",
            border: "1px solid rgba(148,163,184,0.18)",
            fontWeight: 500,
          }}
        >
          <RotateCcw size={14} />
          New Search
        </motion.button>
      </motion.div>

      {/* Top row: counter + chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Animated counter card */}
        <TiltCard delay={0.1} cornerBrackets>
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm" style={{ fontWeight: 500 }}>Total Jobs Found</span>
            <motion.div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(20,184,166,0.12)", border: "1px solid rgba(20,184,166,0.2)" }}
              animate={{ boxShadow: ["0 0 0 rgba(20,184,166,0)", "0 0 14px rgba(20,184,166,0.3)", "0 0 0 rgba(20,184,166,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp size={14} className="text-teal-400" />
            </motion.div>
          </div>
          <motion.span
            className="text-teal-400 block"
            style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", textShadow: "0 0 30px rgba(20,184,166,0.4)" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 220 }}
          >
            {countedJobs}
          </motion.span>
          <p className="text-slate-500 text-xs mt-2">From last 24 hours</p>
        </TiltCard>

        {/* Bar chart */}
        <TiltCard delay={0.18} className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm" style={{ fontWeight: 500 }}>Jobs by Day</span>
            <span
              className="text-teal-400 text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)", fontWeight: 500 }}
            >
              This week
            </span>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={CHART_DATA} barSize={18}>
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
              <Bar dataKey="jobs" radius={[4, 4, 0, 0]}>
                {CHART_DATA.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === CHART_DATA.length - 2
                        ? "#0d9488"
                        : i < CHART_DATA.length - 2
                        ? "rgba(20,184,166,0.4)"
                        : "rgba(20,184,166,0.2)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </TiltCard>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Companies */}
        <TiltCard delay={0.26} cornerBrackets>
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={13} className="text-teal-400" />
            <span className="text-slate-400 text-sm" style={{ fontWeight: 500 }}>Top Companies</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {MOCK_COMPANIES.map((company, i) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.07, ease: "easeOut" }}
                className="flex items-center gap-2"
              >
                <motion.div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0"
                  style={{
                    background: company.color === "#e2e8f0" ? "#1e293b" : company.color,
                    color: company.color === "#e2e8f0" ? "#e2e8f0" : "white",
                    fontWeight: 700,
                    border: `1px solid ${company.color}40`,
                  }}
                  whileHover={{ scale: 1.15, boxShadow: `0 0 10px ${company.color}60` }}
                >
                  {company.name[0]}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-slate-300 text-xs truncate" style={{ fontWeight: 500 }}>{company.name}</span>
                    <span className="text-teal-400 text-xs ml-2 flex-shrink-0" style={{ fontWeight: 600 }}>{company.count}</span>
                  </div>
                  <div className="h-px rounded-full overflow-hidden" style={{ background: "rgba(148,163,184,0.12)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #0d9488, #38bdf8)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(company.count / MOCK_COMPANIES[0].count) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.07, duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TiltCard>

        {/* Top Skills */}
        <TiltCard delay={0.34}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={13} className="text-teal-400" />
            <span className="text-slate-400 text-sm" style={{ fontWeight: 500 }}>Top Matching Skills</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MOCK_SKILLS.map((skill, i) => (
              <motion.span
                key={skill.name}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.055, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.08, y: -2 }}
                className="px-2.5 py-1 rounded-lg text-xs cursor-default"
                style={{
                  fontWeight: 500,
                  background:
                    skill.score > 75 ? "rgba(20,184,166,0.15)" :
                    skill.score > 55 ? "rgba(56,189,248,0.1)" :
                    "rgba(148,163,184,0.07)",
                  border: `1px solid ${
                    skill.score > 75 ? "rgba(20,184,166,0.35)" :
                    skill.score > 55 ? "rgba(56,189,248,0.25)" :
                    "rgba(148,163,184,0.12)"
                  }`,
                  color:
                    skill.score > 75 ? "#2dd4bf" :
                    skill.score > 55 ? "#7dd3fc" :
                    "#94a3b8",
                  boxShadow: skill.score > 75 ? "0 0 8px rgba(20,184,166,0.1)" : "none",
                }}
              >
                {skill.name}
                <span className="ml-1 opacity-55">{skill.score}%</span>
              </motion.span>
            ))}
          </div>
        </TiltCard>

        {/* Sources Used */}
        <TiltCard delay={0.42} cornerBrackets>
          <div className="flex items-center gap-2 mb-4">
            <Globe size={13} className="text-teal-400" />
            <span className="text-slate-400 text-sm" style={{ fontWeight: 500 }}>Sources Used</span>
          </div>
          <div className="flex flex-col gap-3">
            {filteredSources.map((source, i) => {
              const color = SOURCE_COLORS[source] ?? "#14b8a6";
              const jobCount = sourceJobCounts[source];
              return (
                <motion.div
                  key={source}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.08, ease: "easeOut" }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <motion.div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs"
                      style={{ background: color, fontWeight: 700, boxShadow: `0 2px 8px ${color}50` }}
                      whileHover={{ scale: 1.1, boxShadow: `0 0 14px ${color}70` }}
                    >
                      {source[0]}
                    </motion.div>
                    <span className="text-slate-300 text-sm" style={{ fontWeight: 500 }}>{source}</span>
                  </div>
                  <motion.span
                    className="text-teal-400 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(20,184,166,0.1)",
                      border: "1px solid rgba(20,184,166,0.2)",
                      fontWeight: 600,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                  >
                    {jobCount} jobs
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
        </TiltCard>
      </div>
    </motion.div>
  );
}
