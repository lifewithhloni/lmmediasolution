const { createElement: h, useEffect, useMemo, useState } = React;
const motionApi = window.Motion || window.framerMotion || {};
const motion = motionApi.motion || new Proxy({}, { get: (_, tag) => tag });

const navItems = ["Home", "Services", "About", "Contact"];
const phone = "0726559998";
const whatsapp = `https://wa.me/27${phone.slice(1)}?text=${encodeURIComponent("Hi LM Media Solutions, I would like to book a free consultation.")}`;

function whatsappForPackage(category, name, price, suffix) {
  const message = `Hi LM Media Solutions, I would like to request the ${name} package under ${category} (${price}${suffix || ""}). Please send me the next steps.`;
  return `https://wa.me/27${phone.slice(1)}?text=${encodeURIComponent(message)}`;
}

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
  {
    category: "Marketing",
    title: "How Strategic Content Turns Attention Into Qualified Leads",
    description: "A practical growth lens for brands that need more than pretty posts.",
    keywords: "digital marketing strategy, lead generation, South African business growth",
    readTime: "4 min read",
    body: [
      "Strong digital marketing is not only about posting often. It is about creating a clear path from awareness to trust, then from trust to action. For South African businesses, strategic content helps potential customers understand what you offer, why it matters, and why your brand is the right choice.",
      "At LM Media Solutions, we see content as a business growth asset. A graphic design post should communicate value. A carousel should educate and move the buyer closer to a decision. A video should build confidence, answer objections, and make the next step feel simple.",
      "The best-performing content usually has three things: a clear audience, a specific problem, and a direct call to action. When your content is planned around customer intent, it can generate higher-quality leads through WhatsApp inquiries, website forms, consultation bookings, and monthly retainer opportunities.",
      "A premium brand needs premium communication. That means consistent visuals, sharp messaging, SEO-friendly website content, and campaigns designed around measurable business outcomes."
    ],
  },
  {
    category: "SEO",
    title: "Local SEO Moves South African Businesses Should Prioritize",
    description: "Visibility compounds when your website, content, and search signals work together.",
    keywords: "local SEO South Africa, Pretoria SEO, SEO optimization services",
    readTime: "5 min read",
    body: [
      "Local SEO helps customers find your business when they search for services near them. Whether you are a salon in Pretoria North, a corporate service provider, or a growing online brand, your search visibility can directly influence the number of qualified inquiries you receive.",
      "The first priority is clarity. Your website should clearly mention your services, your location, and the type of clients you serve. Search engines need structured signals, and customers need immediate confidence that they are in the right place.",
      "The next priority is useful content. Articles about website design, branding, social media management, beauty business growth, and digital marketing strategy help your business rank for relevant searches while proving expertise.",
      "Finally, make conversion easy. SEO traffic is only valuable if visitors can take action. That is why WhatsApp buttons, contact forms, fast-loading pages, and strong service pages matter. LM Media Solutions combines SEO optimization with conversion-focused website design so visibility can become real business growth."
    ],
  },
  {
    category: "Branding",
    title: "Why Premium Visuals Change Buyer Confidence",
    description: "Design is not decoration. It frames value before a customer reads the offer.",
    keywords: "premium branding, graphic design South Africa, brand identity design",
    readTime: "3 min read",
    body: [
      "Your visuals speak before your sales message does. When a potential customer lands on your website or social media profile, they quickly decide whether your business feels credible, professional, and worth contacting.",
      "Premium graphic design creates confidence. It tells customers that your business pays attention to detail, values quality, and understands presentation. This is especially important for service brands, beauty businesses, consultants, and companies competing in crowded digital spaces.",
      "A strong brand identity uses consistent typography, colors, layouts, image direction, and messaging. When everything feels connected, your business becomes easier to recognize and easier to trust.",
      "LM Media Solutions designs brand assets that feel modern, strategic, and conversion-focused. From social media designs to brand identity kits and packaging design, the goal is to make your offer look as valuable as it truly is."
    ],
  },
  {
    category: "Social Media",
    title: "Reels, Carousels, And Campaigns: Choosing The Right Content Format",
    description: "A simple guide to matching content structure to business goals.",
    keywords: "social media management, reels editing, carousel design services",
    readTime: "4 min read",
    body: [
      "Different content formats do different jobs. Reels are powerful for reach and visibility. Carousels are excellent for education, storytelling, and saving. Campaign graphics help create consistency around a launch, promotion, or monthly offer.",
      "The right format depends on the goal. If your business needs awareness, short-form video can help you reach new audiences quickly. If your audience needs more explanation before buying, carousel designs can break down your offer in a clear and persuasive way.",
      "For monthly growth, the best approach is usually a mix: social media posts for consistency, carousels for value, reels for reach, and strategic CTAs for inquiries.",
      "LM Media Solutions builds content systems that connect design, video editing, content calendars, and growth strategy. The result is a social media presence that looks premium and supports real business objectives."
    ],
  },
  {
    category: "Business Growth",
    title: "The Case For Monthly Retainers Over Once-Off Creative Bursts",
    description: "Consistency, measurement, and iteration are where real brand momentum appears.",
    keywords: "monthly marketing retainer, content strategy, business growth packages",
    readTime: "4 min read",
    body: [
      "Once-off designs can help with a single moment, but long-term growth usually needs consistency. A monthly marketing retainer gives your business regular content, strategic direction, and ongoing optimization.",
      "Retainers work because they create rhythm. Your audience sees your brand more often. Your messaging improves over time. Your visuals stay consistent. Your campaigns can be measured, refined, and strengthened month after month.",
      "For businesses that want serious digital growth, a retainer can combine social media management, carousel design, video editing, SEO optimization, paid ads, and monthly strategy calls.",
      "LM Media Solutions offers monthly retainer packages for brands that want a reliable creative and strategic partner. This is how businesses move from random posting to a professional growth system."
    ],
  },
  {
    category: "Website Tips",
    title: "What Every High-Converting Service Website Needs Above The Fold",
    description: "Clarity, proof, offer framing, and frictionless next steps.",
    keywords: "website design South Africa, high converting website, WhatsApp website integration",
    readTime: "5 min read",
    body: [
      "The first screen of your website has one job: make the visitor understand your value quickly and feel confident enough to continue. A high-converting service website should not make people search for what you do.",
      "Above the fold, your website needs a strong headline, a clear service promise, a short explanation, and an obvious call to action. For many South African businesses, WhatsApp integration is essential because it reduces friction and makes inquiries feel immediate.",
      "Your website should also communicate credibility. Premium design, strong typography, fast loading, mobile responsiveness, and clear service sections all help customers trust your business before they speak to you.",
      "LM Media Solutions builds websites with strategy, SEO, lead capture, and conversion flow in mind. The goal is not only to look good. The goal is to turn visitors into inquiries, consultations, and long-term clients."
    ],
  },
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

function Navbar({ page, setPage }) { const [open,setOpen]=useState(false); const links=[["Home","top"],["Services","services"],["About","about"],["Contact","contact"]]; return h("header",{className:"site-header"},h("nav",{className:"shell nav-inner","aria-label":"Main navigation"},h("a",{href:"#top",className:"brand-mark","aria-label":"LM Media Solutions home"},h("img",{src:"/assets/lm-media-solutions-logo.png",alt:"LM Media Solutions",className:"brand-logo"})),h("button",{className:"menu-toggle",onClick:()=>setOpen(!open),"aria-expanded":open,"aria-label":"Toggle navigation"},open?"Close":"Menu"),h("div",{className:cx("nav-links",open&&"nav-open")},links.map(([label,id])=>h("a",{key:id,href:"#"+id,onClick:()=>setOpen(false)},label))),h("a",{href:whatsapp,className:"btn-primary nav-cta"},"Start a Project"))) }

function Hero() { return h("section",{className:"hero-section shell",id:"top"},h("div",{className:"hero-copy reveal"},h("p",{className:"eyebrow"},"Independent creative studio · South Africa"),h("h1",{className:"hero-title"},"The design partner",h("br"),"for growing ",h("em",null,"businesses.")),h("p",{className:"hero-intro"},"We help ambitious businesses build stronger brands, digital experiences and marketing content through thoughtful design."),h("div",{className:"hero-actions"},h("a",{href:"#services",className:"btn-primary"},"Explore our services"),h("a",{href:whatsapp,className:"text-link"},"Start a project ",h("span",null,"↗"))),h("div",{className:"hero-index"},h("span",null,"LM MEDIA SOLUTIONS"),h("span",null,"DESIGN · DIGITAL · CONTENT"))),h("figure",{className:"hero-image reveal"},h("img",{src:"/assets/pexels-mikael-blomkvist-6476257.jpg",alt:"Creative team collaborating around a table in a design studio",fetchPriority:"high"}),h("figcaption",null,"Good work starts with good collaboration."))) }

function Services() { const groups=[["01","Brand & Graphic Design",["Graphic Design","Carousel Design","Presentation Design"]],["02","Digital Design",["Website Design","UX/UI Design"]],["03","Content & Social",["Video Editing","Social Media Management"]],["04","Growth",["SEO","Business Growth Packages"]]]; return h(Section,{id:"services",className:"services-section"},h("div",{className:"section-heading reveal"},h("p",{className:"eyebrow"},"What we do"),h("h2",null,"Clear thinking.",h("br"),h("em",null,"Considered design.")),h("p",{className:"section-note"},"A connected set of creative services, shaped around what your business needs next.")),h("div",{className:"service-list"},groups.map(([num,title,entries])=>h("article",{key:title,className:"service-row reveal"},h("span",{className:"service-number"},num),h("h3",null,title),h("ul",null,entries.map(item=>h("li",{key:item},item))),h("a",{href:whatsapp,"aria-label":"Ask about "+title},"↗"))))) }

function PriceCard({ item, category }) {
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
    h("a", { href: whatsappForPackage(category, name, price, suffix), className: "btn-primary mt-7 w-full px-4 py-3 text-sm" }, "Get This Package")
  );
}

function Pricing() {
  return h(Section, { id: "pricing", className: "space-y-14" },
    h("div", null,
      h(Eyebrow, null, "Pricing"),
      h("h2", { className: "max-w-4xl text-4xl font-black uppercase leading-none md:text-6xl" }, "Premium Packages With Clear, Confident Offers."),
      h("p", { className: "mt-5 max-w-2xl text-slate-300" }, "Clear, straightforward packages for common creative needs. We can also shape a scope around your business.")
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
        h("div", { className: "pricing-grid" }, group.packages.map((pkg) => h(PriceCard, { key: pkg[0], item: pkg, category: group.title })))
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

function About() { return h(Section,{id:"about",className:"about-section"},h("div",{className:"about-image reveal"},h("img",{src:"/assets/pexels-canvastudio-3194519.jpg",alt:"Creative team sharing ideas around a table",loading:"lazy"}),h("span",null,"A more thoughtful way to show up.")),h("div",{className:"about-copy reveal"},h("p",{className:"eyebrow"},"A creative partner"),h("h2",null,"Design that moves business ",h("em",null,"forward.")),h("p",{className:"about-lede"},"LM Media Solutions brings design, digital and marketing together to help businesses communicate clearly and present themselves professionally."),h("p",null,"We work alongside growing businesses to shape stronger identities, useful digital experiences and content with a clear purpose."),h("a",{href:whatsapp,className:"text-link"},"Let’s work together ",h("span",null,"↗")))) }
function Process() { const steps=[["01","Discover","We learn about your business, audience and the change you want to make."],["02","Design","We develop a clear visual direction and thoughtful creative."],["03","Build","We turn the approved direction into polished, practical deliverables."],["04","Grow","We keep improving your brand and digital presence as you move forward."]]; return h(Section,{id:"process",className:"process-section"},h("p",{className:"eyebrow"},"How we work"),h("h2",{className:"reveal"},"Good work is a ",h("em",null,"process.")),h("div",{className:"process-grid"},steps.map(([num,title,copy])=>h("article",{className:"process-step reveal",key:title},h("span",null,num),h("h3",null,title),h("p",null,copy))))) }

function ArticleModal({ post, onClose }) {
  useEffect(() => {
    if (!post) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [post, onClose]);

  if (!post) return null;

  return h("div", { className: "fixed inset-0 z-[90] overflow-y-auto bg-[#02050c]/88 px-4 py-8 backdrop-blur-xl", role: "dialog", "aria-modal": "true" },
    h("div", { className: "mx-auto max-w-3xl" },
      h("article", { className: "poster-card rounded-lg p-6 md:p-9" },
        h("div", { className: "mb-6 flex items-start justify-between gap-4" },
          h("div", null,
            h("span", { className: "rounded-full border border-blue-300/25 bg-blue-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-sky-200" }, post.category),
            h("p", { className: "mt-4 text-xs font-black uppercase tracking-[0.24em] text-slate-400" }, `${post.readTime} | ${post.keywords}`),
            h("h2", { className: "mt-4 text-3xl font-black uppercase leading-tight text-white md:text-5xl" }, post.title)
          ),
          h("button", { onClick: onClose, className: "icon-btn h-11 w-11 shrink-0 border border-blue-300/25 bg-white/5 text-xl", "aria-label": "Close article" }, "×")
        ),
        h("div", { className: "grid gap-5 text-base leading-8 text-slate-200" },
          post.body.map((paragraph) => h("p", { key: paragraph }, paragraph))
        ),
        h("div", { className: "mt-8 flex flex-wrap gap-3 border-t border-blue-300/15 pt-6" },
          h(CTAButton, { href: whatsapp }, "Book Free Consultation"),
          h(CTAButton, { href: "mailto:info@lmmediasolutions.co.za?subject=Website%20Article%20Inquiry", secondary: true }, "Email LM Media")
        )
      )
    )
  );
}

function Blog() {
  const [activePost, setActivePost] = useState(null);

  return h(Section, { id: "blog" },
    h(Eyebrow, null, "Articles"),
    h("h2", { className: "max-w-4xl text-4xl font-black uppercase leading-none md:text-6xl" }, "Marketing Intelligence For Modern Businesses."),
    h("p", { className: "mt-5 max-w-2xl text-slate-300" }, "Read practical articles on digital marketing, SEO, branding, website design, social media management, and business growth for South African brands."),
    h("div", { className: "mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3" },
      posts.map((post, index) =>
        h("article", { key: post.title, className: cx("poster-card rounded-lg p-5 transition duration-300", index === 0 && "md:col-span-2 lg:col-span-2") },
          h("div", { className: "flex flex-wrap items-center gap-2" },
            h("span", { className: "rounded-full border border-blue-300/25 bg-blue-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-sky-200" }, post.category),
            h("span", { className: "text-xs font-bold uppercase tracking-widest text-slate-400" }, post.readTime)
          ),
          h("h3", { className: "mt-5 text-2xl font-black text-white" }, post.title),
          h("p", { className: "mt-3 text-sm leading-6 text-slate-300" }, post.description),
          h("p", { className: "mt-4 text-xs font-bold uppercase tracking-[0.18em] text-sky-200/80" }, post.keywords),
          h("button", { onClick: () => setActivePost(post), className: "mt-6 text-sm font-black text-sky-200" }, "Read Article →")
        )
      )
    ),
    h(ArticleModal, { post: activePost, onClose: () => setActivePost(null) })
  );
}

function SocialIcon({ platform }) {
  if (platform === "Instagram") return h("svg",{viewBox:"0 0 24 24",className:"instagram","aria-hidden":"true"},h("rect",{x:"3",y:"3",width:"18",height:"18",rx:"5"}),h("circle",{cx:"12",cy:"12",r:"4"}),h("circle",{cx:"17.5",cy:"6.5",r:"1",className:"icon-fill"}));
  if (platform === "LinkedIn") return h("svg",{viewBox:"0 0 24 24",className:"linkedin","aria-hidden":"true"},h("path",{d:"M5 8.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM3 10h4v11H3zM10 10h4v1.7c.8-1.2 2-2 3.8-2 3 0 4.2 1.9 4.2 5.2V21h-4v-5.6c0-1.8-.5-2.9-2-2.9-1.6 0-2.3 1.1-2.3 3V21h-4z"}));
  return h("svg",{viewBox:"0 0 24 24",className:"facebook","aria-hidden":"true"},h("path",{d:"M13.5 21v-8h2.8l.4-3h-3.2V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a21 21 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8z"}));
}
function Contact() {
  const sendInquiry = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name") || "";
    const business = data.get("business") || "";
    const email = data.get("email") || "";
    const phoneNumber = data.get("phone") || "";
    const service = data.get("service") || "";
    const message = data.get("message") || "";
    const subject = `Website Inquiry - ${service || "LM Media Solutions"}`;
    const body = [
      "Hi LM Media Solutions,",
      "",
      "I would like to send an inquiry from the website.",
      "",
      `Full name: ${name}`,
      `Business name: ${business}`,
      `Email address: ${email}`,
      `Phone number: ${phoneNumber}`,
      `Interested service: ${service}`,
      "",
      "Message:",
      message,
    ].join("\n");

    window.location.href = `mailto:info@lmmediasolutions.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return h(Section, { id: "contact" },
    h(Eyebrow, null, "Contact"),
    h("div", { className: "grid gap-6 lg:grid-cols-[1fr_.85fr]" },
      h("div", null,
        h("h2", { className: "text-4xl font-black uppercase leading-none md:text-6xl" }, "Let’s Build Your Next Growth Move."),
        h("p", { className: "mt-5 max-w-2xl text-slate-300" }, "Send your goals, preferred package, and timeline. LM Media Solutions will respond with the best next step for your business."),
        h("form", { className: "mt-8 grid gap-4", onSubmit: sendInquiry },
          h("div", { className: "grid gap-4 md:grid-cols-2" },
            h("input", { className: "form-field", name: "name", placeholder: "Full name", "aria-label": "Full name", required: true }),
            h("input", { className: "form-field", name: "business", placeholder: "Business name", "aria-label": "Business name" })
          ),
          h("div", { className: "grid gap-4 md:grid-cols-2" },
            h("input", { className: "form-field", name: "email", placeholder: "Email address", type: "email", "aria-label": "Email address", required: true }),
            h("input", { className: "form-field", name: "phone", placeholder: "Phone number", type: "tel", "aria-label": "Phone number" })
          ),
          h("select", { className: "form-field", name: "service", "aria-label": "Interested service" },
            ["Website Design", "Social Media Management", "Graphic Design", "Video Editing", "SEO", "Monthly Retainer", "Beauty Growth Package", "Custom Strategy"].map((x) => h("option", { key: x }, x))
          ),
          h("textarea", { className: "form-field min-h-36", name: "message", placeholder: "Tell us what you want to grow.", "aria-label": "Message", required: true }),
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
            title: "Pretoria North, South Africa map",
            src: "https://www.google.com/maps?q=Pretoria%20North%2C%20South%20Africa&output=embed",
            className: "h-64 w-full",
            loading: "lazy",
          })
        ),
        h("div", { className: "social-links", "aria-label": "Social media" },
          [
            ["Facebook", "https://www.facebook.com/lm.media.solution"],
            ["Instagram", "https://www.instagram.com/lm_media_solutions/"],
            ["LinkedIn", "https://www.linkedin.com/company/lm-media-solutions/?viewAsMember=true"]
          ].map(([platform, href]) => h("a", { key: platform, href, target: "_blank", rel: "noreferrer", "aria-label": platform, title: platform }, h(SocialIcon, { platform })))
        )
      )
    )
  );
}

function Marquee() {
  const words = ["Graphic Design", "Carousel Design", "Presentation Design", "Website Design", "UX/UI Design", "Video Editing", "Social Media Management", "SEO", "Business Growth Packages"];
  return h("div", { className: "service-marquee" },
    h("div", { className: "service-ticker ticker flex w-max gap-10 text-sm font-black uppercase tracking-[0.25em]" },
      [...words, ...words, ...words, ...words].map((word, index) => h("span", { key: `${word}-${index}` }, word))
    )
  );
}

function Footer({ setPage }) { return h("footer",{className:"site-footer"},h("div",{className:"shell footer-top"},h("a",{href:"#top"},h("img",{src:"/assets/lm-media-solutions-logo.png",alt:"LM Media Solutions",className:"footer-logo"})),h("p",null,"The Design Partner for Growing Businesses."),h("div",{className:"footer-links"},[["Services","services"],["About","about"],["Process","process"],["Pricing","pricing"],["Articles","blog"],["Contact","contact"]].map(([label,id])=>h("a",{key:id,href:"#"+id},label)))),h("div",{className:"shell footer-bottom"},h("span",null,"© LM Media Solutions"),h("a",{href:"mailto:info@lmmediasolutions.co.za"},"info@lmmediasolutions.co.za"))) }

function FloatingCTA() {
  const scrollToCurrentTop = () => {
    const article = document.querySelector('[role="dialog"]');
    if (article) article.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return h("div", { className: "fixed bottom-5 right-5 z-[100] flex flex-col gap-3" },
    h("a", { href: whatsapp, className: "btn-primary h-14 w-14 rounded-full text-xl", "aria-label": "WhatsApp" }, "WA"),
    h("button", { type: "button", onClick: scrollToCurrentTop, className: "btn-secondary h-12 w-12 rounded-full text-lg scroll-top-button", "aria-label": "Scroll to top of current page" }, "↑")
  );
}

function HomePage({ setPage }) { return h(React.Fragment,null,h(Hero),h(Marquee),h(Services),h(Marquee),h(About),h(Process),h(Marquee),h(Pricing),h(Blog),h(Contact)) }

function Page({ page, setPage }) { return h(HomePage,{setPage}) }

function App() {
  const [page, setPage] = useState("Home");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
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
    document.title = page === "Home" ? "LM Media Solutions | The Design Partner for Growing Businesses" : `${page} | LM Media Solutions`;
  }, [page]);

  return h("div", { id: "top" },
    loading && h("div", { className: "loading-screen" },
      h("div",{className:"loading-lockup",role:"status","aria-label":"Loading LM Media Solutions"},h("img",{src:"/assets/lm-media-solutions-mark.png",alt:"",className:"loading-mark"}),h("span",{className:"loading-name"},"LM Media Solutions"),h("span",{className:"loading-track","aria-hidden":"true"},h("span",{className:"loading-progress"})))
    ),
    h(Navbar, { page, setPage }),
    h(Page, { page, setPage }),
    h(Footer, { setPage }),
    h(FloatingCTA)
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App));
