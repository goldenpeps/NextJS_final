import { redirect } from "next/navigation";
import { getAllTags } from "@/libs/jobs";

export default async function TagIndexPage() {
  const tags = await getAllTags();

  if (tags.length > 0) {
    redirect(`/tag/${tags[0]}`);
  }

  redirect("/liste");
}
