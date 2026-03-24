import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";

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

export function toTagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

type OffreDocumentLike = {
  uid: string | null;
  id: string;
  first_publication_date: string;
  data: {
    title?: string | null;
    date?: string | null;
    description?: unknown;
    tag?: string | null;
  };
};

type DescriptionDocumentLike = {
  uid: string | null;
  id: string;
  first_publication_date: string;
  data: {
    slices?: Array<{
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

function parseTagField(tagField: unknown): string[] {
  if (typeof tagField === "string") {
    return [...new Set(tagField
      .split(/[;,|\n]/)
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean))];
  }

  const asText = prismic.asText(tagField as prismic.RichTextField) ?? "";
  if (!asText.trim()) {
    return [];
  }

  return [...new Set(asText
    .split(/[;,|\n]/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean))];
}

function mapPrismicOffreDocument(document: OffreDocumentLike): JobOffer {
  const data = document.data ?? {};
  const content = parseDescriptionField(data.description);
  const uid = document.uid || document.id;

  return {
    uid,
    slug: uid,
    title: data.title?.trim() || "Offre",
    excerpt: content[0] || "",
    content: content.length > 0 ? content : ["Description non renseignee."],
    tags: parseTagField(data.tag),
    publishedAt: data.date || document.first_publication_date,
    applicationsCount: 0,
    isSaved: false,
  };
}

function parseDescriptionField(descriptionField: unknown): string[] {
  const text = prismic.asText(descriptionField as prismic.RichTextField) ?? "";
  if (!text.trim()) {
    return [];
  }

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function mapPrismicDescriptionSlice(
  document: DescriptionDocumentLike,
  slice: NonNullable<DescriptionDocumentLike["data"]["slices"]>[number],
  index: number,
): JobOffer {
  const primary = slice.primary ?? {};
  const content = parseDescriptionField(primary.description);
  const title = primary.title?.trim() || `Offre ${index + 1}`;
  const publishedAt = primary.date || document.first_publication_date;
  const tags = parseTagField(primary.tag);
  const documentUid = document.uid || document.id;
  const slices = document.data.slices || [];
  const isSingleSlice = slices.length === 1;
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

async function fetchOffersFromOffreType(client: ReturnType<typeof createClient>): Promise<JobOffer[]> {
  const docs = await client.getAllByType("offre", {
    orderings: [{ field: "document.first_publication_date", direction: "desc" }],
  });

  return (docs as unknown as OffreDocumentLike[]).map(mapPrismicOffreDocument);
}

async function fetchOffersFromDescriptionType(client: ReturnType<typeof createClient>): Promise<JobOffer[]> {
  const docs = await client.getAllByType("description", {
    orderings: [{ field: "document.first_publication_date", direction: "desc" }],
  });

  return (docs as unknown as DescriptionDocumentLike[])
    .flatMap((document) =>
      (document.data.slices || [])
        .filter((slice) => slice.slice_type === "offre_emploie")
        .map((slice, index) => mapPrismicDescriptionSlice(document, slice, index)),
    )
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

async function fetchOffersFromPrismic(): Promise<JobOffer[]> {
  const client = createClient();

  const offersFromOffreType = await fetchOffersFromOffreType(client).catch(() => []);
  if (offersFromOffreType.length > 0) {
    return offersFromOffreType;
  }

  return fetchOffersFromDescriptionType(client).catch(() => []);
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
  const slugTag = toTagSlug(tag);
  const offers = await getAllOffers();

  return offers.filter((offer) =>
    offer.tags.some((offerTag) => {
      const normalizedTag = offerTag.toLowerCase();

      return normalizedTag === loweredTag || toTagSlug(normalizedTag) === slugTag;
    }),
  );
}

export async function getAllTags(): Promise<string[]> {
  const offers = await getAllOffers();

  return [...new Set(offers.flatMap((offer) => offer.tags))].sort((a, b) =>
    a.localeCompare(b, "fr", { sensitivity: "base" }),
  );
}

export async function getSavedOffers(): Promise<JobOffer[]> {
  const offers = await getAllOffers();

  return offers.filter((offer) => offer.isSaved);
}

export async function getApplicationHistory(): Promise<JobOffer[]> {
  const offers = await getAllOffers();

  return offers.slice(0, 2);
}
