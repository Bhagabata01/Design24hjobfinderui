import { useRef, useState, ReactNode } from "react";
import { motion } from "motion/react";

interface ScanlineCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tilt?: boolean;
  scanline?: boolean;
  cornerBrackets?: boolean;
  glowColor?: string;
}

export function ScanlineCard({
  children,
  className = "",
  style = {},
  tilt = true,
  scanline = true,
  cornerBrackets = false,
  glowColor = "rgba(20,184,166,0.15)",
}: ScanlineCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = ((e.clientX - cx) / (rect.width / 2)) * 5;
    const y = ((e.clientY - cy) / (rect.height / 2)) * -5;
    setRotation({ x: y, y: x });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setHovered(false);
  };

  const cornerStyle: React.CSSProperties = {
    position: "absolute",
    width: "14px",
    height: "14px",
    borderColor: "rgba(20,184,166,0.5)",
    borderStyle: "solid",
    transition: "border-color 0.3s",
    zIndex: 10,
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        ...style,
        transformStyle: "preserve-3d",
        transform: `perspective(900px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: hovered ? "transform 0.05s ease" : "transform 0.4s ease",
        boxShadow: hovered
          ? `${style.boxShadow ?? ""}, 0 0 30px ${glowColor}`
          : style.boxShadow,
      }}
      onMouseMove={(e) => {
        handleMouseMove(e);
        setHovered(true);
      }}
      onMouseLeave={handleMouseLeave}
    >
      {/* Scanline sweep */}
      {scanline && (
        <motion.div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            height: "60px",
            background: "linear-gradient(180deg, transparent 0%, rgba(20,184,166,0.04) 50%, transparent 100%)",
            zIndex: 5,
          }}
          animate={{ top: ["-60px", "110%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
        />
      )}

      {/* Corner brackets */}
      {cornerBrackets && (
        <>
          <span style={{ ...cornerStyle, top: 8, left: 8, borderWidth: "1px 0 0 1px" }} />
          <span style={{ ...cornerStyle, top: 8, right: 8, borderWidth: "1px 1px 0 0" }} />
          <span style={{ ...cornerStyle, bottom: 8, left: 8, borderWidth: "0 0 1px 1px" }} />
          <span style={{ ...cornerStyle, bottom: 8, right: 8, borderWidth: "0 1px 1px 0" }} />
        </>
      )}

      {children}
    </motion.div>
  );
}
