import Image from "next/image";

interface FeatureCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

export const FeatureCard = ({ imageUrl, title, description }: FeatureCardProps) => (
  <div className="group w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-scale-in">
    <div className="relative h-56 w-full overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);
