import { sendContact } from "@/actions/sendContact";
import Form from "next/form";

export default function ContactForm() {
  return (
    <Form action={sendContact}>
      <input name="email" type="email" />
      <textarea name="message"></textarea>
      <button type="submit">Send Contact</button>
    </Form>
  );
}
