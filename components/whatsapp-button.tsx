import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { WHATSAPP_LINK } from "@/lib/nav-config";

export function WhatsAppButton() {
  return (
    <a
      href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Hi Sofa Organics, I have a question about your herbs & oils.")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center bg-primary text-background shadow-lg transition-transform hover:scale-105"
      aria-label="Chat with Sofa Organics on WhatsApp"
    >
      <WhatsappLogo size={26} weight="fill" aria-hidden />
    </a>
  );
}
