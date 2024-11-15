import Image from "next/image";

interface FeatureCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

export const FeatureCard = ({ imageUrl, title, description }: FeatureCardProps) => (
  <div className="w-80 p-4 text-center bg-gray-50 rounded-lg shadow-md">
    <Image src={imageUrl} alt={title} width={320} height={200} className="rounded-t-lg" />
    <h3 className="text-2xl font-semibold mt-4">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
  </div>
);
