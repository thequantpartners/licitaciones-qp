import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MetricsBento } from "@/components/MetricsBento";
import { ComparisonSection } from "@/components/ComparisonSection";
import { PdfMockupSection } from "@/components/PdfMockupSection";
import { OfferSection } from "@/components/OfferSection";
import { FaqSection } from "@/components/FaqSection";
import { FooterDisclaimers } from "@/components/FooterDisclaimers";

export default function Home() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100 flex flex-col">
      <Navbar />
      <Hero />
      <MetricsBento />
      <ComparisonSection />
      <PdfMockupSection />
      <OfferSection />
      <FaqSection />
      <FooterDisclaimers />
    </main>
  );
}
