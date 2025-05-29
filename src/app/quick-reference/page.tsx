import { QuickReferenceCards } from "@/src/components/quick-reference-cards";
import { sampleQuickReferenceData } from "@/src/data/quick-reference-data";

export default function QuickReferencePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Quick Reference Cards
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Quick reference materials and cheat sheets for developers - perfect
          for rapid learning and interview preparation.
        </p>
      </div>
      <QuickReferenceCards items={sampleQuickReferenceData} />
    </div>
  );
}
