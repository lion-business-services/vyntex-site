/**
 * New Jersey local landing page content (EN/ES). Factual, no statistics,
 * no client results, no prices. Service-area towns are owner-approved.
 */

export const NJ_TOWNS = [
  "Northfield", "Egg Harbor Township", "Linwood", "Somers Point", "Pleasantville",
  "Atlantic City", "Galloway", "Absecon", "Mays Landing", "Hammonton",
  "Ocean City", "Cape May County",
] as const;

export const NJ_REGIONS = ["Atlantic County", "Cape May County", "South Jersey", "New Jersey"] as const;

export type LocalService = { name: string; text: string; href?: string };
export type LocalFaq = { q: string; a: string };
export type LocalCopy = {
  path: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  intro: string[];
  servicesHeading: string;
  services: LocalService[];
  whyHeading: string;
  why: string[];
  areaHeading: string;
  areaText: string;
  officeHeading: string;
  hoursLabel: string;
  hours: string;
  faqHeading: string;
  faq: LocalFaq[];
  cta: string;
};

export const NJ_COPY: Record<"en" | "es", LocalCopy> = {
  en: {
    path: "/new-jersey",
    title: "AI Automation, CRM, ERP and Websites for New Jersey Businesses",
    metaTitle: "AI Automation, CRM & ERP in New Jersey",
    description:
      "VYNTEX is a local technology company in Northfield, New Jersey. We set up CRM, ERP, custom project management, AI agents, websites and digital marketing for South Jersey businesses, in English and Spanish.",
    eyebrow: "Northfield, New Jersey",
    intro: [
      "VYNTEX is a technology company with an office at 331 Tilton Rd, Suite 27, in Northfield, New Jersey. We help local businesses connect their website, customer management, projects, operations and marketing into one organized system.",
      "You can meet with us in person at our office or online. We work in English and Spanish, and we serve businesses across Atlantic County, Cape May County, South Jersey and the rest of New Jersey.",
    ],
    servicesHeading: "What we set up for New Jersey businesses",
    services: [
      { name: "CRM systems", text: "One place for contacts, leads, pipelines, follow-ups and client history, set up around how your business works.", href: "/services/crm-systems" },
      { name: "Custom project management (CPM)", text: "Project boards, tasks, schedules, files and client updates built for your type of work, so jobs stay on track." },
      { name: "ERP", text: "Operations, inventory, billing, team and reporting connected in one platform. See VYNTEX ERP for the live product." },
      { name: "AI agents", text: "AI assistants that follow your rules to qualify leads, answer common questions, book appointments and pass work to your team." },
      { name: "AI employees", text: "AI assistants assigned to a role, such as answering after-hours calls and chats or sending follow-ups and reminders, always with a handoff to a person." },
      { name: "AI automation", text: "Automated follow-up, missed-call text back, reminders, document collection and workflow automation.", href: "/services/ai-automation" },
      { name: "AI chatbots", text: "Bilingual website and messaging chatbots that answer, qualify and book.", href: "/services/ai-chatbots" },
      { name: "Websites and web development", text: "Mobile-first business websites, landing pages and web applications.", href: "/services/web-development" },
      { name: "Branding", text: "Logos, brand identity and social media design.", href: "/services/branding" },
      { name: "Digital marketing and social media management", text: "Local SEO, Google Business Profile, social media management, content and campaigns.", href: "/services/digital-marketing" },
    ],
    whyHeading: "Why work with a local team",
    why: [
      "Meet face to face at our Northfield office when you prefer it",
      "Bilingual service in English and Spanish",
      "One team for your website, CRM, automation and marketing",
      "Setup, training and ongoing support from people you can call",
    ],
    areaHeading: "Areas we serve",
    areaText: "From our Northfield office we work with businesses in these communities, and remotely anywhere in New Jersey and the United States.",
    officeHeading: "Visit or contact our office",
    hoursLabel: "Hours",
    hours: "Monday to Friday, 9:00 AM to 5:30 PM",
    faqHeading: "Frequently asked questions",
    faq: [
      { q: "Where is VYNTEX located?", a: "Our office is at 331 Tilton Rd, Suite 27, Northfield, NJ 08225, in Atlantic County." },
      { q: "Can we meet in person?", a: "Yes. You can book a consultation at our Northfield office or meet with us online, whichever works best for you." },
      { q: "Do you work with businesses outside Atlantic County?", a: "Yes. We serve businesses across South Jersey and the rest of New Jersey, and we work remotely with clients in other states." },
      { q: "What is the difference between a CRM, project management and an ERP?", a: "A CRM manages customers and sales, project management organizes the work for each job, and an ERP connects the wider operation such as billing, inventory and reporting. We help you choose what you actually need." },
      { q: "Do you offer services in Spanish?", a: "Yes. We work in English and Spanish, and we can build bilingual websites, chatbots and CRM templates." },
    ],
    cta: "Book a Free Consultation",
  },
  es: {
    path: "/es/nueva-jersey",
    title: "Automatización con IA, CRM, ERP y sitios web para negocios en Nueva Jersey",
    metaTitle: "Automatización con IA, CRM y ERP en Nueva Jersey",
    description:
      "VYNTEX es una empresa de tecnología local en Northfield, Nueva Jersey. Configuramos CRM, ERP, gestión de proyectos a la medida, agentes de IA, sitios web y marketing digital para negocios del sur de Nueva Jersey, en español e inglés.",
    eyebrow: "Northfield, Nueva Jersey",
    intro: [
      "VYNTEX es una empresa de tecnología con oficina en 331 Tilton Rd, Suite 27, en Northfield, Nueva Jersey. Ayudamos a los negocios locales a conectar su sitio web, la gestión de clientes, los proyectos, las operaciones y el marketing en un solo sistema organizado.",
      "Puede reunirse con nosotros en persona en nuestra oficina o en línea. Trabajamos en español e inglés y atendemos negocios en el condado de Atlantic, el condado de Cape May, el sur de Nueva Jersey y el resto del estado.",
    ],
    servicesHeading: "Lo que configuramos para negocios en Nueva Jersey",
    services: [
      { name: "Sistemas CRM", text: "Un solo lugar para contactos, prospectos, embudos de venta, seguimientos e historial de clientes, configurado según cómo trabaja su negocio.", href: "/es/servicios/sistemas-crm" },
      { name: "Gestión de proyectos a la medida (CPM)", text: "Tableros de proyectos, tareas, calendarios, archivos y avisos a clientes hechos para su tipo de trabajo, para que cada proyecto avance a tiempo." },
      { name: "ERP", text: "Operaciones, inventario, facturación, equipo y reportes conectados en una sola plataforma. Vea VYNTEX ERP para conocer el producto." },
      { name: "Agentes de IA", text: "Asistentes de IA que siguen sus reglas para calificar prospectos, responder preguntas frecuentes, agendar citas y pasar el trabajo a su equipo." },
      { name: "Empleados de IA", text: "Asistentes de IA asignados a una función, como atender llamadas y chats fuera de horario o enviar seguimientos y recordatorios, siempre con traspaso a una persona." },
      { name: "Automatización con IA", text: "Seguimiento automático, respuesta por texto a llamadas perdidas, recordatorios, recolección de documentos y automatización de procesos.", href: "/es/servicios/automatizacion-ia" },
      { name: "Chatbots con IA", text: "Chatbots bilingües para su sitio web y mensajería que responden, califican y agendan.", href: "/es/servicios/chatbots-ia" },
      { name: "Sitios web y desarrollo web", text: "Sitios web para negocios pensados para celulares, páginas de aterrizaje y aplicaciones web.", href: "/es/servicios/desarrollo-web" },
      { name: "Branding", text: "Logotipos, identidad de marca y diseño para redes sociales.", href: "/es/servicios/branding" },
      { name: "Marketing digital y manejo de redes sociales", text: "SEO local, Perfil de Empresa en Google, manejo de redes sociales, contenido y campañas.", href: "/es/servicios/marketing-digital" },
    ],
    whyHeading: "Por qué trabajar con un equipo local",
    why: [
      "Reuniones en persona en nuestra oficina de Northfield cuando lo prefiera",
      "Atención bilingüe en español e inglés",
      "Un solo equipo para su sitio web, CRM, automatización y marketing",
      "Configuración, capacitación y soporte continuo con personas a las que puede llamar",
    ],
    areaHeading: "Zonas que atendemos",
    areaText: "Desde nuestra oficina en Northfield trabajamos con negocios en estas comunidades, y de forma remota en todo Nueva Jersey y Estados Unidos.",
    officeHeading: "Visite o contacte nuestra oficina",
    hoursLabel: "Horario",
    hours: "Lunes a viernes, de 9:00 a. m. a 5:30 p. m.",
    faqHeading: "Preguntas frecuentes",
    faq: [
      { q: "¿Dónde está ubicada VYNTEX?", a: "Nuestra oficina está en 331 Tilton Rd, Suite 27, Northfield, NJ 08225, en el condado de Atlantic." },
      { q: "¿Podemos reunirnos en persona?", a: "Sí. Puede agendar una consulta en nuestra oficina de Northfield o reunirse con nosotros en línea, como le resulte mejor." },
      { q: "¿Trabajan con negocios fuera del condado de Atlantic?", a: "Sí. Atendemos negocios en todo el sur de Nueva Jersey y el resto del estado, y trabajamos de forma remota con clientes en otros estados." },
      { q: "¿Cuál es la diferencia entre un CRM, la gestión de proyectos y un ERP?", a: "Un CRM maneja clientes y ventas, la gestión de proyectos organiza el trabajo de cada proyecto y un ERP conecta toda la operación, como facturación, inventario y reportes. Le ayudamos a elegir lo que realmente necesita." },
      { q: "¿Ofrecen servicios en español?", a: "Sí. Trabajamos en español e inglés y podemos crear sitios web, chatbots y plantillas de CRM bilingües." },
    ],
    cta: "Agende una consulta gratuita",
  },
};
