import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JobOffer } from "@/components/ui/JobCard";

type OffreState = {
  pinnedOffers: JobOffer[];
  addPinned: (offer: JobOffer) => void;
  removePinned: (uid: string) => void;
  togglePinned: (offer: JobOffer) => void;
  isPinned: (uid: string) => boolean;
};

export const useOffreStore = create<OffreState>()(
  persist(
    (set, get) => ({
      pinnedOffers: [],
      addPinned: (offer) =>
        set((state) => ({
          pinnedOffers: state.pinnedOffers.some((item) => item.uid === offer.uid)
            ? state.pinnedOffers
            : [...state.pinnedOffers, offer],
        })),
      removePinned: (uid) =>
        set((state) => ({
          pinnedOffers: state.pinnedOffers.filter((offer) => offer.uid !== uid),
        })),
      togglePinned: (offer) => {
        if (get().isPinned(offer.uid)) {
          get().removePinned(offer.uid);
          return;
        }

        get().addPinned(offer);
      },
      isPinned: (uid) => get().pinnedOffers.some((offer) => offer.uid === uid),
    }),
    {
      name: "offres-pinned-store",
      partialize: (state) => ({ pinnedOffers: state.pinnedOffers }),
    },
  ),
);
