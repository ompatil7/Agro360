// FeaturesSectionDemo.jsx
import React from "react";
import { IconAi, IconCurrencyBitcoin, IconCloud, IconHelp, IconHeart, IconMan } from "@tabler/icons-react";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "AI-Powered Insights",
      description: "Personalized crop recommendations, fertilizer advice, and disease detection.",
      icon: <IconAi size={40} className="text-green-500" />,
    },
    {
      title: "Blockchain Transparency",
      description: "Immutable records of all transactions and insurance contracts.",
      icon: <IconCurrencyBitcoin size={40} className="text-yellow-500" />,
    },
    {
      title: "Real-Time Weather Data",
      description: "Weather data to trigger alerts and inform insurance claims.",
      icon: <IconCloud size={40} className="text-blue-500" />,
    },
    {
      title: "Farmer-Centric Interface",
      description: "Simplified processes tailored for ease of use.",
      icon: <IconMan size={40} className="text-purple-500" />,
    },
    {
      title: "Secure and Reliable",
      description: "We are available 100% of the time. At least our AI Agents are.",
      icon: <IconHelp size={40} className="text-red-500" />,
    },
    {
      title: "Exceptional Support",
      description: "All time high quality 24/7 support.",
      icon: <IconHeart size={40} className="text-pink-500" />,
    },
  ];
  return (
    <div className="py-12 bg-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Key Features That Set Us Apart</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// const Feature = ({ title, description, icon, index }) => (
//   <div className="flex flex-col lg:border-r py-10 relative">
//     <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
//       {icon}
//     </div>
//     <h3 className="text-lg font-bold mb-2">{title}</h3>
//     <p className="text-sm text-neutral-600 dark:text-neutral-300">
//       {description}
//     </p>
//   </div>
// );
