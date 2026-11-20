"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useBooking } from "@/context/BookingContext";
import { getCabinById } from "@/data/cabinsData";
import InteriorHero from "@/components/InteriorHero";
import InteriorDetailGallery from "@/components/InteriorDetailGallery";
import InteriorLightbox from "@/components/InteriorLightbox";
import AmenitiesSection from "@/components/AmenitiesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function InteriorView() {
  const { activeCabinId } = useBooking();
  const cabin = getCabinById(activeCabinId);

  // El ambiente activo se asocia a la cabaña: al cambiar de cabaña vuelve a 0
  const [roomState, setRoomState] = useState({ cabinId: activeCabinId, index: 0 });
  const roomIndex = roomState.cabinId === activeCabinId ? roomState.index : 0;
  const setRoomIndex = (index) => setRoomState({ cabinId: activeCabinId, index });

  const [lightbox, setLightbox] = useState(null);
  const items = [...cabin.rooms, ...cabin.detailGallery];

  return (
    <div className="min-h-dvh bg-[#050505]">
      <InteriorHero
        cabin={cabin}
        roomIndex={roomIndex}
        onRoom={setRoomIndex}
        onOpenLightbox={setLightbox}
      />
      <InteriorDetailGallery cabin={cabin} onOpen={setLightbox} />
      <AmenitiesSection />
      <ContactSection />
      <Footer />

      <AnimatePresence>
        {lightbox !== null && (
          <InteriorLightbox
            items={items}
            index={Math.min(lightbox, items.length - 1)}
            onIndex={setLightbox}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
