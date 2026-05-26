const { createElement: h, useEffect, useMemo, useState } = React;
const motionApi = window.Motion || window.framerMotion || {};
const motion = motionApi.motion || new Proxy({}, { get: (_, tag) => tag });

const navItems = ["Home", "About", "Services", "Pricing", "Blog", "Contact"];
const phone = "0726559998";
const whatsapp = `https://wa.me/27${phone.slice(1)}?text=${encodeURIComponent("Hi LM Media Solutions, I would like to book a free consultation.")}`;

const icons = {
  design: "✦",
  video: "▶",
  carousel: "▦",
  deck: "▤",
  web: "⌁",
  seo: "⌕",
  social: "#",
  ux: "◎",
  retainer: "↻",
  beauty: "◇",
};

const services = [
  ["Graphic Design", "High-impact social posts, posters, menus, cards, and brand visuals built to convert.", icons.design],
  ["Video Editing", "Cinematic edits, reels, transitions, sound design, grading, and premium motion polish.", icons.video],
  ["Carousel Designs", "Scroll-stopping education and sales carousels for Instagram, LinkedIn, and campaigns.", icons.carousel],
  ["Presentation Design", "Investor-grade decks, business proposals, sales decks, and professional pitch visuals.", icons.deck],
  ["Website Design", "Responsive websites with luxury UI, lead capture, SEO foundations, and WhatsApp flows.", icons.web],
  ["SEO", "Technical optimization, search content, metadata, local SEO, and growth-focused visibility.", icons.seo],
  ["Social Media Management", "Content calendars, posting, community growth, analytics, and campaign direction.", icons.social],
  ["UX/UI Design", "Premium interfaces, conversion paths, dashboards, landing pages, and app-like experiences.", icons.ux],
  ["Monthly Retainers", "Long-term creative, SEO, content, and strategy support for consistent growth.", icons.retainer],
  ["Beauty Growth Packages", "Dedicated growth offers for salons, hairstylists, nail techs, spas, and barbers.", icons.beauty],
];

const pricingGroups = [
  {
    title: "Graphic Design Packages",
    kicker: "Premium poster-ready visual design",
    packages: [
      ["Basic Design", "R800", "/design", ["Social Media Post Design", "Flyer / Poster Design", "Business Card Design", "2 Revisions", "2-3 Days Delivery"]],
      ["Standard Design", "R1,500", "/design", ["Everything in Basic", "Logo Design", "Brochure / Menu Design", "5 Revisions", "3-5 Days Delivery"], true],
      ["Premium Design", "R2,500", "/design", ["Everything in Standard", "Brand Identity Kit", "Packaging Design", "Unlimited Revisions", "2-4 Days Delivery"]],
    ],
  },
  {
    title: "Video Editing Packages",
    kicker: "Cinematic edits for social and campaigns",
    packages: [
      ["Basic Edit", "R1,800", "", ["Up to 60 Seconds", "Basic Cuts & Transitions", "Background Music", "Text/Titles", "Color Correction", "1 Revision"]],
      ["Standard Edit", "R2,800", "", ["Up to 90 Seconds", "Advanced Transitions", "Sound Design", "Color Grading", "Text/Titles & Effects", "2 Revisions"], true],
      ["Premium Edit", "R4,500", "", ["Up to 3 Minutes", "Cinematic Editing", "Motion Graphics", "Advanced Effects", "Unlimited Revisions"]],
    ],
  },
  {
    title: "Carousel Design Packages",
    kicker: "Structured content that sells while educating",
    packages: [
      ["4 Slides", "R2,000", "", ["On-brand design", "Unlimited revisions", "High-quality graphics", "Professional layouts"]],
      ["6 Slides", "R3,000", "", ["On-brand design", "Unlimited revisions", "High-quality graphics", "Professional layouts"], true],
      ["9 Slides", "R4,000", "", ["On-brand design", "Unlimited revisions", "High-quality graphics", "Professional layouts"]],
    ],
  },
  {
    title: "Presentation Design Packages",
    kicker: "Boardroom-grade decks and pitch systems",
    packages: [
      ["Basic Presentation", "R2,000", "", ["Minimum 8 Slides", "Professional Layouts", "Modern Design", "2 Revisions"]],
      ["Standard Presentation", "R3,500-R4,000", "", ["12-15 Slides", "Branded Design", "Infographics", "Premium Graphics"], true],
      ["Premium Presentation", "R5,000+", "", ["Unlimited Slides", "Advanced Animations", "Investor Deck Quality", "Unlimited Revisions"]],
    ],
  },
  {
    title: "Website Design Packages",
    kicker: "Conversion-focused websites for modern brands",
    packages: [
      ["Basic Website", "R3,999", "", ["5 Page Website", "Mobile Responsive", "Basic SEO", "WhatsApp Integration", "Contact Form"]],
      ["Standard Website", "R6,999", "", ["Up to 8 Pages", "Advanced SEO", "Lead Capture Forms", "Social Media Integration", "Blog Setup"], true],
      ["Premium Website", "R9,999", "", ["Up to 12 Pages", "Premium UI/UX", "CRM Integration", "Advanced SEO", "Speed Optimization"]],
    ],
  },
  {
    title: "Monthly Retainer Packages",
    kicker: "Consistent execution for brands ready to grow",
    packages: [
      ["Content Starter", "R4,500", "/month", ["8 Social Media Posts", "2 Carousel Designs", "2 Edited Videos/Reels", "Monthly Content Calendar"]],
      ["Growth Package", "R8,500", "/month", ["12 Social Posts", "4 Carousel Designs", "4 Reels/Videos", "SEO Optimization", "Content Strategy"], true],
      ["Premium Brand Management", "R15,000+", "/month", ["Full Social Media Management", "20+ Designs Monthly", "8 Reels/Videos", "SEO Management", "Paid Ads Management", "Monthly Strategy Calls"]],
    ],
  },
  {
    title: "Beauty Business Growth Packages",
    kicker: "Growth systems for salons, stylists, nail techs, spas, and barbers",
    packages: [
      ["Starter", "R2,999", "/month", ["Social media starter kit", "Beauty-focused content direction", "WhatsApp inquiry support", "Monthly reporting"]],
      ["Growth", "R4,999", "/month", ["Campaign visuals", "Reels and carousel support", "Local visibility guidance", "Conversion-focused booking CTAs"], true],
      ["Premium", "R7,999", "/month", ["Full beauty brand management", "Premium content direction", "Lead generation strategy", "Monthly growth consultation"]],
    ],
  },
];

const posts = [
  ["Marketing", "How strategic content turns attention into qualified leads", "A practical growth lens for brands that need more than pretty posts."],
  ["SEO", "Local SEO moves South African businesses should prioritize", "Visibility compounds when your website, content, and search signals work together."],
  ["Branding", "Why premium visuals change buyer confidence", "Design is not decoration. It frames value before a customer reads the offer."],
  ["Social Media", "Reels, carousels, and campaigns: choosing the right content format", "A simple guide to matching content structure to business goals."],
  ["Business Growth", "The case for monthly retainers over once-off creative bursts", "Consistency, measurement, and iteration are where real brand momentum appears."],
  ["Website Tips", "What every high-converting service website needs above the fold", "Clarity, proof, offer framing, and frictionless next steps."],
];

function cx(...items) {
  return items.filter(Boolean).join(" ");
}

function Section({ id, children, className = "" }) {
  return h("section", { id, className: cx("shell py-16 md:py-24 reveal", className) }, children);
}

function Eyebrow({ children }) {
  return h("div", { className: "mb-4 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-200" }, children);
}

function CTAButton({ href, children, secondary }) {
  return h("a", { href, className: cx(secondary ? "btn-secondary" : "btn-primary", "px-5 py-3 text-sm") }, children);
}

function AnimatedCounter({ value, suffix = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 1200;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return h(React.Fragment, null, count, suffix);
}

function Navbar({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  const link = (item) =>
    h("button", {
      key: item,
      onClick: () => {
        setPage(item);
        setOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      className: cx("rounded-md px-3 py-2 text-sm font-bold transition", page === item ? "bg-blue-500/18 text-white shadow-[0_0_24px_rgba(0,123,255,.22)]" : "text-slate-300 hover:text-white"),
    }, item);

  return h("header", { className: "fixed inset-x-0 top-0 z-50 border-b border-blue-400/15 bg-[#050814]/78 backdrop-blur-xl" },
    h("nav", { className: "shell flex min-h-[74px] items-center justify-between gap-4" },
      h("button", { onClick: () => setPage("Home"), className: "flex items-center gap-3 text-left" },
        h("span", { className: "grid h-11 w-11 place-items-center rounded-lg bg-blue-500 text-lg font-black text-white shadow-[0_0_28px_rgba(0,123,255,.55)]" }, "LM"),
        h("span", null,
          h("span", { className: "block text-sm font-black uppercase tracking-[0.22em] text-white" }, "LM Media"),
          h("span", { className: "block text-xs font-semibold text-sky-200" }, "Strategize. Optimize. Grow.")
        )
      ),
      h("div", { className: "hidden items-center gap-1 lg:flex" }, navItems.map(link)),
      h("div", { className: "hidden items-center gap-2 lg:flex" },
        h("button", { onClick: () => setLight(!light), className: "icon-btn h-11 w-11 border border-blue-300/25 bg-white/5 text-sm", title: "Toggle theme" }, light ? "◐" : "●"),
        h(CTAButton, { href: whatsapp }, "Book Consultation")
      ),
      h("button", { onClick: () => setOpen(!open), className: "icon-btn h-11 w-11 border border-blue-300/25 bg-white/5 lg:hidden", "aria-label": "Open menu" }, open ? "×" : "☰")
    ),
    open && h("div", { className: "shell mb-4 grid gap-2 rounded-lg border border-blue-300/20 bg-[#07101f] p-3 lg:hidden" }, navItems.map(link), h(CTAButton, { href: whatsapp }, "Book Consultation"))
  );
}

function Hero({ setPage }) {
  return h("section", { className: "relative min-h-screen overflow-hidden pt-28" },
    h("div", { className: "noise" }),
    h("div", { className: "shell grid min-h-[calc(100vh-112px)] items-center gap-10 py-12 lg:grid-cols-[1.03fr_.97fr]" },
      h(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7 } },
        h(Eyebrow, null, "South African Premium Growth Agency"),
        h("h1", { className: "hero-title max-w-4xl text-6xl font-black uppercase leading-[0.88] tracking-normal md:text-8xl" },
          "Premium Digital ",
          h("span", { className: "blue-gradient" }, "Solutions"),
          " For Modern Businesses"
        ),
        h("p", { className: "mt-7 max-w-2xl text-lg font-medium leading-8 text-slate-300" },
          "LM Media Solutions helps businesses grow through strategic content, websites, branding, SEO, video editing, and digital marketing."
        ),
        h("div", { className: "mobile-stack mt-8 flex flex-wrap gap-3" },
          h(CTAButton, { href: whatsapp }, "Book Free Consultation"),
          h("button", { onClick: () => setPage("Pricing"), className: "btn-secondary px-5 py-3 text-sm" }, "View Packages")
        ),
        h("div", { className: "mt-10 grid max-w-2xl grid-cols-3 gap-3" },
          [[10, "+", "Core Services"], [24, "/7", "WhatsApp Leads"], [100, "%", "Growth Focus"]].map(([n, s, l]) =>
            h("div", { key: l, className: "glass rounded-lg p-4" },
              h("div", { className: "text-2xl font-black text-white md:text-3xl" }, h(AnimatedCounter, { value: n, suffix: s })),
              h("div", { className: "mt-1 text-xs font-bold uppercase tracking-widest text-sky-200" }, l)
            )
          )
        )
      ),
      h("div", { className: "relative min-h-[540px]" },
        h("div", { className: "poster-card absolute left-2 top-8 w-[82%] rounded-lg p-5 md:left-10" },
          h("div", { className: "mb-5 flex items-center justify-between" },
            h("span", { className: "text-xs font-black uppercase tracking-[0.25em] text-sky-200" }, "Growth Dashboard"),
            h("span", { className: "rounded-full bg-blue-500 px-3 py-1 text-xs font-black text-white" }, "LIVE")
          ),
          h("div", { className: "grid grid-cols-3 gap-3" },
            [["Leads", "+62%"], ["Reach", "218K"], ["SEO", "Top 3"]].map(([a, b]) => h("div", { key: a, className: "rounded-lg border border-blue-300/20 bg-black/20 p-3" }, h("p", { className: "text-xs text-slate-400" }, a), h("strong", { className: "text-xl text-white" }, b)))
          ),
          h("div", { className: "mt-5 h-32 rounded-lg border border-blue-300/20 bg-[linear-gradient(135deg,rgba(0,123,255,.28),rgba(255,255,255,.04))] p-4" },
            h("div", { className: "h-full rounded-md bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.1)_0_1px,transparent_1px_38px)]" })
          )
        ),
        h("div", { className: "orbital right-0 top-2 w-48 rounded-lg p-4" }, h("div", { className: "text-xs font-black uppercase text-sky-200" }, "Social Launch"), h("div", { className: "mt-2 text-3xl font-black" }, "R8.5K"), h("p", { className: "mt-1 text-sm text-slate-300" }, "Growth Package")),
        h("div", { className: "orbital bottom-16 left-0 w-56 rounded-lg p-4" }, h("div", { className: "text-xs font-black uppercase text-sky-200" }, "Brand Identity"), h("div", { className: "mt-2 h-3 rounded bg-blue-400" }), h("div", { className: "mt-3 h-3 w-2/3 rounded bg-white/35" })),
        h("div", { className: "orbital bottom-4 right-8 w-64 rounded-lg p-4" }, h("div", { className: "text-xs font-black uppercase text-sky-200" }, "Website Funnel"), h("p", { className: "mt-2 text-sm text-slate-300" }, "SEO, forms, WhatsApp, CRM-ready conversion path."))
      )
    )
  );
}

function Services() {
  return h(Section, { id: "services" },
    h(Eyebrow, null, "Services"),
    h("div", { className: "mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end" },
      h("h2", { className: "max-w-3xl text-4xl font-black uppercase leading-none md:text-6xl" }, "Built Like A Poster. Engineered Like A Growth System."),
      h("p", { className: "max-w-md text-slate-300" }, "Each offer is packaged to look premium, sell clearly, and give prospects an obvious next move.")
    ),
    h("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3" },
      services.map(([title, desc, icon]) =>
        h("article", { key: title, className: "poster-card rounded-lg p-5 transition duration-300" },
          h("div", { className: "mb-5 flex items-center justify-between" },
            h("span", { className: "grid h-12 w-12 place-items-center rounded-lg border border-blue-300/30 bg-blue-500/10 text-2xl font-black text-sky-200" }, icon),
            h("span", { className: "text-xs font-black uppercase tracking-[0.22em] text-blue-200" }, "LM")
          ),
          h("h3", { className: "text-2xl font-black text-white" }, title),
          h("p", { className: "mt-3 min-h-20 text-sm leading-6 text-slate-300" }, desc),
          h("a", { href: whatsapp, className: "mt-5 inline-flex text-sm font-black text-sky-200" }, "Request Quote →")
        )
      )
    )
  );
}

function PriceCard({ item }) {
  const [name, price, suffix, features, popular] = item;
  return h("article", { className: cx("poster-card rounded-lg p-6 transition duration-300", popular && "border-sky-300/70 shadow-[0_0_46px_rgba(0,123,255,.28)]") },
    popular && h("div", { className: "mb-4 inline-flex rounded-full bg-blue-500 px-3 py-1 text-xs font-black uppercase tracking-widest text-white" }, "Most Popular"),
    h("h3", { className: "text-2xl font-black text-white" }, name),
    h("div", { className: "mt-4 flex items-end gap-1" },
      h("span", { className: "blue-gradient text-4xl font-black md:text-5xl" }, price),
      suffix && h("span", { className: "pb-2 text-sm font-bold text-slate-300" }, suffix)
    ),
    h("ul", { className: "mt-6 grid gap-3" }, features.map((feature) =>
      h("li", { key: feature, className: "flex gap-3 text-sm text-slate-200" },
        h("span", { className: "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded bg-blue-500/20 text-xs font-black text-sky-200" }, "✓"),
        h("span", null, feature)
      )
    )),
    h("a", { href: whatsapp, className: "btn-primary mt-7 w-full px-4 py-3 text-sm" }, "Get This Package")
  );
}

function Pricing() {
  return h(Section, { id: "pricing", className: "space-y-14" },
    h("div", null,
      h(Eyebrow, null, "Pricing"),
      h("h2", { className: "max-w-4xl text-4xl font-black uppercase leading-none md:text-6xl" }, "Premium Packages With Clear, Confident Offers."),
      h("p", { className: "mt-5 max-w-2xl text-slate-300" }, "Poster-inspired pricing sections with bold value hierarchy, glowing cards, and direct WhatsApp conversion paths.")
    ),
    pricingGroups.map((group) =>
      h("div", { key: group.title, className: "scroll-mt-28" },
        h("div", { className: "mb-5 flex flex-col justify-between gap-2 md:flex-row md:items-end" },
          h("div", null,
            h("p", { className: "text-xs font-black uppercase tracking-[0.24em] text-sky-200" }, group.kicker),
            h("h3", { className: "mt-2 text-3xl font-black uppercase text-white md:text-4xl" }, group.title)
          ),
          h("a", { href: whatsapp, className: "text-sm font-black text-sky-200" }, "Discuss custom scope →")
        ),
        h("div", { className: "pricing-grid" }, group.packages.map((pkg) => h(PriceCard, { key: pkg[0], item: pkg })))
      )
    ),
    h("div", { className: "poster-card rounded-lg p-8 md:p-10" },
      h("div", { className: "grid gap-6 md:grid-cols-[1fr_auto] md:items-center" },
        h("div", null,
          h("p", { className: "text-xs font-black uppercase tracking-[0.25em] text-sky-200" }, "Ready To Grow"),
          h("h3", { className: "mt-3 text-3xl font-black uppercase text-white md:text-5xl" }, "Book a free consultation and get a strategic recommendation."),
          h("p", { className: "mt-4 max-w-2xl text-slate-300" }, "Tell us your business goals, budget range, and current digital presence. We will point you to the right package or custom retainer.")
        ),
        h(CTAButton, { href: whatsapp }, "Start On WhatsApp")
      )
    )
  );
}

function About() {
  return h(Section, { id: "about" },
    h(Eyebrow, null, "About LM Media Solutions"),
    h("div", { className: "grid gap-8 lg:grid-cols-[.9fr_1.1fr]" },
      h("div", null,
        h("h2", { className: "text-4xl font-black uppercase leading-none md:text-6xl" }, "Strategic Creative Direction For Businesses That Want Momentum."),
        h("p", { className: "mt-6 text-lg leading-8 text-slate-300" }, "LM Media Solutions blends brand strategy, premium design, content execution, SEO, and conversion-focused websites into one growth partner for South African businesses."),
        h("p", { className: "mt-4 text-slate-300" }, "The mission is simple: make your business look credible, communicate clearly, and convert attention into real inquiries.")
      ),
      h("div", { className: "grid gap-4 md:grid-cols-2" },
        [["Mission", "Build digital assets that help businesses attract better leads and grow with confidence."], ["Vision", "Become a trusted premium growth partner for ambitious South African brands."], ["Positioning", "Corporate luxury, strategic clarity, measurable execution, and premium presentation."], ["Why Choose Us", "Design quality, offer structure, conversion thinking, and long-term growth support in one place."]].map(([title, copy]) =>
          h("div", { key: title, className: "poster-card rounded-lg p-6" }, h("h3", { className: "text-xl font-black text-white" }, title), h("p", { className: "mt-3 text-sm leading-6 text-slate-300" }, copy))
        )
      )
    )
  );
}

function Blog() {
  return h(Section, { id: "blog" },
    h(Eyebrow, null, "Insights"),
    h("h2", { className: "max-w-4xl text-4xl font-black uppercase leading-none md:text-6xl" }, "Marketing Intelligence For Modern Businesses."),
    h("div", { className: "mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3" },
      posts.map(([cat, title, desc], index) =>
        h("article", { key: title, className: cx("poster-card rounded-lg p-5 transition duration-300", index === 0 && "md:col-span-2 lg:col-span-2") },
          h("span", { className: "rounded-full border border-blue-300/25 bg-blue-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-sky-200" }, cat),
          h("h3", { className: "mt-5 text-2xl font-black text-white" }, title),
          h("p", { className: "mt-3 text-sm leading-6 text-slate-300" }, desc),
          h("button", { className: "mt-6 text-sm font-black text-sky-200" }, "Read Article →")
        )
      )
    )
  );
}

function Contact() {
  return h(Section, { id: "contact" },
    h(Eyebrow, null, "Contact"),
    h("div", { className: "grid gap-6 lg:grid-cols-[1fr_.85fr]" },
      h("div", null,
        h("h2", { className: "text-4xl font-black uppercase leading-none md:text-6xl" }, "Let’s Build Your Next Growth Move."),
        h("p", { className: "mt-5 max-w-2xl text-slate-300" }, "Send your goals, preferred package, and timeline. LM Media Solutions will respond with the best next step for your business."),
        h("form", { className: "mt-8 grid gap-4", onSubmit: (e) => e.preventDefault() },
          h("div", { className: "grid gap-4 md:grid-cols-2" },
            h("input", { className: "form-field", placeholder: "Full name", "aria-label": "Full name" }),
            h("input", { className: "form-field", placeholder: "Business name", "aria-label": "Business name" })
          ),
          h("div", { className: "grid gap-4 md:grid-cols-2" },
            h("input", { className: "form-field", placeholder: "Email address", type: "email", "aria-label": "Email address" }),
            h("input", { className: "form-field", placeholder: "Phone number", type: "tel", "aria-label": "Phone number" })
          ),
          h("select", { className: "form-field", "aria-label": "Interested service" },
            ["Website Design", "Social Media Management", "Graphic Design", "Video Editing", "SEO", "Monthly Retainer", "Beauty Growth Package", "Custom Strategy"].map((x) => h("option", { key: x }, x))
          ),
          h("textarea", { className: "form-field min-h-36", placeholder: "Tell us what you want to grow.", "aria-label": "Message" }),
          h("div", { className: "mobile-stack flex flex-wrap gap-3" },
            h("button", { className: "btn-primary px-5 py-3 text-sm", type: "submit" }, "Send Inquiry"),
            h(CTAButton, { href: whatsapp, secondary: true }, "Chat On WhatsApp")
          )
        )
      ),
      h("aside", { className: "poster-card rounded-lg p-6" },
        h("h3", { className: "text-2xl font-black text-white" }, "Contact Info"),
        h("div", { className: "mt-5 grid gap-4 text-sm text-slate-300" },
          h("p", null, h("strong", { className: "text-white" }, "Phone: "), phone),
          h("p", null, h("strong", { className: "text-white" }, "Email: "), "info@lmmediasolutions.co.za"),
          h("p", null, h("strong", { className: "text-white" }, "Email: "), "lehlohonolomaishoane@gmail.com"),
          h("p", null, h("strong", { className: "text-white" }, "Website: "), "lmmediasolutions.co.za")
        ),
        h("div", { className: "mt-6 overflow-hidden rounded-lg border border-blue-300/20" },
          h("iframe", {
            title: "South Africa map",
            src: "https://www.google.com/maps?q=South%20Africa&output=embed",
            className: "h-64 w-full",
            loading: "lazy",
          })
        ),
        h("div", { className: "mt-6 flex gap-3" }, ["IG", "FB", "IN", "TT"].map((s) => h("a", { key: s, href: "#", className: "grid h-11 w-11 place-items-center rounded-lg border border-blue-300/20 bg-blue-500/10 text-sm font-black text-sky-200" }, s)))
      )
    )
  );
}

function Marquee() {
  const words = ["Brand Strategy", "SEO", "Websites", "Video Editing", "Social Media", "UX/UI", "Retainers", "Presentations"];
  return h("div", { className: "overflow-hidden border-y border-blue-300/15 bg-blue-500/5 py-4" },
    h("div", { className: "ticker flex w-max gap-10 text-sm font-black uppercase tracking-[0.25em] text-sky-200" },
      [...words, ...words, ...words, ...words].map((word, index) => h("span", { key: `${word}-${index}` }, word))
    )
  );
}

function Footer({ setPage }) {
  return h("footer", { className: "border-t border-blue-300/15 py-10" },
    h("div", { className: "shell flex flex-col justify-between gap-6 md:flex-row md:items-center" },
      h("div", null,
        h("div", { className: "text-lg font-black uppercase tracking-[0.18em] text-white" }, "LM Media Solutions"),
        h("p", { className: "mt-2 text-sm text-slate-400" }, "Strategize. Optimize. Grow.")
      ),
      h("div", { className: "flex flex-wrap gap-2" }, navItems.map((item) => h("button", { key: item, onClick: () => setPage(item), className: "rounded px-3 py-2 text-sm font-bold text-slate-300 hover:text-white" }, item)))
    )
  );
}

function FloatingCTA() {
  return h("div", { className: "fixed bottom-5 right-5 z-50 flex flex-col gap-3" },
    h("a", { href: whatsapp, className: "btn-primary h-14 w-14 rounded-full text-xl", "aria-label": "WhatsApp" }, "WA"),
    h("a", { href: "#top", className: "btn-secondary h-12 w-12 rounded-full text-lg", "aria-label": "Back to top" }, "↑")
  );
}

function HomePage({ setPage }) {
  return h(React.Fragment, null,
    h(Hero, { setPage }),
    h(Marquee),
    h(Services),
    h(About),
    h(Pricing),
    h(Blog),
    h(Contact)
  );
}

function Page({ page, setPage }) {
  if (page === "Home") return h(HomePage, { setPage });
  if (page === "About") return h(React.Fragment, null, h("div", { className: "pt-24" }), h(About), h(Services), h(Contact));
  if (page === "Services") return h(React.Fragment, null, h("div", { className: "pt-24" }), h(Services), h(Pricing), h(Contact));
  if (page === "Pricing") return h(React.Fragment, null, h("div", { className: "pt-24" }), h(Pricing), h(Contact));
  if (page === "Blog") return h(React.Fragment, null, h("div", { className: "pt-24" }), h(Blog), h(Contact));
  return h(React.Fragment, null, h("div", { className: "pt-24" }), h(Contact));
}

function App() {
  const [page, setPage] = useState("Home");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [page]);

  useEffect(() => {
    document.title = page === "Home" ? "LM Media Solutions | Strategize. Optimize. Grow." : `${page} | LM Media Solutions`;
  }, [page]);

  return h("div", { id: "top" },
    loading && h("div", { className: "fixed inset-0 z-[80] grid place-items-center bg-[#03050c]" },
      h("div", { className: "text-center" },
        h("div", { className: "mx-auto grid h-20 w-20 place-items-center rounded-lg bg-blue-500 text-2xl font-black text-white shadow-[0_0_48px_rgba(0,123,255,.7)]" }, "LM"),
        h("div", { className: "mt-5 text-xs font-black uppercase tracking-[0.35em] text-sky-200" }, "Loading Growth System")
      )
    ),
    h(Navbar, { page, setPage }),
    h(Page, { page, setPage }),
    h(Footer, { setPage }),
    h(FloatingCTA)
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App));
