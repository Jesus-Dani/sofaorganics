import type { Metadata } from "next";
import { WhatsappLogo, EnvelopeSimple, MapPin } from "@phosphor-icons/react/dist/ssr";
import { WHATSAPP_LINK } from "@/lib/nav-config";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="wrap py-14 md:py-20">
      <div className="grid gap-14 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-4">Contact</p>
          <h1 className="text-[32px] leading-tight">Reach us however&apos;s easiest.</h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-text-muted">
            Most orders and questions come through WhatsApp — that&apos;s where you&apos;ll get the
            fastest answer, especially for wholesale or bulk sizes. The form is here too, for
            anything you&apos;d rather put in writing.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[15px] font-medium text-text"
            >
              <WhatsappLogo size={20} className="text-primary" aria-hidden />
              +234 803 234 3038
            </a>
            <a href="mailto:hello@sofaorganics.com" className="flex items-center gap-3 text-[15px] text-text">
              <EnvelopeSimple size={20} className="text-primary" aria-hidden />
              hello@sofaorganics.com
            </a>
            <p className="flex items-center gap-3 text-[15px] text-text">
              <MapPin size={20} className="text-primary" aria-hidden />
              Port Harcourt, Nigeria
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
