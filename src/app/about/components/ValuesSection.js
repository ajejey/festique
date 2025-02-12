import { 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Heart 
} from 'lucide-react';

export default function ValuesSection() {
  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'Prioritizing collective growth over individual achievements, creating a supportive environment where runners motivate and uplift each other.',
      color: 'text-[#4ECDC4]'
    },
    {
      icon: TrendingUp,
      title: 'Continuous Improvement',
      description: 'Encouraging runners to keep pushing their limits, providing resources and support to help athletes grow and achieve more.',
      color: 'text-[#45B7D1]'
    },
    {
      icon: Shield,
      title: 'Transparency & Trust',
      description: 'Building a platform based on genuine connections, providing clear and honest information for runners and organizers.',
      color: 'text-[#FF6B6B]'
    },
    {
      icon: Zap,
      title: 'Empowerment Through Technology',
      description: 'Leveraging data and innovative tools to simplify event organization and provide insights that help runners and organizers succeed.',
      color: 'text-[#4ECDC4]'
    },
    {
      icon: Heart,
      title: 'Inclusivity & Accessibility',
      description: 'Making running events accessible to everyone, supporting diverse running communities and initiatives that bring people together.',
      color: 'text-[#45B7D1]'
    }
  ];

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-12">
        <h2 className="font-playfair text-3xl font-bold text-neutral-900 mb-4">
          Our Core Values
        </h2>
        <p className="font-montserrat text-neutral-700 max-w-2xl mx-auto">
          The principles that drive everything we do at Festique
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <div 
              key={value.title} 
              className="bg-neutral-50 p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex justify-center mb-4">
                <Icon className={`${value.color}`} size={48} />
              </div>
              <h3 className="font-playfair text-xl font-bold text-neutral-900 mb-3">
                {value.title}
              </h3>
              <p className="font-montserrat text-neutral-700">
                {value.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
