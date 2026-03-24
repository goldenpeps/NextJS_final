import { redirect } from "next/navigation";
import { getAllOffers } from "@/libs/jobs";

export default async function SingleIndexPage() {
  const offers = await getAllOffers();

  if (offers.length > 0) {
    redirect(`/single/${offers[0].uid}`);
  }

  redirect("/liste");
}
