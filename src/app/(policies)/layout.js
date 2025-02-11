import { Montserrat } from "next/font/google";

export const metadata = {
  title: "Festique - Policies",
  description: "Legal policies and terms for Festique - Your premier event ticketing platform",
};

export default function PoliciesLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-20 md:py-20">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
