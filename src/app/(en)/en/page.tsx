import { GeneratorApp } from "@/components/generator-app";
import { messages } from "@/i18n/messages";

export default function Page() {
  return <GeneratorApp dict={messages.en} lang="en" />;
}
