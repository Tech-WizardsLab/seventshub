import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { HomepageExperience } from "@/components/marketing/homepage-experience";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f9fc] text-slate-900">
      <PublicHeader />

      <main>
        <HomepageExperience />
      </main>

      <PublicFooter />
    </div>
  );
}