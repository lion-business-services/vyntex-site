/**
 * Bilingual resource articles. Plain, factual guidance only: no statistics,
 * no client results, no prices. Each article exists in English and Spanish
 * with its own localized slug; the pair is linked through hreflang.
 */

export type ArticleSection = { heading: string; paragraphs: string[]; bullets?: string[] };
export type ArticleFaq = { q: string; a: string };
export type ArticleCopy = {
  slug: string;
  title: string;
  description: string;
  sections: ArticleSection[];
  faq: ArticleFaq[];
};
export type Article = {
  id: string;
  published: string; // ISO date
  updated: string; // ISO date
  relatedServices: string[]; // English service slugs
  en: ArticleCopy;
  es: ArticleCopy;
};

export const ARTICLES: Article[] = [
  {
    id: "missed-call-text-back",
    published: "2026-10-16",
    updated: "2026-10-16",
    relatedServices: ["ai-automation", "crm-systems"],
    en: {
      slug: "missed-call-text-back",
      title: "Missed-Call Text Back: How Small Businesses Stop Losing Leads After Hours",
      description:
        "What missed-call text back is, how it works, what to say in the first message, and how to connect it to your CRM so no caller is forgotten.",
      sections: [
        {
          heading: "What is missed-call text back?",
          paragraphs: [
            "Missed-call text back is an automation that sends a text message to anyone who calls your business and does not reach a person. Within moments of the missed call, the caller receives a short message from your business number that acknowledges the call and gives them a simple next step.",
            "For a contractor on a job site, a salon owner with a client in the chair, or an accountant in a meeting, it means a caller hears back from you right away instead of moving on to the next business on their list.",
          ],
        },
        {
          heading: "How it works, step by step",
          paragraphs: ["A typical setup connects your business phone line to a CRM and a messaging system:"],
          bullets: [
            "A call comes in and is not answered, or goes to voicemail.",
            "The phone system notifies the CRM, which checks whether the caller is already a contact.",
            "A text goes out from your business number with a short, friendly message and a booking link or a question.",
            "The caller's reply lands in one shared inbox, so anyone on your team can answer.",
            "The contact is created or updated in the CRM with the call, the text, and the reply, so follow-up is tracked.",
          ],
        },
        {
          heading: "What to say in the first message",
          paragraphs: [
            "Keep it short, personal, and useful. Say who you are, acknowledge the call, and offer one clear next step. Avoid long marketing copy; the goal is to start a conversation.",
            "Example: \"Hi, this is the team at [Business Name]. Sorry we missed your call. How can we help? You can reply here or book a time: [link].\"",
            "If many of your callers prefer Spanish, send the message in both languages or let the caller choose. A bilingual first message tells the customer they can be served in the language they are most comfortable with.",
          ],
        },
        {
          heading: "Connect it to your CRM, not just your phone",
          paragraphs: [
            "A text on its own helps, but the real value comes when every missed call becomes a contact with a next step. When the automation is connected to a CRM, you can see which callers replied, which booked, and which still need a call back, and you can assign each one to a team member.",
            "This is also where follow-up reminders, appointment confirmations, and review requests can be added later, so one setup grows into a complete customer journey.",
          ],
        },
        {
          heading: "Rules to follow before you turn it on",
          paragraphs: [
            "Business texting in the United States is regulated. Before launching, make sure your messaging provider has registered your number for business texting (A2P 10DLC), include a way to opt out such as \"Reply STOP to unsubscribe\" where required, and only send ongoing marketing texts to people who have agreed to receive them. A one-time reply to someone who just called you is different from a promotional campaign, and your setup should respect that difference.",
          ],
        },
        {
          heading: "Who benefits most",
          paragraphs: ["Missed-call text back is especially useful for businesses where the owner or staff cannot always answer the phone:"],
          bullets: [
            "Home services: contractors, cleaning, landscaping, painting and repair",
            "Beauty and wellness: salons, barbershops and spas",
            "Professional services: tax, accounting, insurance and legal support offices",
            "Restaurants and retail during busy hours",
          ],
        },
      ],
      faq: [
        {
          q: "Does missed-call text back work with my current phone number?",
          a: "In many cases, yes. Depending on your carrier and phone system, the number can be connected directly or calls can be forwarded through a business line that supports texting. This is reviewed during the consultation.",
        },
        {
          q: "Can the text be sent in Spanish?",
          a: "Yes. The message can be written in English, Spanish, or both, and replies can be handled by a bilingual team or a bilingual chatbot.",
        },
        {
          q: "Is this the same as an answering service?",
          a: "No. An answering service uses people to answer calls live. Missed-call text back is an automation that starts a text conversation when a call is missed, and it works alongside your team rather than replacing it.",
        },
      ],
    },
    es: {
      slug: "respuesta-automatica-llamadas-perdidas",
      title: "Respuesta automática a llamadas perdidas: cómo dejar de perder clientes fuera de horario",
      description:
        "Qué es la respuesta automática por texto a llamadas perdidas, cómo funciona, qué decir en el primer mensaje y cómo conectarla a su CRM.",
      sections: [
        {
          heading: "¿Qué es la respuesta automática a llamadas perdidas?",
          paragraphs: [
            "Es una automatización que envía un mensaje de texto a cualquier persona que llama a su negocio y no logra hablar con alguien. Segundos después de la llamada perdida, la persona recibe un mensaje corto desde el número de su negocio que reconoce la llamada y le ofrece un siguiente paso sencillo.",
            "Para un contratista en una obra, la dueña de un salón con una clienta en la silla o un contador en una reunión, significa que quien llama recibe respuesta de inmediato en lugar de buscar al siguiente negocio de la lista.",
          ],
        },
        {
          heading: "Cómo funciona, paso a paso",
          paragraphs: ["Una configuración típica conecta la línea telefónica del negocio con un CRM y un sistema de mensajería:"],
          bullets: [
            "Entra una llamada y no se contesta, o pasa al buzón de voz.",
            "El sistema telefónico avisa al CRM, que revisa si la persona ya es un contacto.",
            "Se envía un texto desde el número del negocio con un mensaje breve y amable, y un enlace para agendar o una pregunta.",
            "La respuesta llega a una bandeja compartida, para que cualquier persona del equipo pueda contestar.",
            "El contacto se crea o se actualiza en el CRM con la llamada, el texto y la respuesta, para dar seguimiento.",
          ],
        },
        {
          heading: "Qué decir en el primer mensaje",
          paragraphs: [
            "Sea breve, personal y útil. Diga quién es, reconozca la llamada y ofrezca un solo paso claro. Evite textos publicitarios largos; el objetivo es iniciar una conversación.",
            "Ejemplo: \"Hola, le saluda el equipo de [Nombre del Negocio]. Disculpe que no pudimos contestar. ¿En qué le podemos ayudar? Puede responder aquí o agendar una cita: [enlace].\"",
            "Si muchos de sus clientes prefieren el inglés o el español, envíe el mensaje en ambos idiomas o deje que la persona elija. Un primer mensaje bilingüe le dice al cliente que puede ser atendido en el idioma en que se siente más cómodo.",
          ],
        },
        {
          heading: "Conéctela a su CRM, no solo a su teléfono",
          paragraphs: [
            "Un texto por sí solo ayuda, pero el verdadero valor aparece cuando cada llamada perdida se convierte en un contacto con un siguiente paso. Con la automatización conectada a un CRM, usted ve quién respondió, quién agendó y a quién todavía hay que llamar, y puede asignar cada caso a una persona del equipo.",
            "Ahí mismo se pueden agregar después recordatorios de seguimiento, confirmaciones de citas y solicitudes de reseñas, para que una sola configuración crezca hasta cubrir todo el recorrido del cliente.",
          ],
        },
        {
          heading: "Reglas que debe cumplir antes de activarla",
          paragraphs: [
            "Los mensajes de texto comerciales en Estados Unidos están regulados. Antes de lanzar, asegúrese de que su proveedor de mensajería haya registrado su número para mensajes comerciales (A2P 10DLC), incluya una forma de darse de baja como \"Responda STOP para no recibir más mensajes\" cuando sea requerido, y envíe mensajes de mercadeo continuos solo a personas que hayan aceptado recibirlos. Una respuesta única a alguien que acaba de llamarle no es lo mismo que una campaña promocional, y su configuración debe respetar esa diferencia.",
          ],
        },
        {
          heading: "Quiénes se benefician más",
          paragraphs: ["Es especialmente útil para negocios donde el dueño o el personal no siempre pueden contestar el teléfono:"],
          bullets: [
            "Servicios para el hogar: contratistas, limpieza, jardinería, pintura y reparaciones",
            "Belleza y bienestar: salones, barberías y spas",
            "Servicios profesionales: oficinas de impuestos, contabilidad, seguros y apoyo legal",
            "Restaurantes y tiendas en horas de mucho movimiento",
          ],
        },
      ],
      faq: [
        {
          q: "¿Funciona con mi número de teléfono actual?",
          a: "En muchos casos, sí. Según su compañía telefónica y su sistema, el número se puede conectar directamente o las llamadas se pueden desviar a una línea comercial que permita textos. Esto se revisa en la consulta.",
        },
        {
          q: "¿El mensaje se puede enviar en español?",
          a: "Sí. El mensaje se puede escribir en español, en inglés o en ambos, y las respuestas las puede atender un equipo bilingüe o un chatbot bilingüe.",
        },
        {
          q: "¿Es lo mismo que un servicio de contestadora?",
          a: "No. Un servicio de contestadora usa personas para contestar en vivo. La respuesta automática a llamadas perdidas inicia una conversación por texto cuando no se contesta una llamada, y trabaja junto a su equipo, no en su lugar.",
        },
      ],
    },
  },
  {
    id: "bilingual-crm-setup",
    published: "2026-10-16",
    updated: "2026-10-16",
    relatedServices: ["crm-systems", "ai-chatbots"],
    en: {
      slug: "crm-for-bilingual-businesses",
      title: "CRM for Bilingual Businesses: What to Set Up First for English and Spanish Customers",
      description:
        "A practical guide to setting up a CRM for a business that serves customers in English and Spanish: language fields, templates, pipelines, and team handoffs.",
      sections: [
        {
          heading: "Why bilingual businesses need a different CRM setup",
          paragraphs: [
            "Many small businesses in the United States serve customers in both English and Spanish. A standard CRM setup assumes one language, so messages go out in the wrong language, staff guess which language a customer prefers, and follow-up depends on whoever happens to speak that language being available.",
            "A few deliberate choices at setup time fix most of these problems and make every customer feel served in the language they are most comfortable with.",
          ],
        },
        {
          heading: "1. Record each contact's preferred language",
          paragraphs: [
            "Add a required \"Preferred language\" field to every contact and capture it at the first touchpoint: your website form, the chatbot, the intake call, or the first text reply. Every automation and template decision after that depends on this one field.",
          ],
        },
        {
          heading: "2. Build every template in both languages",
          paragraphs: [
            "Write each email and text template twice, once in English and once in Spanish, and let the CRM choose based on the contact's preferred language. Translate for meaning, not word for word, and keep the same tone in both versions.",
          ],
          bullets: [
            "Appointment confirmations and reminders",
            "Document or information requests",
            "Quotes, invoices and payment reminders",
            "Thank-you and review-request messages",
          ],
        },
        {
          heading: "3. Keep one pipeline, not one per language",
          paragraphs: [
            "Separate pipelines for English and Spanish customers split your reporting and hide where deals are stuck. Use one pipeline with the same stages for everyone, and filter or tag by language when you need to.",
          ],
        },
        {
          heading: "4. Route conversations to the right person",
          paragraphs: [
            "When a Spanish-speaking customer replies, the message should reach someone who can answer in Spanish. Set up assignment rules based on the language field, and let a bilingual chatbot handle common questions and booking after hours.",
          ],
        },
        {
          heading: "5. Make your website and forms match",
          paragraphs: [
            "If your CRM is bilingual but your website is not, customers drop off before they ever reach the CRM. Offer real Spanish pages, not just a translation button, and use bilingual forms that save the visitor's language choice straight into the contact record.",
          ],
        },
        {
          heading: "Where to start",
          paragraphs: [
            "Start small: the language field, bilingual appointment reminders, and one shared inbox. Once those work, add document collection, payment reminders and review requests. Each step builds on the same foundation.",
          ],
        },
      ],
      faq: [
        {
          q: "Which CRM works best for a bilingual business?",
          a: "Most modern CRMs can support two languages if they allow custom fields, conditional templates and assignment rules. The right choice depends on your industry, team size and the tools you already use; VYNTEX reviews this with you in the consultation.",
        },
        {
          q: "Should I use automatic translation for customer messages?",
          a: "Automatic translation can help staff understand a message, but customer-facing templates should be written or reviewed by someone fluent in each language so the tone and meaning are right.",
        },
        {
          q: "Can VYNTEX set this up for my business?",
          a: "Yes. VYNTEX designs and configures bilingual CRM systems, templates, chatbots and websites for businesses that serve English- and Spanish-speaking customers.",
        },
      ],
    },
    es: {
      slug: "crm-para-negocios-bilingues",
      title: "CRM para negocios bilingües: qué configurar primero para clientes en inglés y español",
      description:
        "Guía práctica para configurar un CRM en un negocio que atiende clientes en inglés y español: campo de idioma, plantillas, embudos y asignación al equipo.",
      sections: [
        {
          heading: "Por qué un negocio bilingüe necesita otra configuración de CRM",
          paragraphs: [
            "Muchos pequeños negocios en Estados Unidos atienden clientes en inglés y en español. Una configuración estándar de CRM supone un solo idioma: los mensajes salen en el idioma equivocado, el personal adivina qué idioma prefiere el cliente y el seguimiento depende de que esté disponible quien hable ese idioma.",
            "Unas pocas decisiones al momento de configurar resuelven la mayoría de estos problemas y hacen que cada cliente se sienta atendido en el idioma en que se siente más cómodo.",
          ],
        },
        {
          heading: "1. Registre el idioma preferido de cada contacto",
          paragraphs: [
            "Agregue un campo obligatorio de \"Idioma preferido\" a cada contacto y llénelo desde el primer contacto: el formulario del sitio web, el chatbot, la llamada de entrada o la primera respuesta por texto. Todas las automatizaciones y plantillas dependen de este campo.",
          ],
        },
        {
          heading: "2. Cree cada plantilla en los dos idiomas",
          paragraphs: [
            "Escriba cada plantilla de correo y de texto dos veces, una en inglés y otra en español, y deje que el CRM elija según el idioma preferido del contacto. Traduzca por significado, no palabra por palabra, y mantenga el mismo tono en ambas versiones.",
          ],
          bullets: [
            "Confirmaciones y recordatorios de citas",
            "Solicitudes de documentos o información",
            "Cotizaciones, facturas y recordatorios de pago",
            "Mensajes de agradecimiento y solicitudes de reseñas",
          ],
        },
        {
          heading: "3. Use un solo embudo, no uno por idioma",
          paragraphs: [
            "Tener embudos separados para clientes en inglés y en español divide sus reportes y esconde dónde se detienen las ventas. Use un solo embudo con las mismas etapas para todos, y filtre o etiquete por idioma cuando lo necesite.",
          ],
        },
        {
          heading: "4. Dirija cada conversación a la persona correcta",
          paragraphs: [
            "Cuando un cliente responde en español, el mensaje debe llegar a alguien que pueda contestar en español. Configure reglas de asignación según el campo de idioma y deje que un chatbot bilingüe atienda preguntas frecuentes y citas fuera de horario.",
          ],
        },
        {
          heading: "5. Haga que su sitio web y sus formularios coincidan",
          paragraphs: [
            "Si su CRM es bilingüe pero su sitio web no lo es, los clientes se van antes de llegar al CRM. Ofrezca páginas reales en español, no solo un botón de traducción, y use formularios bilingües que guarden el idioma elegido directamente en el contacto.",
          ],
        },
        {
          heading: "Por dónde empezar",
          paragraphs: [
            "Empiece con poco: el campo de idioma, recordatorios de citas bilingües y una bandeja compartida. Cuando eso funcione, agregue recolección de documentos, recordatorios de pago y solicitudes de reseñas. Cada paso se construye sobre la misma base.",
          ],
        },
      ],
      faq: [
        {
          q: "¿Qué CRM funciona mejor para un negocio bilingüe?",
          a: "La mayoría de los CRM modernos pueden manejar dos idiomas si permiten campos personalizados, plantillas condicionales y reglas de asignación. La mejor opción depende de su industria, el tamaño de su equipo y las herramientas que ya usa; VYNTEX lo revisa con usted en la consulta.",
        },
        {
          q: "¿Debo usar traducción automática para los mensajes a clientes?",
          a: "La traducción automática puede ayudar al personal a entender un mensaje, pero las plantillas que reciben los clientes deben escribirlas o revisarlas personas con dominio de cada idioma, para que el tono y el significado sean correctos.",
        },
        {
          q: "¿VYNTEX puede configurar esto para mi negocio?",
          a: "Sí. VYNTEX diseña y configura sistemas CRM, plantillas, chatbots y sitios web bilingües para negocios que atienden clientes en inglés y en español.",
        },
      ],
    },
  },
];

export function getArticle(lang: "en" | "es", slug: string): { article: Article; copy: ArticleCopy } | undefined {
  const article = ARTICLES.find(a => a[lang].slug === slug);
  return article ? { article, copy: article[lang] } : undefined;
}
