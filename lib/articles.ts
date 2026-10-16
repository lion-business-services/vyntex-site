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
  {
    id: "ai-chatbot-small-business",
    published: "2026-10-16",
    updated: "2026-10-16",
    relatedServices: ["ai-chatbots", "ai-automation"],
    en: {
      slug: "ai-chatbots-for-small-business-websites",
      title: "AI Chatbots for Small Business Websites: What They Can and Can't Do",
      description:
        "A plain-language guide to website chatbots: the jobs they handle well, where a person still needs to step in, and how to set one up responsibly.",
      sections: [
        {
          heading: "What a website chatbot is",
          paragraphs: [
            "A website chatbot is a chat window on your site that answers visitors automatically. Modern AI chatbots can understand questions written in everyday language, in English or Spanish, and reply using information your business has approved.",
            "The goal is not to replace your team. It is to make sure every visitor gets a quick, accurate first answer and a clear next step, even when nobody is available to reply.",
          ],
        },
        {
          heading: "Jobs a chatbot handles well",
          paragraphs: ["When it is set up with your real business information, a chatbot is good at repetitive, predictable conversations:"],
          bullets: [
            "Answering common questions about services, hours, location and what to bring",
            "Collecting a visitor's name, contact details and what they need",
            "Booking or requesting an appointment through your calendar",
            "Pointing visitors to the right page, form or document checklist",
            "Switching between English and Spanish based on the visitor",
            "Handing the conversation to a person when the question needs one",
          ],
        },
        {
          heading: "Where a person still needs to step in",
          paragraphs: [
            "A chatbot should not make decisions that depend on professional judgment. Questions about a specific legal, tax, medical or financial situation, complaints, pricing exceptions and anything sensitive should go to a member of your team.",
            "AI can also sound confident when it is wrong. That is why a business chatbot should answer only from information you have reviewed, say clearly when it does not know, and offer a way to reach a person.",
          ],
        },
        {
          heading: "How to set one up responsibly",
          paragraphs: ["A few rules keep a chatbot helpful and trustworthy:"],
          bullets: [
            "Tell visitors they are chatting with an automated assistant",
            "Give it an approved list of answers and links instead of letting it guess",
            "Ask for consent before collecting personal information, and collect only what you need",
            "Send every lead it collects to your CRM so someone follows up",
            "Review conversations regularly and update the answers",
          ],
        },
        {
          heading: "Connect it to the rest of your system",
          paragraphs: [
            "A chatbot works best when it is connected to your CRM, calendar and messaging. A visitor who asks a question at night can be added as a contact, booked for a call and sent a confirmation, so your team starts the morning with organized leads instead of missed messages.",
          ],
        },
      ],
      faq: [
        {
          q: "Will a chatbot replace my receptionist or front desk?",
          a: "No. A chatbot handles repetitive first questions and after-hours inquiries so your team can focus on conversations that need a person.",
        },
        {
          q: "Can the chatbot speak Spanish?",
          a: "Yes. A bilingual chatbot can answer in English or Spanish and switch based on the language the visitor uses.",
        },
        {
          q: "What happens when the chatbot doesn't know the answer?",
          a: "A well-built chatbot says it does not know and offers to connect the visitor with your team, collecting their contact information so someone can follow up.",
        },
      ],
    },
    es: {
      slug: "chatbots-ia-para-sitios-web-de-pequenos-negocios",
      title: "Chatbots con IA para sitios web de pequeños negocios: qué pueden y qué no pueden hacer",
      description:
        "Guía sencilla sobre los chatbots para sitios web: las tareas que hacen bien, cuándo debe intervenir una persona y cómo configurarlos con responsabilidad.",
      sections: [
        {
          heading: "Qué es un chatbot para su sitio web",
          paragraphs: [
            "Un chatbot es una ventana de chat en su sitio web que responde automáticamente a los visitantes. Los chatbots modernos con IA entienden preguntas escritas de forma natural, en español o en inglés, y responden con información que su negocio ha aprobado.",
            "El objetivo no es reemplazar a su equipo. Es asegurar que cada visitante reciba una primera respuesta rápida y correcta, y un siguiente paso claro, aunque nadie esté disponible para contestar.",
          ],
        },
        {
          heading: "Tareas que un chatbot hace bien",
          paragraphs: ["Cuando se configura con la información real de su negocio, un chatbot es bueno para conversaciones repetitivas y previsibles:"],
          bullets: [
            "Responder preguntas frecuentes sobre servicios, horarios, ubicación y qué traer",
            "Recolectar el nombre, los datos de contacto y la necesidad del visitante",
            "Agendar o solicitar una cita en su calendario",
            "Dirigir al visitante a la página, formulario o lista de documentos correcta",
            "Cambiar entre español e inglés según el visitante",
            "Pasar la conversación a una persona cuando la pregunta lo requiere",
          ],
        },
        {
          heading: "Cuándo debe intervenir una persona",
          paragraphs: [
            "Un chatbot no debe tomar decisiones que dependan del criterio de un profesional. Preguntas sobre una situación legal, de impuestos, médica o financiera específica, quejas, excepciones de precio y cualquier tema delicado deben pasar a una persona de su equipo.",
            "La IA también puede sonar segura cuando está equivocada. Por eso un chatbot de negocio debe responder solo con información que usted ha revisado, decir claramente cuando no sabe y ofrecer una forma de hablar con una persona.",
          ],
        },
        {
          heading: "Cómo configurarlo con responsabilidad",
          paragraphs: ["Unas pocas reglas mantienen al chatbot útil y confiable:"],
          bullets: [
            "Avise a los visitantes que están hablando con un asistente automático",
            "Dele una lista aprobada de respuestas y enlaces en lugar de dejarlo adivinar",
            "Pida consentimiento antes de recolectar datos personales y pida solo lo necesario",
            "Envíe cada contacto que recolecte a su CRM para que alguien dé seguimiento",
            "Revise las conversaciones con regularidad y actualice las respuestas",
          ],
        },
        {
          heading: "Conéctelo con el resto de su sistema",
          paragraphs: [
            "Un chatbot funciona mejor conectado a su CRM, su calendario y su mensajería. Un visitante que pregunta de noche puede quedar registrado como contacto, con una llamada agendada y una confirmación enviada, para que su equipo empiece el día con contactos organizados en lugar de mensajes perdidos.",
          ],
        },
      ],
      faq: [
        {
          q: "¿Un chatbot reemplaza a mi recepcionista?",
          a: "No. El chatbot atiende las primeras preguntas repetitivas y las consultas fuera de horario para que su equipo se enfoque en las conversaciones que necesitan una persona.",
        },
        {
          q: "¿El chatbot puede hablar en español?",
          a: "Sí. Un chatbot bilingüe puede responder en español o en inglés y cambiar según el idioma que use el visitante.",
        },
        {
          q: "¿Qué pasa cuando el chatbot no sabe la respuesta?",
          a: "Un chatbot bien configurado dice que no sabe y ofrece conectar al visitante con su equipo, recolectando sus datos de contacto para que alguien le dé seguimiento.",
        },
      ],
    },
  },
  {
    id: "google-business-profile-checklist",
    published: "2026-10-16",
    updated: "2026-10-16",
    relatedServices: ["digital-marketing", "web-development"],
    en: {
      slug: "google-business-profile-checklist",
      title: "Google Business Profile Checklist for Local Service Businesses",
      description:
        "A step-by-step checklist to set up and maintain your Google Business Profile so local customers can find, trust and contact your business.",
      sections: [
        {
          heading: "Why your Google Business Profile matters",
          paragraphs: [
            "When someone searches for a service near them, Google often shows a map with local businesses before the regular results. Those listings come from Google Business Profile. A complete, accurate profile helps customers find your hours, call you, get directions and read reviews without leaving Google.",
          ],
        },
        {
          heading: "1. Claim and verify your profile",
          paragraphs: [
            "Search for your business on Google Maps. If a listing already exists, claim it; if not, create one at business.google.com. Google will ask you to verify that you run the business, for example by video, phone, email or mail, depending on what it offers for your listing. Verification is required before your profile can show in local results.",
          ],
        },
        {
          heading: "2. Keep your name, address and phone consistent",
          paragraphs: [
            "Use your real business name, without extra keywords. Your name, address and phone number should match exactly across your website, Google, social media and directories. If you serve customers at their location and do not want your address shown, you can set a service area instead.",
          ],
        },
        {
          heading: "3. Choose the right categories",
          paragraphs: [
            "Your primary category tells Google what your business is. Pick the most specific one that fits, then add a few secondary categories for other services you actually offer.",
          ],
        },
        {
          heading: "4. Complete every section",
          paragraphs: ["Fill in everything that applies to your business:"],
          bullets: [
            "Hours, including holiday hours",
            "Website link and appointment link",
            "Services with short descriptions",
            "A clear business description in plain language",
            "Languages spoken, if you serve customers in Spanish",
            "Real photos of your location, team and work",
          ],
        },
        {
          heading: "5. Ask for reviews the right way",
          paragraphs: [
            "Reviews help customers decide. Ask satisfied customers for a review with a direct link, and reply to every review, positive or negative, politely and professionally. Do not offer discounts or gifts in exchange for reviews, and do not write reviews for your own business; both go against Google's policies.",
          ],
        },
        {
          heading: "6. Keep it updated",
          paragraphs: [
            "Update your hours when they change, add new photos, answer questions customers ask on your profile, and share updates or offers with posts. An active, accurate profile builds trust with customers.",
          ],
        },
      ],
      faq: [
        {
          q: "Does a Google Business Profile cost money?",
          a: "No. Creating and managing a Google Business Profile is free.",
        },
        {
          q: "Can I have a profile if I work from home or at customers' locations?",
          a: "Yes. Service-area businesses can list the areas they serve and hide their street address from the public.",
        },
        {
          q: "Can VYNTEX help set up and manage my profile?",
          a: "Yes. VYNTEX helps businesses set up their profile, connect it to their website and CRM, and build a review request process that follows Google's rules.",
        },
      ],
    },
    es: {
      slug: "lista-perfil-de-empresa-en-google",
      title: "Lista de verificación del Perfil de Empresa en Google para negocios locales",
      description:
        "Lista paso a paso para crear y mantener su Perfil de Empresa en Google, para que los clientes de su zona lo encuentren, confíen y lo contacten.",
      sections: [
        {
          heading: "Por qué importa su Perfil de Empresa en Google",
          paragraphs: [
            "Cuando alguien busca un servicio cerca, Google muchas veces muestra un mapa con negocios locales antes de los resultados normales. Esos negocios salen del Perfil de Empresa en Google. Un perfil completo y correcto ayuda a los clientes a ver su horario, llamarle, pedir direcciones y leer reseñas sin salir de Google.",
          ],
        },
        {
          heading: "1. Reclame y verifique su perfil",
          paragraphs: [
            "Busque su negocio en Google Maps. Si ya existe, reclámelo; si no, créelo en business.google.com. Google le pedirá verificar que usted maneja el negocio, por ejemplo por video, teléfono, correo electrónico o correo postal, según las opciones disponibles para su perfil. La verificación es necesaria para que su perfil aparezca en los resultados locales.",
          ],
        },
        {
          heading: "2. Mantenga igual su nombre, dirección y teléfono",
          paragraphs: [
            "Use el nombre real de su negocio, sin palabras clave adicionales. Su nombre, dirección y teléfono deben coincidir exactamente en su sitio web, Google, redes sociales y directorios. Si atiende a sus clientes en su ubicación y no quiere mostrar su dirección, puede configurar un área de servicio.",
          ],
        },
        {
          heading: "3. Elija las categorías correctas",
          paragraphs: [
            "La categoría principal le dice a Google qué es su negocio. Elija la más específica que corresponda y agregue algunas categorías secundarias para otros servicios que realmente ofrece.",
          ],
        },
        {
          heading: "4. Complete todas las secciones",
          paragraphs: ["Llene todo lo que aplique a su negocio:"],
          bullets: [
            "Horario, incluyendo días festivos",
            "Enlace a su sitio web y para agendar citas",
            "Servicios con descripciones breves",
            "Una descripción clara del negocio en lenguaje sencillo",
            "Idiomas que hablan, si atiende clientes en español",
            "Fotos reales de su local, su equipo y su trabajo",
          ],
        },
        {
          heading: "5. Pida reseñas de la forma correcta",
          paragraphs: [
            "Las reseñas ayudan a los clientes a decidir. Pida una reseña a clientes satisfechos con un enlace directo y responda cada reseña, positiva o negativa, con cortesía y profesionalismo. No ofrezca descuentos ni regalos a cambio de reseñas y no escriba reseñas para su propio negocio; ambas cosas van contra las políticas de Google.",
          ],
        },
        {
          heading: "6. Manténgalo actualizado",
          paragraphs: [
            "Actualice su horario cuando cambie, agregue fotos nuevas, responda las preguntas que hagan los clientes en su perfil y comparta novedades u ofertas con publicaciones. Un perfil activo y correcto genera confianza en los clientes.",
          ],
        },
      ],
      faq: [
        {
          q: "¿El Perfil de Empresa en Google cuesta dinero?",
          a: "No. Crear y administrar un Perfil de Empresa en Google es gratis.",
        },
        {
          q: "¿Puedo tener un perfil si trabajo desde casa o en la ubicación del cliente?",
          a: "Sí. Los negocios con área de servicio pueden indicar las zonas que atienden y ocultar su dirección al público.",
        },
        {
          q: "¿VYNTEX puede ayudarme a crear y manejar mi perfil?",
          a: "Sí. VYNTEX ayuda a los negocios a crear su perfil, conectarlo con su sitio web y su CRM, y armar un proceso de solicitud de reseñas que cumpla las reglas de Google.",
        },
      ],
    },
  },
];

export function getArticle(lang: "en" | "es", slug: string): { article: Article; copy: ArticleCopy } | undefined {
  const article = ARTICLES.find(a => a[lang].slug === slug);
  return article ? { article, copy: article[lang] } : undefined;
}
