import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  Camera,
  ChevronDown,
  Crown,
  ExternalLink,
  Gift,
  Handshake,
  Heart,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

/**
 * EVEREST — Programa de Influenciadores (EVRST theme)
 * React + Tailwind + Framer Motion
 *
 * Dependências:
 *   npm i framer-motion lucide-react
 */

const BRAND = {
  name: "EVEREST",
  highlight: "Programa de Influenciadores",
  tagline: "Vem criar com a gente.",
  links: {
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/",
    email: "mailto:parcerias@everest.com",
    site: "https://example.com",
  },
};

// ✅ Link do formulário (Aplicar agora / Quero me cadastrar / Quero participar)
const APPLY_LINK =
  "https://script.google.com/macros/s/AKfycbwBWGl_wDSXWX6ZdhKg6bnb9EQj7jy4Owt6TUWzU-TH/dev";

// ===== EVRST THEME (dourado + preto, sem “risco” no fundo) =====
const EVRST = {
  gold: "#FFD100",
  gold2: "#FFB700",
  bg0: "#05060a",
  bg1: "#070A11",
};

const goldGrad = `linear-gradient(135deg, ${EVRST.gold}, ${EVRST.gold2})`;

// ✅ Carrossel com 3 creators locais:
// coloque os arquivos em /public: arthur.jpg, geysla.jpg, rayssa.jpg
const mockInfluencers = [
  {
    name: "Artur Zaltsman",
    handle: "@artur.zaltsman",
    city: "Guaratinguetá, SP",
    niche: "Lifestyle + Moda",
    reach: "45k",
    collabs: "12",
    photo: "/arthur.jpg",
    quote:
      "Com a Everest eu tenho liberdade criativa e um time que entrega de verdade. Parceria sólida!",
    social:
      "https://www.instagram.com/artur.zaltsman?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  },
  {
    name: "Geysla",
    handle: "@geymarins",
    city: "Vale do Paraíba, SP",
    niche: "Moda + Lifestyle",
    reach: "20k",
    collabs: "8",
    photo: "/geysla.jpg",
    quote:
      "Amei a parceria: liberdade pra criar, produto lindo e um suporte que realmente acompanha.",
    social:
      "https://www.instagram.com/geymarins?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  },
  {
    name: "Raissa",
    handle: "@raissa.everest",
    city: "Vale do Paraíba, SP",
    niche: "Street + Sneakers",
    reach: "15k",
    collabs: "10",
    photo: "/rayssa.jpg",
    quote:
      "Campanha bem organizada e resultado real. É parceria que dá gosto de fazer.",
    social:
      "https://www.instagram.com/raissa.everest?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  },
];

const testimonials = [
  {
    name: "Parceria com propósito",
    body:
      "O que mais me chamou atenção foi a organização: cronograma, kit, orientações e liberdade pra criar do meu jeito.",
    icon: Heart,
  },
  {
    name: "Produtos que vendem",
    body:
      "Quando o produto é bom, a audiência sente. E a Everest faz questão de manter padrão alto.",
    icon: Star,
  },
  {
    name: "Apoio do começo ao fim",
    body:
      "Não é só ‘manda post’. Tem suporte, acompanhamento e metas realistas. Parceria de verdade.",
    icon: Handshake,
  },
];

const faqs = [
  {
    q: "Preciso ter muitos seguidores para participar?",
    a: "Não. A gente valoriza consistência, qualidade e conexão com o público. Microinfluenciadores bem posicionados são super bem-vindos.",
  },
  {
    q: "Como funciona a remuneração?",
    a: "Depende do perfil e do modelo de parceria: permuta, fee por conteúdo ",
  },
  {
    q: "Quais plataformas vocês trabalham?",
    a: "Principalmente Instagram e TikTok, mas também avaliamos YouTube e outras, dependendo do formato e do público.",
  },
  {
    q: "Quanto tempo leva para receber uma resposta?",
    a: "Normalmente alguns dias úteis. Se seu perfil bater com campanhas em andamento, a gente entra em contato mais rápido.",
  },
];

// Motion presets
const easeOut = [0.21, 0.8, 0.2, 1];
const viewportOnce = { once: true, margin: "-90px" };

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, delay: i * 0.06, ease: easeOut },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.085, delayChildren: 0.06 } },
};

function cx(...xs) {
  return xs.filter(Boolean).join(" ");
}

function smoothScrollToHash(hash) {
  const id = (hash || "").replace("#", "");
  const el = document.getElementById(id);
  if (!el) return;

  const headerOffset = 84;
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top, behavior: "smooth" });
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids?.[0] ?? "top");

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      {
        root: null,
        rootMargin: "-40% 0px -55% 0px",
        threshold: [0.1, 0.2, 0.35, 0.5, 0.65],
      }
    );

    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids]);

  return active;
}

function useOnScreen(ref, options) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, options]);

  return isIntersecting;
}

// 👑 Coroinha rabiscada (no HERO, igual o print)
function CrownDoodle({ className = "" }) {
  return (
    <svg
      viewBox="0 0 120 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18 52 C35 60, 85 60, 102 52"
        stroke="rgb(255, 251, 0)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 52 L34 22 L52 44 L70 18 L86 44 L100 26 L102 52"
        stroke="rgb(255, 251, 0)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GradientBorderCard({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cx("relative rounded-3xl p-[1px]", className)}
    >
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-60"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,209,0,0.55), rgba(255,255,255,0.06), rgba(255,183,0,0.55))",
          backgroundSize: "220% 220%",
        }}
      />
      <div className="relative rounded-3xl border border-white/10 bg-zinc-950/40 backdrop-blur">
        {children}
      </div>
    </motion.div>
  );
}

function Pill({ icon: Icon, children }) {
  return (
    <motion.div
      variants={fadeUp}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-4 py-2 text-sm text-white/90 shadow-sm backdrop-blur"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="h-4 w-4" style={{ color: EVRST.gold }} />
      <span>{children}</span>
    </motion.div>
  );
}

function SectionTitle({ kicker, title, subtitle }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="mx-auto mb-10 max-w-2xl text-center"
    >
      {kicker ? (
        <motion.div
          variants={fadeUp}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-4 py-2 text-xs uppercase tracking-wider text-white/80 backdrop-blur"
        >
          <Sparkles className="h-4 w-4" style={{ color: EVRST.gold }} />
          {kicker}
        </motion.div>
      ) : null}

      <motion.h2
        variants={fadeUp}
        className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl"
      >
        {title}
      </motion.h2>

      {subtitle ? (
        <motion.p
          variants={fadeUp}
          className="mt-3 text-pretty text-base text-white/70 md:text-lg"
        >
          {subtitle}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function ShineButton({ children, className, style, ...props }) {
  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cx(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-3 text-sm font-semibold text-zinc-950 shadow-sm",
        className
      )}
      style={{ background: goldGrad, ...style }}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shine_1.15s_ease-in-out_infinite]" />
      </span>
      {children}
    </motion.a>
  );
}

function OutlineButton({ children, className, ...props }) {
  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/35 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur hover:bg-white/10",
        className
      )}
      {...props}
    >
      {children}
    </motion.a>
  );
}

function Magnetic({ children, className = "", ...props }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  function onMove(e) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * 0.15);
    y.set(dy * 0.15);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { x: sx, y: sy }}
      className={className}
      {...props}
    >
      {children}
    </motion.a>
  );
}

function AnimatedNumber({ value, label }) {
  const ref = useRef(null);
  const on = useOnScreen(ref, {
    root: null,
    threshold: 0.35,
    rootMargin: "-80px",
  });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!on) return;
    if (reduce) return setN(value);

    const start = performance.now();
    const duration = 900;

    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [on, reduce, value]);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-white/10 bg-zinc-950/35 p-4 backdrop-blur"
    >
      <div className="text-2xl font-semibold text-white">{n}</div>
      <div className="text-sm text-white/70">{label}</div>
    </motion.div>
  );
}

function Feature({ icon: Icon, title, body }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      whileHover={{ y: -6 }}
      className="rounded-2xl border border-white/10 bg-zinc-950/35 p-6 shadow-sm backdrop-blur"
    >
      <motion.div
        className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10"
        whileHover={{ rotate: 3, scale: 1.02 }}
      >
        <Icon className="h-5 w-5 text-white" />
      </motion.div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{body}</p>
    </motion.div>
  );
}

function InfluencerCard({ data }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      whileHover={{ y: -8, rotate: -0.25 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/35 shadow-sm backdrop-blur"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={data.photo}
          alt={data.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <div className="text-base font-semibold text-white">{data.name}</div>
            <div className="text-sm text-white/80">{data.handle}</div>
          </div>
          <a
            href={data.social}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-950/40 px-3 py-1 text-xs text-white/90 hover:bg-white/10"
          >
            <Instagram className="h-4 w-4" style={{ color: EVRST.gold }} />
            Ver
          </a>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-zinc-950/40 px-3 py-1 text-xs text-white/80">
            {data.niche}
          </span>
          <span className="rounded-full border border-white/10 bg-zinc-950/40 px-3 py-1 text-xs text-white/80">
            <MapPin
              className="mr-1 inline h-3.5 w-3.5"
              style={{ color: EVRST.gold }}
            />
            {data.city}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/35 p-4 backdrop-blur">
            <div className="text-2xl font-semibold text-white">{data.reach}</div>
            <div className="text-sm text-white/70">Alcance</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950/35 p-4 backdrop-blur">
            <div className="text-2xl font-semibold text-white">
              {data.collabs}
            </div>
            <div className="text-sm text-white/70">Collabs</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950/35 p-4 backdrop-blur">
            <div className="text-2xl font-semibold text-white">Reels</div>
            <div className="text-sm text-white/70">Formato</div>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/75">
          “{data.quote}”
        </p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="rounded-2xl border border-white/10 bg-zinc-950/35 p-5 backdrop-blur"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-base font-semibold text-white">{q}</span>
        <ChevronDown
          className={cx(
            "h-5 w-5 text-white/70 transition-transform",
            open ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-sm leading-relaxed text-white/70">{a}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function HeroTiltCard({ children }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rx = useSpring(mx, { stiffness: 180, damping: 22 });
  const ry = useSpring(my, { stiffness: 180, damping: 22 });

  function onMove(e) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    const tiltX = (0.5 - py) * 8;
    const tiltY = (px - 0.5) * 10;

    mx.set(tiltX);
    my.set(tiltY);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={
        reduce
          ? undefined
          : {
              transformStyle: "preserve-3d",
              rotateX: rx,
              rotateY: ry,
            }
      }
      className="relative"
    >
      <div
        className="absolute inset-0 -z-10 rounded-3xl blur-2xl"
        style={{ background: "rgba(255,209,0,.06)" }}
      />
      <div style={reduce ? undefined : { transform: "translateZ(18px)" }}>
        {children}
      </div>
    </motion.div>
  );
}

function Navbar({ activeId }) {
  const items = [
    { id: "por-que", label: "Por que a Everest" },
    { id: "beneficios", label: "Benefícios" },
    { id: "como-funciona", label: "Como funciona" },
    { id: "influenciadores", label: "Influenciadores" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollToHash("#top");
          }}
          className="flex items-center gap-3"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-white/10"
          >
            <div
              className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full border border-white/10 bg-zinc-950/50 backdrop-blur"
              title="EVRST"
            >
              <Crown className="h-3.5 w-3.5" style={{ color: EVRST.gold }} />
            </div>

            <ShieldCheck className="h-5 w-5 text-white" />
          </motion.div>

          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">
              {BRAND.name}
            </div>
            <div className="text-xs text-white/70">{BRAND.highlight}</div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          {items.map((it) => {
            const isActive = activeId === it.id;
            return (
              <a
                key={it.id}
                href={`#${it.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollToHash(`#${it.id}`);
                }}
                className={cx(
                  "relative pb-1 hover:text-white",
                  isActive ? "text-white" : "text-white/70"
                )}
              >
                {it.label}
                {isActive ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full"
                    style={{ background: goldGrad }}
                  />
                ) : null}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={BRAND.links.instagram}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-white/10 bg-zinc-950/35 px-4 py-2 text-sm text-white/80 hover:bg-white/10 md:inline-flex"
          >
            Instagram
          </a>

          <Magnetic
            href={APPLY_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-zinc-950 shadow-sm"
            style={{ background: goldGrad }}
          >
            Quero participar
            <ArrowRight className="h-4 w-4" />
          </Magnetic>
        </div>
      </div>
    </header>
  );
}

function DragCarousel({ children }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const compute = () => {
      const outerW = outer.getBoundingClientRect().width;
      const innerW = inner.scrollWidth;
      const left = Math.min(0, outerW - innerW);
      setConstraints({ left, right: 0 });
    };

    compute();

    const ro = new ResizeObserver(() => compute());
    ro.observe(outer);
    ro.observe(inner);

    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      ref={outerRef}
      className="cursor-grab overflow-hidden"
      whileTap={{ cursor: "grabbing" }}
    >
      <motion.div
        ref={innerRef}
        drag="x"
        dragElastic={0.08}
        dragConstraints={constraints}
        className="flex gap-4"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function EverestInfluencersLanding() {
  const reduce = useReducedMotion();

  const activeId = useActiveSection([
    "por-que",
    "beneficios",
    "como-funciona",
    "influenciadores",
    "faq",
  ]);

  const counters = useMemo(
    () => [
      { label: "Campanhas/mês", value: 8 },
      { label: "Creators ativos", value: 40 },
      { label: "Conteúdos/mês", value: 120 },
      { label: "Resposta (h)", value: 48 },
    ],
    []
  );

  // ✅ WhatsApp usando api.whatsapp.com (em vez de wa.me)
  const phone = "5512981858797";
  const msg =
    "Olá! Tenho interesse em participar do programa de embaixadores da Everest e gostaria de tirar algumas dúvidas sobre como funciona.";
  const link = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    msg
  )}`;

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });

  // Cursor glow
  const [cursor, setCursor] = useState({ x: -999, y: -999 });
  useEffect(() => {
    const isCoarse = window.matchMedia?.("(pointer: coarse)")?.matches;
    if (reduce || isCoarse) return;

    const onMove = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  return (
    <div
      className="relative min-h-screen text-white"
      style={{ backgroundColor: EVRST.bg0 }}
    >
      {/* keyframes (shimmer) */}
      <style>{`
        @keyframes shine { 
          0% { transform: translateX(-120%) skewX(-12deg); } 
          100% { transform: translateX(320%) skewX(-12deg); } 
        }
      `}</style>

      {/* Scroll progress */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left"
        style={{ scaleX: progress, background: goldGrad }}
      />

      {/* Cursor glow */}
      {!reduce ? (
        <motion.div
          className="pointer-events-none fixed z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: "rgba(255,209,0,.08)" }}
          animate={{ left: cursor.x, top: cursor.y }}
          transition={{ type: "spring", stiffness: 140, damping: 28 }}
        />
      ) : null}

      {/* Background — EVRST (sem risco/linhas) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: EVRST.bg0,
            backgroundImage: `
              radial-gradient(900px 620px at 12% 12%, rgba(255,209,0,.10), transparent 62%),
              radial-gradient(760px 560px at 88% 14%, rgba(255,209,0,.07), transparent 64%),
              radial-gradient(900px 620px at 52% 115%, rgba(255,183,0,.05), transparent 70%),
              linear-gradient(180deg, ${EVRST.bg0}, ${EVRST.bg1})
            `,
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='520' height='520' viewBox='0 0 520 520'%3E%3Cg fill='none' stroke='rgba(255,255,255,0.28)' stroke-width='22' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M110 150 L210 55 L310 150'/%3E%3Cpath d='M210 55 L210 275'/%3E%3Cpath d='M310 310 L410 210 L510 310'/%3E%3Cpath d='M410 210 L410 430'/%3E%3Cpath d='M55 395 L155 295 L255 395'/%3E%3Cpath d='M155 295 L155 515'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "560px 560px",
            backgroundPosition: "center",
            transform: "rotate(-18deg) scale(1.12)",
            filter: "blur(1px)",
          }}
        />

        <motion.div
          className="absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "rgba(255,209,0,.10)" }}
          animate={{ x: [0, 18, 0], y: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 top-40 h-96 w-96 rounded-full blur-3xl"
          style={{ background: "rgba(255,209,0,.08)" }}
          animate={{ x: [0, -16, 0], y: [0, 14, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full blur-3xl"
          style={{ background: "rgba(255,183,0,.06)" }}
          animate={{ x: [0, 12, 0], y: [0, -12, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Navbar activeId={activeId} />

      {/* Hero */}
      <main id="top" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={stagger} className="flex flex-wrap gap-2">
              <Pill icon={Users}>Parcerias reais</Pill>
              <Pill icon={BadgeCheck}>Briefing + liberdade criativa</Pill>
              <Pill icon={Gift}>Permuta + comissão</Pill>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-5xl leading-[1.05]"
            >
              <span className="block">
                <span className="inline-flex flex-wrap items-baseline gap-x-3">
                  <span>Seja um</span>

                  <span className="relative inline-block pt-3">
                    <CrownDoodle
                      className="
                        pointer-events-none absolute
                        left-2 top-0
                        translate-x-[10px] translate-y-[-22px]
                        h-[40px] w-[70px]
                        rotate-[-8deg] opacity-95
                        md:translate-x-[12px] md:translate-y-[-28px]
                        md:h-[48px] md:w-[84px]
                      "
                    />
                    <span>Embaixador</span>
                  </span>

                  <span className="hidden md:inline">Everest</span>
                </span>
              </span>

              <span className="block md:hidden">Everest</span>

              <span className="block text-white/70">Vem criar com a gente.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-pretty text-base leading-relaxed text-white/70 md:text-lg"
            >
              Se você cria conteúdo com verdade, tem uma comunidade engajada e
              quer parceria com uma marca que respeita creator, você está no
              lugar certo. Vamos construir campanhas, histórias e resultados
              juntos.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Magnetic
                href={APPLY_LINK}
                target="_blank"
                rel="noreferrer"
                className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-3 text-sm font-semibold text-zinc-950 hover:opacity-95"
                style={{ background: goldGrad }}
              >
                Aplicar agora <ArrowRight className="h-4 w-4" />
              </Magnetic>

              <OutlineButton
                href="#influenciadores"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollToHash("#influenciadores");
                }}
              >
                Ver creators <ExternalLink className="h-4 w-4" />
              </OutlineButton>
            </motion.div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {counters.map((s) => (
                <AnimatedNumber key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: easeOut, delay: 0.05 }}
            className="relative"
          >
            <HeroTiltCard>
              <GradientBorderCard>
                <div className="overflow-hidden rounded-3xl">
                  {/* ✅ AJUSTE: grid com 3 fotos (1 comprida em cima + 2 embaixo) */}
                  <div className="grid grid-cols-2 gap-0">
                    {/* Topo (comprida) */}
                    <motion.div
                      className="relative col-span-2 aspect-[16/9] overflow-hidden"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.75, delay: 0.08, ease: easeOut }}
                    >
                      <img
                        src="/arthur.jpg"
                        alt="Artur Zaltsman"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </motion.div>

                    {/* Inferior esquerda */}
                    <motion.div
                      className="relative aspect-square overflow-hidden"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.75, delay: 0.14, ease: easeOut }}
                    >
                      <img
                        src="/geysla.jpg"
                        alt="Geysla"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </motion.div>

                    {/* Inferior direita */}
                    <motion.div
                      className="relative aspect-square overflow-hidden"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.75, delay: 0.20, ease: easeOut }}
                    >
                      <img
                        src="/rayssa.jpg"
                        alt="Raissa"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </motion.div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-white/60">
                          {BRAND.name}
                        </div>
                        <div className="mt-1 text-lg font-semibold">
                          {BRAND.tagline}
                        </div>
                        <p className="mt-2 text-sm text-white/70">
                          Kits, cupons rastreáveis, campanhas sazonais e suporte
                          próximo — com estética e padrão.
                        </p>
                      </div>
                      <div className="hidden rounded-2xl border border-white/10 bg-zinc-950/35 p-3 text-xs text-white/70 md:block">
                        <div className="flex items-center gap-2">
                          <Calendar
                            className="h-4 w-4"
                            style={{ color: EVRST.gold }}
                          />
                          Próxima campanha
                        </div>
                        <div className="mt-2 text-base font-semibold text-white">
                          Semanal
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-3 py-1 text-xs text-white/80">
                        <Camera
                          className="h-3.5 w-3.5"
                          style={{ color: EVRST.gold }}
                        />{" "}
                        Reels + Stories
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-3 py-1 text-xs text-white/80">
                        <MessageCircle
                          className="h-3.5 w-3.5"
                          style={{ color: EVRST.gold }}
                        />{" "}
                        Conteúdo UGC
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-3 py-1 text-xs text-white/80">
                        <BadgeCheck
                          className="h-3.5 w-3.5"
                          style={{ color: EVRST.gold }}
                        />{" "}
                        Tracking + Cupom
                      </span>
                    </div>
                  </div>
                </div>
              </GradientBorderCard>
            </HeroTiltCard>
          </motion.div>
        </div>

        {/* Why */}
        <section id="por-que" className="mt-20">
          <SectionTitle
            kicker="Por que trabalhar com a gente"
            title="Uma marca que trata creator como parceiro"
            subtitle="Campanhas com organização, estética e liberdade — sem bagunça, sem promessa vazia."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid gap-4 md:grid-cols-3"
          >
            <Feature
              icon={BadgeCheck}
              title="Briefing claro"
              body="Objetivo, prazos e entregas definidos — pra você criar com confiança e evitar retrabalho."
            />
            <Feature
              icon={ShieldCheck}
              title="Parceria transparente"
              body="Modelo de remuneração combinado antes: permuta, fee e/ou comissão via cupom rastreável."
            />
            <Feature
              icon={Sparkles}
              title="Criatividade em primeiro lugar"
              body="A gente dá direção, mas a sua linguagem vem antes. Conteúdo autêntico performa melhor."
            />
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-8 grid gap-4 md:grid-cols-4"
          >
            <Feature
              icon={Users}
              title="Comunidade"
              body="Creators trocando ideia e crescendo juntos — networking que soma."
            />
            <Feature
              icon={Gift}
              title="Kits e lançamentos"
              body="Acesso a produtos e campanhas especiais para você testar antes e contar histórias reais."
            />
            <Feature
              icon={Star}
              title="Destaque no perfil"
              body="Os melhores conteúdos ganham repost e vitrine no nosso site/canais."
            />
            <Feature
              icon={Handshake}
              title="Longo prazo"
              body="Se encaixar, a parceria evolui: calendário, metas e recorrência."
            />
          </motion.div>
        </section>

        {/* Benefits */}
        <section id="beneficios" className="mt-20">
          <SectionTitle
            kicker="Benefícios"
            title="Você cria. A gente impulsiona."
            subtitle="Aqui vai o que você pode esperar do programa (e o que a gente espera de você também)."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid gap-4 md:grid-cols-2"
          >
            <GradientBorderCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold">O que você ganha</h3>
                <ul className="mt-4 space-y-3 text-sm text-white/75">
                  <li className="flex gap-3">
                    <BadgeCheck
                      className="mt-0.5 h-5 w-5"
                      style={{ color: EVRST.gold }}
                    />
                    <span>
                      Produtos para criação e acesso a lançamentos exclusivos.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Gift
                      className="mt-0.5 h-5 w-5"
                      style={{ color: EVRST.gold }}
                    />
                    <span>Acesso a benefícios exclusivos</span>
                  </li>
                  <li className="flex gap-3">
                    <Star
                      className="mt-0.5 h-5 w-5"
                      style={{ color: EVRST.gold }}
                    />
                    <span>
                      Destaque em campanhas, reposts e collabs com outros
                      creators.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Users
                      className="mt-0.5 h-5 w-5"
                      style={{ color: EVRST.gold }}
                    />
                    <span>
                      Relacionamento com time de marketing: feedback,
                      acompanhamento e evolução.
                    </span>
                  </li>
                </ul>
              </div>
            </GradientBorderCard>

            <GradientBorderCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold">O que a gente procura</h3>
                <ul className="mt-4 space-y-3 text-sm text-white/75">
                  <li className="flex gap-3">
                    <BadgeCheck
                      className="mt-0.5 h-5 w-5"
                      style={{ color: EVRST.gold }}
                    />
                    <span>
                      Consistência de postagem e linguagem alinhada com seu
                      público.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Camera
                      className="mt-0.5 h-5 w-5"
                      style={{ color: EVRST.gold }}
                    />
                    <span>
                      Qualidade mínima de vídeo/foto (não precisa ser perfeito —
                      precisa ser claro).
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Handshake
                      className="mt-0.5 h-5 w-5"
                      style={{ color: EVRST.gold }}
                    />
                    <span>Compromisso com prazos e comunicação direta.</span>
                  </li>
                  <li className="flex gap-3">
                    <Heart
                      className="mt-0.5 h-5 w-5"
                      style={{ color: EVRST.gold }}
                    />
                    <span>Conteúdo autêntico — sem personagem forçado.</span>
                  </li>
                </ul>
              </div>
            </GradientBorderCard>
          </motion.div>
        </section>

        {/* How it works */}
        <section id="como-funciona" className="mt-20">
          <SectionTitle
            kicker="Processo"
            title="Como funciona"
            subtitle="Simples, rápido e sem enrolação."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid gap-4 md:grid-cols-3"
          >
            {["Aplicação", "Onboarding", "Campanha"].map((t, i) => {
              const desc =
                i === 0
                  ? "Você manda seu perfil, nicho e cidade. A gente analisa encaixe com campanhas e público."
                  : i === 1
                  ? "Definimos o modelo (permuta/fee/comissão), combinamos entregas e enviamos kit quando necessário."
                  : "Conteúdo vai ao ar, acompanhamos métricas e evoluímos a parceria com base em resultado.";

              return (
                <motion.div key={t} variants={fadeUp}>
                  <GradientBorderCard>
                    <div className="p-6">
                      <div className="text-xs uppercase tracking-wider text-white/60">
                        Passo 0{i + 1}
                      </div>
                      <h3 className="mt-2 text-lg font-semibold">{t}</h3>
                      <p className="mt-2 text-sm text-white/70">{desc}</p>
                    </div>
                  </GradientBorderCard>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-8"
          >
            <GradientBorderCard>
              <div className="p-6 md:p-7">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Quer participar da próxima campanha?
                    </h3>
                    <p className="mt-1 text-sm text-white/70">
                      Preencha o formulário e a gente te chama assim que tiver
                      uma ação que combine com você.
                    </p>
                  </div>

                  <ShineButton
                    href={APPLY_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl"
                  >
                    Quero me cadastrar <ArrowRight className="h-4 w-4" />
                  </ShineButton>
                </div>
              </div>
            </GradientBorderCard>
          </motion.div>
        </section>

        {/* Influencers */}
        <section id="influenciadores" className="mt-20">
          <SectionTitle
            kicker="Creators Everest"
            title="Quem já cria com a gente"
            subtitle="Creators que já estão no topo com a gente. Arraste pro lado."
          />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <DragCarousel>
              {mockInfluencers.map((p) => (
                <div key={p.handle} className="min-w-[320px] md:min-w-[420px]">
                  <InfluencerCard data={p} />
                </div>
              ))}
            </DragCarousel>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="mt-20">
          <SectionTitle
            kicker="O que falam"
            title="Depoimentos"
            subtitle="Parcerias de verdade são construídas com respeito, clareza e resultado."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid gap-4 md:grid-cols-3"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <GradientBorderCard>
                  <div className="p-6">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                      <t.icon
                        className="h-5 w-5"
                        style={{ color: EVRST.gold }}
                      />
                    </div>
                    <div className="text-lg font-semibold">{t.name}</div>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {t.body}
                    </p>
                  </div>
                </GradientBorderCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-20">
          <SectionTitle
            kicker="FAQ"
            title="Dúvidas frequentes"
            subtitle="Se ainda ficar alguma dúvida, chama no WhatsApp ou manda e-mail."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid gap-4 md:grid-cols-2"
          >
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
          >
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/35 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
            >
              Falar no WhatsApp
            </a>

            <a
              href={BRAND.links.email}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/35 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
            >
              <Mail className="h-4 w-4" style={{ color: EVRST.gold }} />
              Enviar e-mail
            </a>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="mt-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <GradientBorderCard>
              <div className="relative overflow-hidden p-8 md:p-10">
                <motion.div
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
                  style={{ background: "rgba(255,209,0,.08)" }}
                  animate={{ x: [0, -18, 0], y: [0, 10, 0] }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full blur-3xl"
                  style={{ background: "rgba(255,209,0,.07)" }}
                  animate={{ x: [0, 16, 0], y: [0, -12, 0] }}
                  transition={{
                    duration: 11,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative grid gap-6 md:grid-cols-2 md:items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-4 py-2 text-xs uppercase tracking-wider text-white/80">
                      <BadgeCheck
                        className="h-4 w-4"
                        style={{ color: EVRST.gold }}
                      />
                      Parceria com padrão
                    </div>
                    <h3 className="mt-4 text-balance text-2xl font-semibold tracking-tight md:text-3xl">
                      Pronto pra criar a próxima campanha com a Everest?
                    </h3>
                    <p className="mt-2 text-sm text-white/70 md:text-base">
                      Preencha o cadastro. Se o seu perfil combinar com o
                      momento, a gente te chama.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <ShineButton
                      href={APPLY_LINK}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl"
                    >
                      Aplicar agora <ArrowRight className="h-4 w-4" />
                    </ShineButton>

                    <OutlineButton
                      href={
                        "https://www.instagram.com/everestofc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Instagram
                        className="h-4 w-4"
                        style={{ color: EVRST.gold }}
                      />{" "}
                      Instagram
                    </OutlineButton>
                  </div>
                </div>
              </div>
            </GradientBorderCard>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold">{BRAND.name}</div>
              <div className="mt-1 text-sm text-white/60">
                {BRAND.highlight}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                href={"https://www.lojaseverest.com.br/"}
                target="_blank"
                rel="noreferrer"
              >
                Site <ExternalLink className="h-4 w-4" />
              </a>

              <a
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                href={
                  "https://www.instagram.com/everestofc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                }
                target="_blank"
                rel="noreferrer"
              >
                <Instagram className="h-4 w-4" style={{ color: EVRST.gold }} />{" "}
                Instagram
              </a>

              <a
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                href={`https://wa.me/5512981858797?text=${encodeURIComponent(
                  "Olá! Tenho interesse em participar do programa de embaixadores da Everest e gostaria de tirar algumas dúvidas sobre como funciona."
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle
                  className="h-4 w-4"
                  style={{ color: EVRST.gold }}
                />{" "}
                WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-6 text-xs text-white/50">
            © {new Date().getFullYear()} {BRAND.name}. Todos os direitos
            reservados.
          </div>
        </footer>
      </main>
    </div>
  );
}