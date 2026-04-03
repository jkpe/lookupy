"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { toPng } from "html-to-image";

// ─── iPhone canvas & sizes ────────────────────────────────────────────────
const IPHONE_W = 1320;
const IPHONE_H = 2868;

const IPHONE_SIZES = [
  { label: '6.9" (1320×2868)', w: 1320, h: 2868 },
  { label: '6.5" (1284×2778)', w: 1284, h: 2778 },
  { label: '6.3" (1206×2622)', w: 1206, h: 2622 },
  { label: '6.1" (1125×2436)', w: 1125, h: 2436 },
] as const;

// ─── iPad canvas & sizes ──────────────────────────────────────────────────
const IPAD_W = 2064;
const IPAD_H = 2752;

const IPAD_SIZES = [
  { label: '13" iPad (2064×2752)', w: 2064, h: 2752 },
  { label: '12.9" iPad Pro (2048×2732)', w: 2048, h: 2732 },
] as const;

// ─── Phone mockup measurements ────────────────────────────────────────────
const MK_W = 1022;
const MK_H = 2082;
const SC_L = (52 / MK_W) * 100;
const SC_T = (46 / MK_H) * 100;
const SC_W = (918 / MK_W) * 100;
const SC_H = (1990 / MK_H) * 100;
const SC_RX = (126 / 918) * 100;
const SC_RY = (126 / 1990) * 100;

// ─── Brand tokens ─────────────────────────────────────────────────────────
const T = {
  bg: "#0a0b0f",
  surface: "#111318",
  border: "#1e2230",
  orange: "#f6821f",
  orangeGlow: "rgba(246,130,31,0.20)",
  orangeDim: "rgba(246,130,31,0.10)",
  text: "#e8eaf0",
  textDim: "#6b7280",
  textMid: "#9ca3af",
  green: "#10b981",
  blue: "#60a5fa",
  purple: "#a78bfa",
  yellow: "#fbbf24",
};

// ─── Phone Component ──────────────────────────────────────────────────────
function Phone({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  return (
    <div style={{ aspectRatio: `${MK_W}/${MK_H}`, position: "relative", ...style }}>
      <img src="/mockup.png" alt="" style={{ display: "block", width: "100%", height: "100%" }} draggable={false} />
      <div style={{
        position: "absolute", zIndex: 10, overflow: "hidden",
        left: `${SC_L}%`, top: `${SC_T}%`,
        width: `${SC_W}%`, height: `${SC_H}%`,
        borderRadius: `${SC_RX}% / ${SC_RY}%`,
      }}>
        <img src={src} alt={alt}
          style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
          draggable={false} />
      </div>
    </div>
  );
}

// ─── IPad Component (CSS-only frame) ─────────────────────────────────────
function IPad({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  return (
    <div style={{ aspectRatio: "770/1000", position: "relative", ...style }}>
      <div style={{
        width: "100%", height: "100%",
        borderRadius: "5% / 3.6%",
        background: "linear-gradient(180deg, #2C2C2E 0%, #1C1C1E 100%)",
        position: "relative", overflow: "hidden",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px rgba(0,0,0,0.6)",
      }}>
        {/* Front camera */}
        <div style={{
          position: "absolute", top: "1.2%", left: "50%",
          transform: "translateX(-50%)", width: "0.9%", height: "0.65%",
          borderRadius: "50%", background: "#111113",
          border: "1px solid rgba(255,255,255,0.08)", zIndex: 20,
        }} />
        {/* Bezel highlight */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "5% / 3.6%",
          border: "1px solid rgba(255,255,255,0.06)",
          pointerEvents: "none", zIndex: 15,
        }} />
        {/* Screen */}
        <div style={{
          position: "absolute", left: "4%", top: "2.8%",
          width: "92%", height: "94.4%",
          borderRadius: "2.2% / 1.6%", overflow: "hidden", background: "#000",
        }}>
          <img src={src} alt={alt}
            style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            draggable={false} />
        </div>
      </div>
    </div>
  );
}

// ─── Shared decorative components ────────────────────────────────────────
function GlowOrb({ x, y, size = 600, color = T.orangeGlow }: {
  x: number; y: number; size?: number; color?: string;
}) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: size, height: size * 0.55,
      background: `radial-gradient(ellipse, ${color} 0%, transparent 70%)`,
      pointerEvents: "none",
      transform: "translate(-50%, -50%)",
    }} />
  );
}

function Grid() {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: `
        linear-gradient(rgba(246,130,31,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(246,130,31,0.025) 1px, transparent 1px)
      `,
      backgroundSize: "80px 80px",
    }} />
  );
}

function Caption({ label, headline, align = "center", cw }: {
  label: string; headline: React.ReactNode;
  align?: "center" | "left" | "right"; cw: number;
}) {
  return (
    <div style={{ textAlign: align, lineHeight: 1 }}>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: cw * 0.026, fontWeight: 600,
        letterSpacing: "0.12em", textTransform: "uppercase" as const,
        color: T.orange, marginBottom: cw * 0.02,
      }}>{label}</div>
      <div style={{ fontSize: cw * 0.092, fontWeight: 800, lineHeight: 1.0, color: T.text }}>
        {headline}
      </div>
    </div>
  );
}

function Pill({ children, accent = false, cw }: {
  children: React.ReactNode; accent?: boolean; cw: number;
}) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: `${cw * 0.018}px ${cw * 0.038}px`,
      borderRadius: cw * 0.025,
      border: `1.5px solid ${accent ? T.orange : T.border}`,
      background: accent ? T.orangeDim : T.surface,
      color: accent ? T.orange : T.textMid,
      fontSize: cw * 0.038, fontFamily: "var(--font-mono)",
      fontWeight: 600, letterSpacing: "0.04em",
    }}>{children}</span>
  );
}

function DnsBadge({ type, color, cw }: { type: string; color: string; cw: number }) {
  return (
    <div style={{
      padding: `${cw * 0.022}px ${cw * 0.05}px`,
      borderRadius: cw * 0.022,
      border: `1.5px solid ${color}`,
      background: `${color}18`, color,
      fontSize: cw * 0.052, fontFamily: "var(--font-mono)",
      fontWeight: 700, letterSpacing: "0.06em",
    }}>{type}</div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// iPHONE SLIDES
// ═══════════════════════════════════════════════════════════════════════════
const W = IPHONE_W;
const H = IPHONE_H;

function IPhoneSlide1() {
  return (
    <div style={{ width: W, height: H, background: T.bg, position: "relative", overflow: "hidden" }}>
      <Grid />
      <GlowOrb x={W * 0.5} y={-60} size={1000} color={T.orangeGlow} />
      <GlowOrb x={W * 0.5} y={H * 0.35} size={800} color="rgba(246,130,31,0.08)" />

      {/* Badge */}
      <div style={{
        position: "absolute", top: H * 0.09, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: W * 0.022,
        padding: `${W * 0.018}px ${W * 0.05}px`,
        borderRadius: W * 0.1, border: `1px solid ${T.border}`,
        background: T.surface, color: T.orange,
        fontSize: W * 0.032, fontFamily: "var(--font-mono)",
        fontWeight: 600, letterSpacing: "0.1em",
        textTransform: "uppercase" as const, whiteSpace: "nowrap" as const, zIndex: 10,
      }}>
        <span style={{
          width: W * 0.018, height: W * 0.018, borderRadius: "50%",
          background: T.orange, display: "inline-block",
          boxShadow: `0 0 ${W * 0.015}px ${T.orange}`,
        }} />
        DNS over HTTPS
      </div>

      <Phone src="/screenshots/home.png" alt="Lookupy home" style={{
        position: "absolute", bottom: 0, left: "50%",
        width: W * 0.84,
        transform: "translateX(-50%) translateY(2%)", zIndex: 5,
      }} />
    </div>
  );
}

function IPhoneSlide2() {
  return (
    <div style={{
      width: W, height: H,
      background: "linear-gradient(160deg, #0d0f16 0%, #0a0b0f 45%, #0b0d12 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <Grid />
      <GlowOrb x={W * 0.15} y={H * 0.22} size={700} color="rgba(16,185,129,0.12)" />
      <GlowOrb x={W * 0.85} y={H * 0.7} size={500} color="rgba(246,130,31,0.08)" />

      <div style={{ position: "absolute", top: H * 0.1, left: W * 0.1, right: W * 0.1, zIndex: 10 }}>
        <Caption label="Privacy" headline={<>Private<br />by default.</>} align="left" cw={W} />
        <div style={{ marginTop: W * 0.055, display: "flex", flexDirection: "column", gap: W * 0.028 }}>
          {[
            { icon: "🔒", text: "No query logs, ever" },
            { icon: "🚫", text: "No ads, no tracking" },
            { icon: "🔐", text: "Encrypted end-to-end" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: W * 0.03, fontSize: W * 0.042, color: T.textMid, fontWeight: 500 }}>
              <span style={{ fontSize: W * 0.044 }}>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: "absolute", top: H * 0.4, left: "50%",
        transform: "translateX(-50%)", zIndex: 8,
        display: "flex", flexDirection: "column", alignItems: "center", gap: W * 0.04,
      }}>
        <div style={{
          width: W * 0.42, height: W * 0.42, borderRadius: "50%",
          border: "2px solid rgba(16,185,129,0.25)",
          background: "rgba(16,185,129,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 ${W * 0.08}px rgba(16,185,129,0.15)`,
        }}>
          <div style={{
            width: W * 0.28, height: W * 0.28, borderRadius: "50%",
            border: "2px solid rgba(16,185,129,0.4)",
            background: "rgba(16,185,129,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: W * 0.14,
          }}>🔒</div>
        </div>
        <div style={{
          padding: `${W * 0.022}px ${W * 0.06}px`, borderRadius: W * 0.1,
          border: "1.5px solid rgba(16,185,129,0.35)",
          background: "rgba(16,185,129,0.08)", color: T.green,
          fontSize: W * 0.04, fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "0.08em",
        }}>DNS over HTTPS</div>
      </div>

      <Phone src="/screenshots/home.png" alt="Lookupy" style={{
        position: "absolute", bottom: 0, right: "-4%",
        width: W * 0.75, transform: "translateY(8%) rotate(3deg)", opacity: 0.75, zIndex: 5,
      }} />
    </div>
  );
}

function IPhoneSlide3() {
  const resolvers = [
    { name: "Cloudflare", ip: "1.1.1.1", color: T.orange, active: true },
    { name: "Google", ip: "8.8.8.8", color: T.blue, active: false },
    { name: "Custom", ip: "yours", color: T.purple, active: false },
  ];
  return (
    <div style={{ width: W, height: H, background: T.bg, position: "relative", overflow: "hidden" }}>
      <Grid />
      <GlowOrb x={W * 0.5} y={H * 0.12} size={900} color={T.orangeGlow} />

      <div style={{ position: "absolute", top: H * 0.09, left: W * 0.1, right: W * 0.1, zIndex: 10 }}>
        <Caption label="Resolver" headline={<>Your resolver,<br />your choice.</>} align="left" cw={W} />
      </div>

      <div style={{
        position: "absolute", top: H * 0.33, left: W * 0.1, right: W * 0.1,
        display: "flex", flexDirection: "column", gap: W * 0.035, zIndex: 10,
      }}>
        {resolvers.map(r => (
          <div key={r.name} style={{
            padding: `${W * 0.042}px ${W * 0.055}px`, borderRadius: W * 0.03,
            border: `1.5px solid ${r.active ? r.color : T.border}`,
            background: r.active ? `${r.color}12` : T.surface,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: W * 0.048, fontWeight: 700, color: r.active ? r.color : T.text, marginBottom: W * 0.01 }}>{r.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: W * 0.036, color: r.active ? r.color : T.textDim, opacity: r.active ? 0.9 : 0.7 }}>{r.ip}</div>
            </div>
            {r.active && <div style={{ width: W * 0.055, height: W * 0.055, borderRadius: "50%", background: r.color, boxShadow: `0 0 ${W * 0.025}px ${r.color}` }} />}
          </div>
        ))}
      </div>

      <Phone src="/screenshots/home.png" alt="Lookupy resolvers" style={{
        position: "absolute", bottom: 0, left: "50%",
        width: W * 0.82, transform: "translateX(-50%) translateY(14%)", zIndex: 5,
      }} />
    </div>
  );
}

function IPhoneSlide4() {
  return (
    <div style={{
      width: W, height: H,
      background: "linear-gradient(170deg, #0c0e18 0%, #0a0b0f 60%)",
      position: "relative", overflow: "hidden",
    }}>
      <Grid />
      <GlowOrb x={W * 0.85} y={H * 0.1} size={600} color="rgba(96,165,250,0.12)" />
      <GlowOrb x={W * 0.1} y={H * 0.55} size={500} color="rgba(167,139,250,0.1)" />

      <div style={{ position: "absolute", top: H * 0.09, left: W * 0.1, right: W * 0.1, zIndex: 10 }}>
        <Caption label="Power users" headline={<>Raw JSON,<br />when you<br />need it.</>} align="right" cw={W} />
      </div>

      <div style={{
        position: "absolute", top: H * 0.42, left: W * 0.08, right: W * 0.08,
        padding: W * 0.05, borderRadius: W * 0.028,
        border: `1px solid ${T.border}`, background: T.surface,
        fontFamily: "var(--font-mono)", fontSize: W * 0.034, lineHeight: 1.65,
        zIndex: 10, overflow: "hidden",
      }}>
        <div style={{ color: T.textDim, marginBottom: W * 0.02 }}>// example.com A → 1.1.1.1</div>
        <div><span style={{ color: T.textDim }}>{"{"}</span></div>
        <div style={{ paddingLeft: W * 0.04 }}>
          <span style={{ color: T.blue }}>&quot;Status&quot;</span><span style={{ color: T.textDim }}>: </span><span style={{ color: T.yellow }}>0</span><span style={{ color: T.textDim }}>,</span>
        </div>
        <div style={{ paddingLeft: W * 0.04 }}>
          <span style={{ color: T.blue }}>&quot;Answer&quot;</span><span style={{ color: T.textDim }}>: [{"{"}</span>
        </div>
        <div style={{ paddingLeft: W * 0.08 }}>
          <span style={{ color: T.blue }}>&quot;data&quot;</span><span style={{ color: T.textDim }}>: </span><span style={{ color: T.green }}>&quot;104.18.26.120&quot;</span>
        </div>
        <div style={{ paddingLeft: W * 0.04 }}><span style={{ color: T.textDim }}>{"  }]"}</span></div>
        <div><span style={{ color: T.textDim }}>{"}"}</span></div>
      </div>

      <Phone src="/screenshots/home.png" alt="Lookupy" style={{
        position: "absolute", bottom: 0, left: "-8%",
        width: W * 0.65, transform: "translateY(6%) rotate(-5deg)", opacity: 0.45, zIndex: 4,
      }} />
      <Phone src="/screenshots/json.png" alt="Lookupy JSON" style={{
        position: "absolute", bottom: 0, right: "-4%",
        width: W * 0.8, transform: "translateY(8%) rotate(2deg)", zIndex: 5,
      }} />
    </div>
  );
}

function IPhoneSlide5() {
  const records = [
    { type: "A", color: T.orange }, { type: "AAAA", color: T.blue },
    { type: "CNAME", color: T.purple }, { type: "MX", color: T.green },
    { type: "TXT", color: T.yellow }, { type: "NS", color: T.orange },
    { type: "SOA", color: T.blue }, { type: "PTR", color: T.textMid },
    { type: "SRV", color: T.purple }, { type: "CAA", color: T.green },
  ];
  return (
    <div style={{ width: W, height: H, background: T.bg, position: "relative", overflow: "hidden" }}>
      <Grid />
      <GlowOrb x={W * 0.5} y={H * 0.08} size={900} color={T.orangeGlow} />
      <GlowOrb x={W * 0.2} y={H * 0.7} size={600} color="rgba(96,165,250,0.08)" />
      <GlowOrb x={W * 0.8} y={H * 0.55} size={500} color="rgba(167,139,250,0.08)" />

      <img src="/app-icon.png" alt="Lookupy" draggable={false} style={{
        position: "absolute", top: H * 0.1, left: "50%",
        transform: "translateX(-50%)",
        width: W * 0.2, height: W * 0.2, borderRadius: W * 0.044,
        display: "block", zIndex: 10,
      }} />

      <div style={{
        position: "absolute", top: H * 0.25, width: "100%",
        paddingLeft: W * 0.1, paddingRight: W * 0.1,
        zIndex: 10, textAlign: "center" as const,
      }}>
        <Caption label="Record types" headline={<>Every record<br />type. Covered.</>} align="center" cw={W} />
      </div>

      <div style={{
        position: "absolute", top: H * 0.46, left: W * 0.08, right: W * 0.08,
        display: "flex", flexWrap: "wrap" as const, gap: W * 0.028,
        justifyContent: "center", zIndex: 10,
      }}>
        {records.map(r => <DnsBadge key={r.type} type={r.type} color={r.color} cw={W} />)}
      </div>

      <div style={{
        position: "absolute", bottom: H * 0.08, left: W * 0.08, right: W * 0.08,
        display: "flex", flexWrap: "wrap" as const, gap: W * 0.022,
        justifyContent: "center", zIndex: 10,
      }}>
        <Pill accent cw={W}>DNS over HTTPS</Pill>
        <Pill cw={W}>No account needed</Pill>
        <Pill cw={W}>No ads</Pill>
        <Pill cw={W}>No tracking</Pill>
        <Pill cw={W}>JSON view</Pill>
        <Pill cw={W}>Custom resolvers</Pill>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// iPAD SLIDES
// ═══════════════════════════════════════════════════════════════════════════
const IW = IPAD_W;
const IH = IPAD_H;

function IPadSlide1() {
  return (
    <div style={{ width: IW, height: IH, background: T.bg, position: "relative", overflow: "hidden" }}>
      <Grid />
      <GlowOrb x={IW * 0.5} y={-80} size={1600} color={T.orangeGlow} />
      <GlowOrb x={IW * 0.5} y={IH * 0.4} size={1200} color="rgba(246,130,31,0.07)" />

      {/* Badge */}
      <div style={{
        position: "absolute", top: IH * 0.08, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: IW * 0.018,
        padding: `${IW * 0.014}px ${IW * 0.04}px`,
        borderRadius: IW * 0.1, border: `1px solid ${T.border}`,
        background: T.surface, color: T.orange,
        fontSize: IW * 0.026, fontFamily: "var(--font-mono)",
        fontWeight: 600, letterSpacing: "0.1em",
        textTransform: "uppercase" as const, whiteSpace: "nowrap" as const, zIndex: 10,
      }}>
        <span style={{
          width: IW * 0.014, height: IW * 0.014, borderRadius: "50%",
          background: T.orange, display: "inline-block",
          boxShadow: `0 0 ${IW * 0.012}px ${T.orange}`,
        }} />
        DNS over HTTPS
      </div>

      {/* iPad mockup — centered, large */}
      <IPad src="/screenshots-ipad/home.png" alt="Lookupy on iPad" style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        width: IW * 0.88,
        transform: "translateX(-50%) translateY(3%)",
        zIndex: 5,
      }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Registries
// ═══════════════════════════════════════════════════════════════════════════
const IPHONE_SLIDES = [
  { id: "01-hero", label: "Hero", Component: IPhoneSlide1, cw: IPHONE_W, ch: IPHONE_H },
  { id: "02-privacy", label: "Privacy", Component: IPhoneSlide2, cw: IPHONE_W, ch: IPHONE_H },
  { id: "03-resolver", label: "Resolver", Component: IPhoneSlide3, cw: IPHONE_W, ch: IPHONE_H },
  { id: "04-json", label: "JSON", Component: IPhoneSlide4, cw: IPHONE_W, ch: IPHONE_H },
  { id: "05-records", label: "Records", Component: IPhoneSlide5, cw: IPHONE_W, ch: IPHONE_H },
] as const;

const IPAD_SLIDES = [
  { id: "01-hero", label: "Hero", Component: IPadSlide1, cw: IPAD_W, ch: IPAD_H },
] as const;

type Device = "iphone" | "ipad";

// ═══════════════════════════════════════════════════════════════════════════
// ScreenshotPreview
// ═══════════════════════════════════════════════════════════════════════════
function ScreenshotPreview({ slide, index, onExport }: {
  slide: { id: string; label: string; Component: () => React.ReactElement; cw: number; ch: number };
  index: number;
  onExport: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.15);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / slide.cw));
    ro.observe(el);
    return () => ro.disconnect();
  }, [slide.cw]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        ref={containerRef}
        style={{
          position: "relative", width: "100%",
          height: slide.ch * scale || slide.ch * 0.15,
          cursor: "pointer", borderRadius: 12, overflow: "hidden",
          border: "1px solid #1e2230",
        }}
        onClick={() => onExport(index)}
        title="Click to export"
      >
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: slide.cw, height: slide.ch,
          transformOrigin: "top left", transform: `scale(${scale})`,
        }}>
          <slide.Component />
        </div>
      </div>
      <div style={{ textAlign: "center", color: "#6b7280", fontSize: 13, fontFamily: "monospace" }}>
        {String(index + 1).padStart(2, "0")} — {slide.label}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════════════════════════════════
export default function ScreenshotsPage() {
  const [device, setDevice] = useState<Device>("iphone");
  const [selectedSize, setSelectedSize] = useState(0);
  const [exporting, setExporting] = useState<string | null>(null);
  const exportRefs = useRef<Array<HTMLDivElement | null>>([]);

  const activeSlides = device === "ipad" ? IPAD_SLIDES : IPHONE_SLIDES;
  const activeSizes = device === "ipad" ? IPAD_SIZES : IPHONE_SIZES;

  // Reset size index when switching device
  const handleDeviceChange = (d: Device) => {
    setDevice(d);
    setSelectedSize(0);
  };

  const exportSlide = useCallback(async (index: number) => {
    const el = exportRefs.current[index];
    if (!el) return;
    const size = activeSizes[selectedSize];
    const slideId = activeSlides[index]?.id ?? String(index);
    setExporting(slideId);
    try {
      el.style.left = "0px"; el.style.opacity = "1"; el.style.zIndex = "-1";
      const opts = { width: size.w, height: size.h, pixelRatio: 1, cacheBust: true };
      await toPng(el, opts);
      const dataUrl = await toPng(el, opts);
      el.style.left = "-9999px"; el.style.opacity = ""; el.style.zIndex = "";
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${String(index + 1).padStart(2, "0")}-${slideId}-${device}-${size.w}x${size.h}.png`;
      a.click();
    } finally {
      el.style.left = "-9999px"; el.style.opacity = ""; el.style.zIndex = "";
      setExporting(null);
    }
  }, [selectedSize, activeSizes, activeSlides, device]);

  const exportAll = useCallback(async () => {
    const size = activeSizes[selectedSize];
    setExporting("all");
    for (let i = 0; i < activeSlides.length; i++) {
      const el = exportRefs.current[i];
      if (!el) continue;
      el.style.left = "0px"; el.style.opacity = "1"; el.style.zIndex = "-1";
      const opts = { width: size.w, height: size.h, pixelRatio: 1, cacheBust: true };
      await toPng(el, opts);
      const dataUrl = await toPng(el, opts);
      el.style.left = "-9999px"; el.style.opacity = ""; el.style.zIndex = "";
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${String(i + 1).padStart(2, "0")}-${activeSlides[i].id}-${device}-${size.w}x${size.h}.png`;
      a.click();
      await new Promise(r => setTimeout(r, 300));
    }
    setExporting(null);
  }, [selectedSize, activeSizes, activeSlides, device]);

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#e8eaf0" }}>
      {/* Toolbar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#0d0f15", borderBottom: "1px solid #1e2230",
        padding: "14px 24px", display: "flex", alignItems: "center",
        gap: 16, flexWrap: "wrap" as const,
      }}>
        <span style={{ fontWeight: 700, fontSize: 15, marginRight: 4 }}>Lookupy Screenshots</span>

        {/* Device toggle */}
        <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", border: "1px solid #1e2230" }}>
          {(["iphone", "ipad"] as Device[]).map(d => (
            <button key={d} onClick={() => handleDeviceChange(d)} style={{
              padding: "6px 16px", border: "none", cursor: "pointer",
              background: device === d ? "#f6821f" : "#111318",
              color: device === d ? "#fff" : "#9ca3af",
              fontSize: 13, fontWeight: 600, fontFamily: "inherit",
              textTransform: "capitalize" as const,
            }}>{d}</button>
          ))}
        </div>

        <select
          value={selectedSize}
          onChange={e => setSelectedSize(Number(e.target.value))}
          style={{
            background: "#111318", border: "1px solid #1e2230",
            color: "#e8eaf0", padding: "6px 12px",
            borderRadius: 6, fontSize: 13, fontFamily: "monospace",
          }}
        >
          {activeSizes.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
        </select>

        <button onClick={exportAll} disabled={!!exporting} style={{
          background: exporting ? "#1e2230" : "#f6821f",
          color: exporting ? "#6b7280" : "#fff",
          border: "none", padding: "8px 20px", borderRadius: 6,
          fontSize: 13, fontWeight: 700,
          cursor: exporting ? "not-allowed" : "pointer", fontFamily: "inherit",
        }}>
          {exporting === "all" ? "Exporting…" : "Export All"}
        </button>

        {exporting && exporting !== "all" && (
          <span style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>
            Exporting {exporting}…
          </span>
        )}
      </div>

      {/* Grid of previews */}
      <div style={{
        maxWidth: 1400, margin: "0 auto", padding: "32px 24px",
        display: "grid",
        gridTemplateColumns: device === "ipad"
          ? "repeat(auto-fill, minmax(320px, 1fr))"
          : "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 32,
      }}>
        {activeSlides.map((slide, i) => (
          <ScreenshotPreview key={`${device}-${slide.id}`} slide={slide} index={i} onExport={exportSlide} />
        ))}
      </div>

      {/* Offscreen export canvases */}
      <div style={{ position: "absolute", top: 0, left: "-9999px", opacity: 0 }}>
        {activeSlides.map((slide, i) => (
          <div
            key={`${device}-${slide.id}`}
            ref={el => { exportRefs.current[i] = el; }}
            style={{
              width: slide.cw, height: slide.ch,
              position: "absolute", left: "-9999px",
              fontFamily: "Syne, sans-serif",
            }}
          >
            <slide.Component />
          </div>
        ))}
      </div>
    </div>
  );
}
