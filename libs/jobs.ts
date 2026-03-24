import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";

type PrismicRichTextBlock = {
  type?: string;
  text?: string;
};

type PrismicEmbedFieldValue = {
  html?: string;
  title?: string;
  provider_name?: string;
};

export type JobOffer = {
  uid: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  tags: string[];
  publishedAt: string;
  applicationsCount: number;
  isSaved?: boolean;
};

type DescriptionDocumentLike = {
  uid: string | null;
  id: string;
  first_publication_date: string;
  data: {
    slices: Array<{
      slice_type: string;
      primary?: {
        title?: string | null;
        date?: string | null;
        description?: unknown;
        tag?: unknown;
        pinned?: boolean | null;
      };
    }>;
  };
};

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parseTagField(tagField: unknown): string[] {
  const embed = tagField as PrismicEmbedFieldValue | null | undefined;

  if (!embed || typeof embed !== "object") {
    return [];
  }

  const candidates = [
    embed.title,
    embed.provider_name,
    embed.html ? stripHtml(embed.html) : undefined,
  ]
    .filter((value): value is string => Boolean(value && value.trim()))
    .join(" ");

  if (!candidates) {
    return [];
  }

  return [...new Set(candidates
    .split(/[;,|\n]/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean))];
}

function parseDescriptionField(descriptionField: unknown): string[] {
  const blocks = (descriptionField as PrismicRichTextBlock[] | undefined) ?? [];

  const paragraphs = blocks
    .filter((block) => block && typeof block === "object")
    .map((block) => ({ type: block.type ?? "", text: block.text?.trim() ?? "" }))
    .filter((block) =>
      ["paragraph", "preformatted", "heading1", "heading2", "heading3", "heading4", "heading5", "heading6"].includes(block.type) &&
      block.text.length > 0,
    )
    .map((block) => block.text);

  if (paragraphs.length > 0) {
    return paragraphs;
  }

  const text = prismic.asText(descriptionField as prismic.RichTextField) ?? "";
  return text ? [text] : [];
}

function mapPrismicOffer(
  document: DescriptionDocumentLike,
  slice: DescriptionDocumentLike["data"]["slices"][number],
  index: number,
): JobOffer {
  const primary = slice.primary ?? {};
  const content = parseDescriptionField(primary.description);
  const title = primary.title?.trim() || `Offre ${index + 1}`;
  const publishedAt = primary.date || document.first_publication_date;
  const tags = parseTagField(primary.tag);
  const documentUid = document.uid || document.id;
  const isSingleSlice = document.data.slices.length === 1;
  const uid = isSingleSlice ? documentUid : `${documentUid}-${index + 1}`;

  return {
    uid,
    slug: uid,
    title,
    excerpt: content[0] || "",
    content: content.length > 0 ? content : ["Description non renseignee."],
    tags,
    publishedAt,
    applicationsCount: 0,
    isSaved: Boolean(primary.pinned),
  };
}

async function fetchOffersFromPrismic(): Promise<JobOffer[]> {
  const client = createClient();
  const docs = await client.getAllByType("description");

  const offers = (docs as unknown as DescriptionDocumentLike[])
    .flatMap((document) =>
      (document.data.slices || [])
        .filter((slice) => slice.slice_type === "offre_emploie")
        .map((slice, index) => mapPrismicOffer(document, slice, index)),
    )
    .sort((a, b) => {
      const aTime = new Date(a.publishedAt).getTime();
      const bTime = new Date(b.publishedAt).getTime();
      return bTime - aTime;
    });

  return offers;
}

export async function getAllOffers(): Promise<JobOffer[]> {
  try {
    return await fetchOffersFromPrismic();
  } catch {
    return [];
  }
}

export async function getLatestOffers(limit = 6): Promise<JobOffer[]> {
  const offers = await getAllOffers();

  return offers.slice(0, limit);
}

export async function getOfferByUid(uid: string): Promise<JobOffer | null> {
  const offers = await getAllOffers();

  return offers.find((offer) => offer.uid === uid) ?? null;
}

export async function getOffersByTag(tag: string): Promise<JobOffer[]> {
  const loweredTag = tag.toLowerCase();
  const offers = await getAllOffers();

  return offers.filter((offer) =>
    offer.tags.some((offerTag) => offerTag.toLowerCase() === loweredTag),
  );
}

export async function getAllTags(): Promise<string[]> {
  const offers = await getAllOffers();

  return [...new Set(offers.flatMap((offer) => offer.tags))];
}

export async function getSavedOffers(): Promise<JobOffer[]> {
  const offers = await getAllOffers();

  return offers.filter((offer) => offer.isSaved);
}

export async function getApplicationHistory(): Promise<JobOffer[]> {
  const offers = await getAllOffers();

  return offers.slice(0, 2);
}
