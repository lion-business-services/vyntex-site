import { marketingSocial } from "@/lib/seo-metadata";
import type { Metadata } from "next";
import { seoAlternates } from "@/lib/seo-routes";
export const metadata: Metadata = { alternates: seoAlternates("/"), openGraph: marketingSocial("/", "Connected Business Systems", "Websites, CRM, AI automation and bilingual digital solutions.") };
import Nav from "@/components/Nav";
import HomeExperience from "@/components/home/HomeExperience";
import BookConsultation from "@/components/BookConsultation";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <HomeExperience />
      </main>
      <Footer showCta={false} />
      <BookConsultation />
      <Chatbot />
    </>
  );
}
