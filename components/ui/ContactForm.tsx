import { sendContactForm } from "@/actions/sendContactForm";
import Form from "next/form";

export default function ContactForm() {
  return (
    <Form action={sendContactForm}>
      <input name="email" type="email" />
      <textarea name="message"></textarea>
      <button type="submit">Create Post</button>
    </Form>
  );
}
