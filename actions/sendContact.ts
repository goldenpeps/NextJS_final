"use server";

export async function sendContact(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!email || !message) {
    throw new Error("Email et message sont requis.");
  }

  // Placeholder: brancher ici votre envoi d'email/API.
  console.log("Contact envoye", { email, message });
}
