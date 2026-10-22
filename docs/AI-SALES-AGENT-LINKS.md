# AI sales agents: links and rules (VYNTEX CRM / GoHighLevel)

This is the link sheet for any AI agent that talks to prospects for VYNTEX (website chat, SMS, WhatsApp, Facebook or
Instagram messages, voice). Paste the "Links" and "Rules" sections into the agent's knowledge base or prompt
(IN: GoHighLevel > AI Agents > Conversation AI > Bot Training / Knowledge Base). The same links are published for
public AI assistants in https://www.vyntexusa.com/llms.txt and https://erp.vyntexusa.com/llms.txt.

## The journey

| Step | What the agent does | Link |
| --- | --- | --- |
| 1. Discover | Explains what VYNTEX does and what the Business Software is | https://www.vyntexusa.com/ and https://erp.vyntexusa.com/ |
| 2. Pricing | Sends the pricing page for the person's industry | https://erp.vyntexusa.com/pricing?industry=EDITION |
| 3. Live demo | Sends the demo; no appointment and no account needed | https://erp.vyntexusa.com/demo?industry=EDITION |
| 4. AI explains | Answers questions from the pricing page and this sheet only | (no link) |
| 5. Follow-up with consent | Asks permission before any follow-up; the Book a Free Demo form records how and in which language to contact them | https://www.vyntexusa.com/contact?intent=demo |
| 6. Choose a package | Sends the booking link with the industry and plan they chose | https://www.vyntexusa.com/contact?intent=demo&industry=EDITION&plan=TIER&billing=BILLING |
| 7. Invoice or payment link | Hands off to a person. The team sends the invoice or payment link | (person) |
| 8. Onboarding | Setup is done together with the customer after payment | (person) |

Values:

* `EDITION`: `build` (construction), `clean` (cleaning), `landscape` (landscaping), `wash` (pressure washing, windows and
  gutters), `haul` (junk removal and moving), `snow` (snow removal), `turnover` (property turnover and make-ready),
  `events` (event setup and staffing), `practice` (professional services; quoted on request, no published price).
* `TIER`: `0` entry plan, `1` middle plan (most popular), `2` top plan.
* `BILLING`: `monthly` or `yearly`.
* Spanish: add `lang=es` to erp.vyntexusa.com links (for example `https://erp.vyntexusa.com/demo?industry=clean&lang=es`).
  The Spanish demo form is `https://www.vyntexusa.com/es/contacto?intent=demo` (same `industry`, `plan`, `billing`).
* Tracking (optional): add `utm_source=ghl&utm_medium=ai-agent&utm_campaign=CHANNEL` so visits from the agent can be
  told apart in analytics. The ERP ignores parameters it does not use.

Website services (websites, CRM, AI automation, chatbots, branding, marketing) are quoted in a free consultation:
https://www.vyntexusa.com/contact

## Rules for the agent

1. Prices come only from https://erp.vyntexusa.com/pricing. Never quote a price, discount, credit or term that is not
   on that page. Website services have no public prices: offer the free consultation.
2. No follow-up message, call or text without the person's consent. Text messages require their opt-in
   (VYNTEX CRM consent capture), and every text includes a way to stop (reply STOP).
3. Never ask for card numbers, bank details, Social Security numbers or passwords in chat. Payment happens only
   through the invoice or payment link the VYNTEX team sends.
4. The demo uses a sample company with made-up records. Tell people not to type real customer data into it.
5. Hand off to a person for: custom terms, the professional-services edition, anything about an existing account,
   billing disputes, or when the person asks for a human. Phone and WhatsApp +1 (609) 780-3218,
   info@vyntexusa.com, Monday to Friday 9:00 AM to 5:30 PM Eastern.
6. Answer in the person's language (English or Spanish).

## What happens when someone books a demo

"Book a Free Demo" is a form on the VYNTEX website: https://www.vyntexusa.com/contact?intent=demo (Spanish:
https://www.vyntexusa.com/es/contacto?intent=demo). On the website every Book a Free Demo button opens it in place.
Each request:

1. is saved in Supabase (`consultation_requests`, with `services = {business_software_demo}`),
2. is emailed to the team through FormSubmit (subject "New Business Software demo request: BUSINESS") and through
   Resend (internal notification), and
3. sends the person a confirmation in their language.

The visitor sees success as soon as any one of those team channels has the request.

## When a calendar link exists

When a VYNTEX CRM calendar is ready (IN: GoHighLevel > Calendars > the demo calendar > Share > copy the booking
link), set `DEMO_BOOKING.calendarUrl` in `lib/site.ts` (IN: VS Code) and every Book a Free Demo button on the site
goes there instead of opening the form, then replace steps 5 and 6's links in this sheet and in `public/llms.txt`.
