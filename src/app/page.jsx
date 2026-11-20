"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useBooking } from "@/context/BookingContext";
import TopNav from "@/components/TopNav";
import ExteriorHero from "@/components/ExteriorHero";
import InteriorView from "@/components/InteriorView";
import BookingDrawer from "@/components/BookingDrawer";
import MyBookingsDrawer from "@/components/MyBookingsDrawer";

export default function Home() {
  const { viewMode, pendingScroll, setPendingScroll } = useBooking();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewMode]);

  useEffect(() => {
    if (viewMode !== "interior" || !pendingScroll) return;
    // Espera a que termine la transición y monte la vista interior
    const t = setTimeout(() => {
      document.getElementById(pendingScroll)?.scrollIntoView({ behavior: "smooth" });
      setPendingScroll(null);
    }, 800);
    return () => clearTimeout(t);
  }, [viewMode, pendingScroll, setPendingScroll]);

  return (
    <main>
      <AnimatePresence mode="wait">
        {viewMode === "interior" ? (
          <motion.div
            key="interior"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <InteriorView />
          </motion.div>
        ) : (
          <motion.div
            key="exterior"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <TopNav />
            <ExteriorHero />
          </motion.div>
        )}
      </AnimatePresence>

      <BookingDrawer />
      <MyBookingsDrawer />
    </main>
  );
}
