import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
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
 * ✅ Ajustado para ficar MAIS LEVE no celular (sem perder beleza):
 * - Remove cursor glow (mouse tracking)
 * - Reduz blur/backdrop-blur no mobile (principal vilão de travadas)
 * - Carousel: no mobile vira scroll nativo com snap (super suave)
 * - Hovers/elevações desativados no mobile (touch não precisa)
 * - Imagens com decoding="async" e lazy/eager correto
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

// ===== EVRST THEME (dourado + preto) =====
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
    a: "Depende do perfil e do modelo de parceria: permuta, fee por conteúdo e/ou comissão via cupom rastreável.",
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

// Motion presets (mais leves)
const easeOut = [0.21, 0.8, 0.2, 1];
const viewportOnce = { once: true, margin: "-90px" };

// ✅ remove filter/blur (filter é caro)
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.04, ease: easeOut },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
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
        threshold: [0.15, 0.35, 0.55],
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

// ✅ detecta mobile para desligar blur/hover pesados
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const m = window.matchMedia?.(`(max-width: ${breakpoint - 1}px)`);
    if (!m) return;
    const onChange = () => setIsMobile(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, [breakpoint]);

  return isMobile;
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

// ✅ borda gradiente elegante sem animação infinita
function GradientBorderCard({ children, className = "", isMobile }) {
  return (
    <motion.div
      className={cx("relative rounded-3xl p-[1px]", className)}
      whileHover={isMobile ? undefined : { y: -3 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div
        className="absolute inset-0 rounded-3xl opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,209,0,0.55), rgba(255,255,255,0.06), rgba(255,183,0,0.55))",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0"
        whileHover={isMobile ? undefined : { opacity: 0.55 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,209,0,0.75), rgba(255,255,255,0.08), rgba(255,183,0,0.75))",
        }}
      />

      <div
        className={cx(
          "relative rounded-3xl border border-white/10 bg-zinc-950/40",
          isMobile ? "" : "backdrop-blur"
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}

function Pill({ icon: Icon, children, isMobile }) {
  return (
    <motion.div
      variants={fadeUp}
      className={cx(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-4 py-2 text-sm text-white/90 shadow-sm",
        isMobile ? "" : "backdrop-blur"
      )}
      whileHover={isMobile ? undefined : { y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="h-4 w-4" style={{ color: EVRST.gold }} />
      <span>{children}</span>
    </motion.div>
  );
}

function SectionTitle({ kicker, title, subtitle, isMobile }) {
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
          className={cx(
            "mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-4 py-2 text-xs uppercase tracking-wider text-white/80",
            isMobile ? "" : "backdrop-blur"
          )}
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

function ShineButton({ children, className, style, isMobile, ...props }) {
  return (
    <motion.a
      whileHover={isMobile ? undefined : { y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cx(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-3 text-sm font-semibold text-zinc-950 shadow-sm",
        className
      )}
      style={{ background: goldGrad, ...style }}
      {...props}
    >
      {/* Shine: só no hover, sem loop infinito */}
      {!isMobile ? (
        <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span
            className="absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{ animation: "shine 1.05s ease-in-out 1" }}
          />
        </span>
      ) : null}
      {children}
    </motion.a>
  );
}

function OutlineButton({ children, className, isMobile, ...props }) {
  return (
    <motion.a
      whileHover={isMobile ? undefined : { y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/35 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10",
        isMobile ? "" : "backdrop-blur",
        className
      )}
      {...props}
    >
      {children}
    </motion.a>
  );
}

function AnimatedNumber({ value, label, isMobile }) {
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
    const duration = 620;

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
      whileHover={isMobile ? undefined : { y: -1 }}
      className={cx(
        "rounded-2xl border border-white/10 bg-zinc-950/35 p-4",
        isMobile ? "" : "backdrop-blur"
      )}
    >
      <div className="text-2xl font-semibold text-white">{n}</div>
      <div className="text-sm text-white/70">{label}</div>
    </motion.div>
  );
}

function Feature({ icon: Icon, title, body, isMobile }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      whileHover={isMobile ? undefined : { y: -3 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cx(
        "rounded-2xl border border-white/10 bg-zinc-950/35 p-6 shadow-sm",
        isMobile ? "" : "backdrop-blur"
      )}
    >
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{body}</p>
    </motion.div>
  );
}

function InfluencerCard({ data, isMobile }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      whileHover={isMobile ? undefined : { y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cx(
        "group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/35 shadow-sm",
        isMobile ? "" : "backdrop-blur"
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={data.photo}
          alt={data.name}
          className={cx(
            "h-full w-full object-cover transition-transform duration-500",
            isMobile ? "" : "group-hover:scale-[1.04]"
          )}
          loading="lazy"
          decoding="async"
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
            <MapPin className="mr-1 inline h-3.5 w-3.5" style={{ color: EVRST.gold }} />
            {data.city}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className={cx("rounded-2xl border border-white/10 bg-zinc-950/35 p-4", isMobile ? "" : "backdrop-blur")}>
            <div className="text-2xl font-semibold text-white">{data.reach}</div>
            <div className="text-sm text-white/70">Alcance</div>
          </div>
          <div className={cx("rounded-2xl border border-white/10 bg-zinc-950/35 p-4", isMobile ? "" : "backdrop-blur")}>
            <div className="text-2xl font-semibold text-white">{data.collabs}</div>
            <div className="text-sm text-white/70">Collabs</div>
          </div>
          <div className={cx("rounded-2xl border border-white/10 bg-zinc-950/35 p-4", isMobile ? "" : "backdrop-blur")}>
            <div className="text-2xl font-semibold text-white">Reels</div>
            <div className="text-sm text-white/70">Formato</div>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/75">“{data.quote}”</p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a, isMobile }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={cx(
        "rounded-2xl border border-white/10 bg-zinc-950/35 p-5",
        isMobile ? "" : "backdrop-blur"
      )}
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
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-sm leading-relaxed text-white/70">{a}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

// ✅ shell do hero sem tilt 3D (mais leve)
function HeroCardShell({ children, isMobile }) {
  return (
    <div className="relative">
      {!isMobile ? (
        <div
          className="absolute inset-0 -z-10 rounded-3xl blur-2xl"
          style={{ background: "rgba(255,209,0,.06)" }}
        />
      ) : null}

      <motion.div
        whileHover={isMobile ? undefined : { y: -3 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function Navbar({ activeId, isMobile }) {
  const items = [
    { id: "por-que", label: "Por que a Everest" },
    { id: "beneficios", label: "Benefícios" },
    { id: "como-funciona", label: "Como funciona" },
    { id: "influenciadores", label: "Influenciadores" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <header className={cx("sticky top-0 z-40 border-b border-white/10 bg-zinc-950/70", isMobile ? "" : "backdrop-blur")}>
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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-white/10"
          >
            <div
              className={cx(
                "absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full border border-white/10 bg-zinc-950/50",
                isMobile ? "" : "backdrop-blur"
              )}
              title="EVRST"
            >
              <Crown className="h-3.5 w-3.5" style={{ color: EVRST.gold }} />
            </div>

            <ShieldCheck className="h-5 w-5 text-white" />
          </motion.div>

          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">{BRAND.name}</div>
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
            className={cx(
              "hidden rounded-full border border-white/10 bg-zinc-950/35 px-4 py-2 text-sm text-white/80 hover:bg-white/10 md:inline-flex",
              isMobile ? "" : "backdrop-blur"
            )}
          >
            Instagram
          </a>

          <motion.a
            href={APPLY_LINK}
            target="_blank"
            rel="noreferrer"
            whileHover={isMobile ? undefined : { y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-zinc-950 shadow-sm"
            style={{ background: goldGrad }}
          >
            Quero participar
            <ArrowRight className="h-4 w-4" />
          </motion.a>
        </div>
      </div>
    </header>
  );
}

// ✅ MOBILE: scroll nativo com snap (suave) / DESKTOP: drag framer
function DragCarousel({ children, isMobile }) {
  if (isMobile) {
    return (
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex gap-4 snap-x snap-mandatory">
          {React.Children.map(children, (child, idx) => (
            <div key={idx} className="snap-start">
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }

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
    <motion.div ref={outerRef} className="cursor-grab overflow-hidden" whileTap={{ cursor: "grabbing" }}>
      <motion.div
        ref={innerRef}
        drag="x"
        dragElastic={0.06}
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
  const isMobile = useIsMobile();

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

  // Scroll progress bar (leve)
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });

  return (
    <div className="relative min-h-screen text-white" style={{ backgroundColor: EVRST.bg0 }}>
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

      {/* Background — mais leve no mobile */}
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
          className="absolute inset-0 opacity-[0.05] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='520' height='520' viewBox='0 0 520 520'%3E%3Cg fill='none' stroke='rgba(255,255,255,0.28)' stroke-width='22' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M110 150 L210 55 L310 150'/%3E%3Cpath d='M210 55 L210 275'/%3E%3Cpath d='M310 310 L410 210 L510 310'/%3E%3Cpath d='M410 210 L410 430'/%3E%3Cpath d='M55 395 L155 295 L255 395'/%3E%3Cpath d='M155 295 L155 515'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "560px 560px",
            backgroundPosition: "center",
            transform: "rotate(-18deg) scale(1.12)",
            filter: isMobile ? "none" : "blur(0.5px)",
          }}
        />

        {/* ✅ glow bem leve (desliga no mobile) */}
        {!reduce && !isMobile ? (
          <motion.div
            className="absolute right-[-80px] top-40 h-80 w-80 rounded-full blur-3xl"
            style={{ background: "rgba(255,209,0,.07)" }}
            animate={{ x: [0, -10, 0], y: [0, 8, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}
      </div>

      <Navbar activeId={activeId} isMobile={isMobile} />

      {/* Hero */}
      <main id="top" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={stagger} className="flex flex-wrap gap-2">
              <Pill icon={Users} isMobile={isMobile}>Parcerias reais</Pill>
              <Pill icon={BadgeCheck} isMobile={isMobile}>Briefing + liberdade criativa</Pill>
              <Pill icon={Gift} isMobile={isMobile}>Permuta + comissão</Pill>
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

            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <motion.a
                href={APPLY_LINK}
                target="_blank"
                rel="noreferrer"
                whileHover={isMobile ? undefined : { y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-3 text-sm font-semibold text-zinc-950 hover:opacity-95"
                style={{ background: goldGrad }}
              >
                Aplicar agora <ArrowRight className="h-4 w-4" />
              </motion.a>

              <OutlineButton
                isMobile={isMobile}
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
                <AnimatedNumber key={s.label} label={s.label} value={s.value} isMobile={isMobile} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.03 }}
            className="relative"
          >
            <HeroCardShell isMobile={isMobile}>
              <GradientBorderCard isMobile={isMobile}>
                <div className="overflow-hidden rounded-3xl">
                  {/* ✅ grid com 3 fotos (1 comprida em cima + 2 embaixo) */}
                  <div className="grid grid-cols-2 gap-0">
                    {/* Topo (comprida) */}
                    <div className="relative col-span-2 aspect-[16/9] overflow-hidden">
                      <img
                        src="/arthur.jpg"
                        alt="Artur Zaltsman"
                        className={cx(
                          "h-full w-full object-cover transition-transform duration-500",
                          isMobile ? "" : "hover:scale-[1.04]"
                        )}
                        loading="eager"
                        fetchpriority="high"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </div>

                    {/* Inferior esquerda */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src="/geysla.jpg"
                        alt="Geysla"
                        className={cx(
                          "h-full w-full object-cover transition-transform duration-500",
                          isMobile ? "" : "hover:scale-[1.04]"
                        )}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </div>

                    {/* Inferior direita */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src="/rayssa.jpg"
                        alt="Raissa"
                        className={cx(
                          "h-full w-full object-cover transition-transform duration-500",
                          isMobile ? "" : "hover:scale-[1.04]"
                        )}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-white/60">
                          {BRAND.name}
                        </div>
                        <div className="mt-1 text-lg font-semibold">{BRAND.tagline}</div>
                        <p className="mt-2 text-sm text-white/70">
                          Kits, cupons rastreáveis, campanhas sazonais e suporte
                          próximo — com estética e padrão.
                        </p>
                      </div>
                      <div className={cx(
                        "hidden rounded-2xl border border-white/10 bg-zinc-950/35 p-3 text-xs text-white/70 md:block",
                        isMobile ? "" : "backdrop-blur"
                      )}>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" style={{ color: EVRST.gold }} />
                          Próxima campanha
                        </div>
                        <div className="mt-2 text-base font-semibold text-white">Semanal</div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className={cx(
                        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-3 py-1 text-xs text-white/80",
                        isMobile ? "" : "backdrop-blur"
                      )}>
                        <Camera className="h-3.5 w-3.5" style={{ color: EVRST.gold }} /> Reels + Stories
                      </span>
                      <span className={cx(
                        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-3 py-1 text-xs text-white/80",
                        isMobile ? "" : "backdrop-blur"
                      )}>
                        <MessageCircle className="h-3.5 w-3.5" style={{ color: EVRST.gold }} /> Conteúdo UGC
                      </span>
                      <span className={cx(
                        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-3 py-1 text-xs text-white/80",
                        isMobile ? "" : "backdrop-blur"
                      )}>
                        <BadgeCheck className="h-3.5 w-3.5" style={{ color: EVRST.gold }} /> Tracking + Cupom
                      </span>
                    </div>
                  </div>
                </div>
              </GradientBorderCard>
            </HeroCardShell>
          </motion.div>
        </div>

        {/* Why */}
        <section id="por-que" className="mt-20">
          <SectionTitle
            isMobile={isMobile}
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
              isMobile={isMobile}
              icon={BadgeCheck}
              title="Briefing claro"
              body="Objetivo, prazos e entregas definidos — pra você criar com confiança e evitar retrabalho."
            />
            <Feature
              isMobile={isMobile}
              icon={ShieldCheck}
              title="Parceria transparente"
              body="Modelo de remuneração combinado antes: permuta, fee e/ou comissão via cupom rastreável."
            />
            <Feature
              isMobile={isMobile}
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
            <Feature isMobile={isMobile} icon={Users} title="Comunidade" body="Creators trocando ideia e crescendo juntos — networking que soma." />
            <Feature isMobile={isMobile} icon={Gift} title="Kits e lançamentos" body="Acesso a produtos e campanhas especiais para você testar antes e contar histórias reais." />
            <Feature isMobile={isMobile} icon={Star} title="Destaque no perfil" body="Os melhores conteúdos ganham repost e vitrine no nosso site/canais." />
            <Feature isMobile={isMobile} icon={Handshake} title="Longo prazo" body="Se encaixar, a parceria evolui: calendário, metas e recorrência." />
          </motion.div>
        </section>

        {/* Benefits */}
        <section id="beneficios" className="mt-20">
          <SectionTitle
            isMobile={isMobile}
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
            <GradientBorderCard isMobile={isMobile}>
              <div className="p-6">
                <h3 className="text-lg font-semibold">O que você ganha</h3>
                <ul className="mt-4 space-y-3 text-sm text-white/75">
                  <li className="flex gap-3">
                    <BadgeCheck className="mt-0.5 h-5 w-5" style={{ color: EVRST.gold }} />
                    <span>Produtos para criação e acesso a lançamentos exclusivos.</span>
                  </li>
                  <li className="flex gap-3">
                    <Gift className="mt-0.5 h-5 w-5" style={{ color: EVRST.gold }} />
                    <span>Acesso a benefícios exclusivos</span>
                  </li>
                  <li className="flex gap-3">
                    <Star className="mt-0.5 h-5 w-5" style={{ color: EVRST.gold }} />
                    <span>Destaque em campanhas, reposts e collabs com outros creators.</span>
                  </li>
                  <li className="flex gap-3">
                    <Users className="mt-0.5 h-5 w-5" style={{ color: EVRST.gold }} />
                    <span>Relacionamento com time de marketing: feedback, acompanhamento e evolução.</span>
                  </li>
                </ul>
              </div>
            </GradientBorderCard>

            <GradientBorderCard isMobile={isMobile}>
              <div className="p-6">
                <h3 className="text-lg font-semibold">O que a gente procura</h3>
                <ul className="mt-4 space-y-3 text-sm text-white/75">
                  <li className="flex gap-3">
                    <BadgeCheck className="mt-0.5 h-5 w-5" style={{ color: EVRST.gold }} />
                    <span>Consistência de postagem e linguagem alinhada com seu público.</span>
                  </li>
                  <li className="flex gap-3">
                    <Camera className="mt-0.5 h-5 w-5" style={{ color: EVRST.gold }} />
                    <span>Qualidade mínima de vídeo/foto (não precisa ser perfeito — precisa ser claro).</span>
                  </li>
                  <li className="flex gap-3">
                    <Handshake className="mt-0.5 h-5 w-5" style={{ color: EVRST.gold }} />
                    <span>Compromisso com prazos e comunicação direta.</span>
                  </li>
                  <li className="flex gap-3">
                    <Heart className="mt-0.5 h-5 w-5" style={{ color: EVRST.gold }} />
                    <span>Conteúdo autêntico — sem personagem forçado.</span>
                  </li>
                </ul>
              </div>
            </GradientBorderCard>
          </motion.div>
        </section>

        {/* How it works */}
        <section id="como-funciona" className="mt-20">
          <SectionTitle isMobile={isMobile} kicker="Processo" title="Como funciona" subtitle="Simples, rápido e sem enrolação." />

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
                  <GradientBorderCard isMobile={isMobile}>
                    <div className="p-6">
                      <div className="text-xs uppercase tracking-wider text-white/60">Passo 0{i + 1}</div>
                      <h3 className="mt-2 text-lg font-semibold">{t}</h3>
                      <p className="mt-2 text-sm text-white/70">{desc}</p>
                    </div>
                  </GradientBorderCard>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mt-8">
            <GradientBorderCard isMobile={isMobile}>
              <div className="p-6 md:p-7">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Quer participar da próxima campanha?</h3>
                    <p className="mt-1 text-sm text-white/70">
                      Preencha o formulário e a gente te chama assim que tiver uma ação que combine com você.
                    </p>
                  </div>

                  <ShineButton
                    isMobile={isMobile}
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
            isMobile={isMobile}
            kicker="Creators Everest"
            title="Quem já cria com a gente"
            subtitle="Creators que já estão no topo com a gente. Arraste pro lado."
          />

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <DragCarousel isMobile={isMobile}>
              {mockInfluencers.map((p) => (
                <div key={p.handle} className="min-w-[320px] md:min-w-[420px]">
                  <InfluencerCard data={p} isMobile={isMobile} />
                </div>
              ))}
            </DragCarousel>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="mt-20">
          <SectionTitle
            isMobile={isMobile}
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
                <GradientBorderCard isMobile={isMobile}>
                  <div className="p-6">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                      <t.icon className="h-5 w-5" style={{ color: EVRST.gold }} />
                    </div>
                    <div className="text-lg font-semibold">{t.name}</div>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">{t.body}</p>
                  </div>
                </GradientBorderCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-20">
          <SectionTitle
            isMobile={isMobile}
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
              <FaqItem key={f.q} q={f.q} a={f.a} isMobile={isMobile} />
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
              className={cx(
                "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/35 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10",
                isMobile ? "" : "backdrop-blur"
              )}
            >
              Falar no WhatsApp
            </a>

            <a
              href={BRAND.links.email}
              className={cx(
                "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/35 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10",
                isMobile ? "" : "backdrop-blur"
              )}
            >
              <Mail className="h-4 w-4" style={{ color: EVRST.gold }} />
              Enviar e-mail
            </a>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="mt-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <GradientBorderCard isMobile={isMobile}>
              <div className="relative overflow-hidden p-8 md:p-10">
                <div className="relative grid gap-6 md:grid-cols-2 md:items-center">
                  <div>
                    <div className={cx(
                      "inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-4 py-2 text-xs uppercase tracking-wider text-white/80",
                      isMobile ? "" : "backdrop-blur"
                    )}>
                      <BadgeCheck className="h-4 w-4" style={{ color: EVRST.gold }} />
                      Parceria com padrão
                    </div>
                    <h3 className="mt-4 text-balance text-2xl font-semibold tracking-tight md:text-3xl">
                      Pronto pra criar a próxima campanha com a Everest?
                    </h3>
                    <p className="mt-2 text-sm text-white/70 md:text-base">
                      Preencha o cadastro. Se o seu perfil combinar com o momento, a gente te chama.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <ShineButton
                      isMobile={isMobile}
                      href={APPLY_LINK}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl"
                    >
                      Aplicar agora <ArrowRight className="h-4 w-4" />
                    </ShineButton>

                    <OutlineButton
                      isMobile={isMobile}
                      href={
                        "https://www.instagram.com/everestofc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Instagram className="h-4 w-4" style={{ color: EVRST.gold }} /> Instagram
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
              <div className="mt-1 text-sm text-white/60">{BRAND.highlight}</div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                className={cx(
                  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-4 py-2 text-sm text-white/80 hover:bg-white/10",
                  isMobile ? "" : "backdrop-blur"
                )}
                href={"https://www.lojaseverest.com.br/"}
                target="_blank"
                rel="noreferrer"
              >
                Site <ExternalLink className="h-4 w-4" />
              </a>

              <a
                className={cx(
                  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-4 py-2 text-sm text-white/80 hover:bg-white/10",
                  isMobile ? "" : "backdrop-blur"
                )}
                href={
                  "https://www.instagram.com/everestofc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                }
                target="_blank"
                rel="noreferrer"
              >
                <Instagram className="h-4 w-4" style={{ color: EVRST.gold }} /> Instagram
              </a>

              <a
                className={cx(
                  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/35 px-4 py-2 text-sm text-white/80 hover:bg-white/10",
                  isMobile ? "" : "backdrop-blur"
                )}
                href={`https://wa.me/5512981858797?text=${encodeURIComponent(msg)}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" style={{ color: EVRST.gold }} /> WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-6 text-xs text-white/50">
            © {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.
          </div>
        </footer>
      </main>
    </div>
  );
}