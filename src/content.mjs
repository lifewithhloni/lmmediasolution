// Central content for the LM Media Solutions website.
// Prices, packages, services and contact details live here only.
// Run `node scripts/build.mjs` after editing to regenerate the HTML pages.

export const site = {
  name: "LM Media Solutions",
  url: "https://lmmediasolutions.co.za",
  tagline: "The Design Partner for Growing Businesses.",
  category: "Business Branding & Development Studio",
  founder: "Lehlohonolo Thomas Maishoane",
  founded: "2023",
  logo: "/assets/lm-media-solutions-logo.png",
  location: "Pretoria North, Gauteng, South Africa",
  phone: "0615423918",
  phoneDisplay: "061 542 3918",
  phoneIntl: "+27615423918",
  emails: ["info@lmmediasolutions.co.za", "lehlohonolomaishoane@gmail.com"],
  whatsapp: "27615423918",
  social: [
    ["Facebook", "https://www.facebook.com/lm.media.solution"],
    ["Instagram", "https://www.instagram.com/lm_media_solutions/"],
    ["LinkedIn", "https://www.linkedin.com/company/lm-media-solutions/"],
  ],
  // Optional form backend (for example a Formspree form URL such as
  // https://formspree.io/f/xxxxxxx). Leave empty to use the email/WhatsApp fallback.
  formEndpoint: "",
};

export const nav = [
  ["Home", "/"],
  ["Services", "/services/"],
  ["Packages", "/packages/"],
  ["Website Design", "/website-design/"],
  ["Blog", "/blog/"],
  ["Who We Are", "/who-we-are/"],
  ["Contact", "/contact/"],
];

// Labels shown in the animated services divider.
export const dividerLabels = [
  "Brand Identity",
  "Graphic Design",
  "Company Profiles",
  "Corporate Presentations",
  "Pitch Decks",
  "Business Stationery",
  "Website Design",
  "Website Development",
  "Business Branding",
  "Digital Presence",
];

export const services = [
  {
    id: "brand-identity",
    title: "Brand Identity & Design",
    summary: "Give your business a professional identity.",
    items: [
      "Logo and brand identity design",
      "Brand guidelines and colour systems",
      "Business cards and corporate stationery",
      "Letterheads and email signatures",
      "Branded business documents and materials",
    ],
    cta: "Explore Brand Design",
  },
  {
    id: "business-documents",
    title: "Business Documents & Presentations",
    summary: "Help your business communicate its value professionally.",
    items: [
      "Company profile design",
      "Corporate presentations",
      "Investor presentations and pitch decks",
      "Business proposals",
      "Capability statements",
      "Tender document design and presentation support",
    ],
    cta: "Explore Business Documents",
  },
  {
    id: "website-design",
    title: "Digital Presence & Website Design",
    summary: "Give your business a professional home online.",
    items: [
      "Custom business website design and development",
      "Landing pages",
      "Website redesigns",
      "Service and portfolio-style websites for clients",
      "Domain and hosting setup assistance",
      "Business email setup assistance",
      "Website maintenance and updates",
    ],
    cta: "Explore Website Design",
    href: "/website-design/",
  },
  {
    id: "business-launch",
    title: "Business Launch & Brand Setup",
    summary: "Bring your business identity, documents and digital presence together.",
    items: [
      "New-business branding packages",
      "Brand refreshes for existing businesses",
      "Professional client-facing document setup",
      "Coordinated website and brand launches",
      "Business launch creative support",
    ],
    cta: "Explore Branding Packages",
    href: "/packages/",
  },
];

export const audiences = [
  {
    title: "Start & Establish",
    text: "For entrepreneurs, startups and small businesses that need professional branding and a digital presence from the ground up.",
    cta: "Explore Startup Packages",
    href: "/packages/#business-starter",
  },
  {
    title: "Elevate & Expand",
    text: "For established businesses, consultants, contractors and B2B suppliers looking to strengthen their brand presentation and pursue bigger opportunities.",
    cta: "Explore Corporate Services",
    href: "/services/#business-documents",
  },
];

export const brandingPackages = [
  {
    id: "business-starter",
    name: "Business Starter",
    price: "R2,499–R3,499",
    audience: "Entrepreneurs and newly established businesses.",
    positioning: "A professional starting point for a new business.",
    items: [
      "Logo and basic brand identity",
      "Business card design",
      "Professional letterhead",
      "Branded email signature",
    ],
  },
  {
    id: "professional-business",
    name: "Professional Business",
    price: "R7,999–R12,999",
    audience: "Businesses ready to improve their professional presentation.",
    positioning: "A coordinated branding and digital presence solution.",
    items: [
      "Brand identity and stationery",
      "Company profile",
      "Professional business website",
      "Branded email signature",
    ],
    featured: true,
  },
  {
    id: "corporate-ready",
    name: "Corporate Ready",
    price: "R14,999–R24,999+",
    audience: "Consultants, contractors, B2B suppliers and established businesses pursuing corporate opportunities.",
    positioning: "A comprehensive business presentation and digital presence solution.",
    items: [
      "Complete brand identity system",
      "Corporate company profile",
      "Capability statement",
      "Pitch deck or corporate presentation",
      "Professional website",
      "Business stationery suite",
    ],
  },
];

export const websitePackages = [
  {
    id: "bronze",
    name: "Bronze",
    price: "R3,499",
    audience: "Startups, freelancers and small businesses.",
    items: [
      "One-page scrolling website",
      "Customised design aligned with your brand",
      "Responsive desktop, tablet and mobile layouts",
      "About, services and contact sections",
      "WhatsApp click-to-chat button",
      "Contact form using a supported submission service",
      "Social media links",
      "Basic SEO titles and metadata",
      "Favicon and basic brand styling",
      "One revision round",
      "Basic functionality and responsive testing",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: "R7,999",
    audience: "Growing businesses and professional service providers.",
    includes: "Everything in Bronze, plus:",
    items: [
      "Up to five website pages",
      "Custom homepage and internal page layouts",
      "Individual service pages",
      "Portfolio or testimonials section for your own business, where relevant",
      "Google Analytics setup, subject to account access and applicable consent requirements",
      "Google Search Console setup",
      "SEO titles and meta descriptions",
      "Sitemap setup",
      "Basic image optimisation and performance checks",
      "Two revision rounds",
    ],
    featured: true,
  },
  {
    id: "gold",
    name: "Gold",
    price: "R14,999",
    audience: "Established businesses, consultants, corporate suppliers and companies pursuing larger opportunities.",
    includes: "Everything in Silver, plus:",
    items: [
      "Up to ten website pages",
      "More extensive custom layouts and visual treatments",
      "Expanded service and industry pages",
      "Agreed website copywriting for specified pages",
      "Portfolio, case study or project showcase",
      "Blog or news section with a manageable publishing workflow",
      "Advanced enquiry forms with agreed fields and routing",
      "One additional conversion-focused landing page",
      "Structured data where appropriate",
      "Performance, accessibility and broken-link checks",
      "One agreed third-party integration, subject to technical feasibility",
      "Three revision rounds",
      "Thirty days of post-launch bug fixes for the delivered scope",
    ],
  },
];

export const websiteExclusions = [
  "E-commerce",
  "Payment gateways",
  "Custom dashboards",
  "Authentication and complex databases",
  "Booking systems",
  "AI agents and advanced integrations",
  "Paid third-party subscriptions",
  "Ongoing maintenance outside the agreed support period",
];

// Recurring third-party costs are not part of any package price.
export const recurringCosts = [
  "Domain registration and renewal",
  "Website hosting",
  "Business email subscriptions (for example Google Workspace or Microsoft 365)",
  "Paid plugins, fonts, stock imagery or other third-party subscriptions",
];

export const pricingNote =
  "Prices are indicative ranges or starting prices for common requirements. Final pricing depends on the confirmed project scope and is agreed in writing before work begins.";

export const differentiators = [
  ["One creative partner", "Coordinated branding and digital presence from a single studio, so your identity, documents and website work together."],
  ["Tailored to your stage", "Solutions shaped around your business, your audience and where you are in your growth."],
  ["Clear scope", "Defined deliverables and project scope agreed before work begins."],
  ["Modern, custom websites", "Custom-designed, responsive websites built for your business rather than a generic template."],
  ["Quality-controlled development", "AI-assisted development supported by testing and quality control."],
  ["Consistent presentation", "One standard across business documents, stationery and digital touchpoints."],
];

export const process = [
  ["Tell us about your business", "Share your business, your goals and what you need to achieve."],
  ["Choose the right service", "We recommend the service or package that fits your stage and scope."],
  ["We design and build", "We create your brand assets, documents or website to the agreed scope."],
  ["Review and receive", "You review, request agreed revisions, approve and receive your completed deliverables."],
];

export const processNote =
  "Delivery timelines depend on project scope, content availability and client feedback. We confirm an estimated timeline once the scope is agreed.";

export const about = {
  heading: "Who We Are",
  subheading: "Business Branding. Professional Design. Digital Development.",
  paragraphs: [
    "LM Media Solutions is a Business Branding & Development Studio founded in 2023 by Lehlohonolo Thomas Maishoane, a professional graphic designer, web designer, and video editor.",
    "We help entrepreneurs and established businesses build and brand their businesses properly by creating the professional identity, business materials, and digital presence they need to operate with confidence and pursue new opportunities.",
    "Our services bring together brand identity and design, business documents and presentations, website design and development, and comprehensive business launch and branding packages. From logo design and corporate stationery to company profiles, presentations, and custom-built websites, we provide coordinated solutions that help businesses present themselves professionally and communicate their value effectively.",
    "Whether you're launching a new business, strengthening an existing brand, preparing to approach corporate clients, or establishing a stronger online presence, LM Media Solutions provides practical, tailored creative solutions aligned with your business goals.",
    "We believe professional branding is more than just having a good-looking logo. It's about building credibility, communicating clearly, and ensuring every part of your business presents a consistent and professional image.",
  ],
  mission:
    "Our mission is simple: to help businesses establish a strong professional identity, build a credible brand, and create a digital presence that supports their growth.",
  signoff: "LM Media Solutions — The Design Partner for Growing Businesses.",
};

export const enquiryServices = [
  "Business Starter package",
  "Professional Business package",
  "Corporate Ready package",
  "Bronze website",
  "Silver website",
  "Gold website",
  ...services.map((s) => s.title),
  "Not sure yet",
];

export const budgetRanges = [
  "Under R3,500",
  "R3,500–R8,000",
  "R8,000–R15,000",
  "R15,000–R25,000",
  "R25,000+",
  "Not sure yet",
];
