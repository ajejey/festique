import { Target, Rocket } from 'lucide-react';

export default function MissionVisionSection() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      {/* Mission */}
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-4">
          <Target className="text-[#FF6B6B] mr-4" size={48} />
          <h2 className="font-playfair text-2xl font-bold text-neutral-900">Our Mission</h2>
        </div>
        <p className="font-montserrat text-neutral-700 leading-relaxed">
          To revolutionize the running and event ecosystem by creating a holistic platform that empowers runners, supports event organizers, and builds a vibrant, supportive community that grows together.
        </p>
      </div>

      {/* Vision */}
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-4">
          <Rocket className="text-[#45B7D1] mr-4" size={48} />
          <h2 className="font-playfair text-2xl font-bold text-neutral-900">Our Vision</h2>
        </div>
        <p className="font-montserrat text-neutral-700 leading-relaxed">
          To become the most comprehensive and community-driven event platform that transforms how runners discover events, organizers create experiences, and athletes support each other's journey of continuous improvement and personal growth.
        </p>
      </div>
    </section>
  );
}
