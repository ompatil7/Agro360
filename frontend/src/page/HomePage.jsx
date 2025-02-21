import { Shield, Leaf, Brain, ChartBar, Languages, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ImageCarousel = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = ["/picture1.png", "/picture2.png"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl shadow-2xl">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentImage * 100}%)` }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Platform Preview ${index + 1}`}
            className="w-full flex-shrink-0 object-cover"
          />
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full transition-colors ${currentImage === index ? "bg-white" : "bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Smart Contracts",
      description: "Automated insurance payouts using blockchain technology",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Crop Health Scan",
      description: "AI-powered image analysis for disease detection",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Advisor",
      description: "Personalized farming recommendations",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <ChartBar className="w-8 h-8" />,
      title: "Market Insights",
      description: "Real-time price predictions & trends",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Eco Metrics",
      description: "Sustainability tracking & reporting",
      color: "bg-teal-100 text-teal-600",
    },
    {
      icon: <Languages className="w-8 h-8" />,
      title: "Multi-Language",
      description: "Support for 15+ regional languages",
      color: "bg-rose-100 text-rose-600",
    },
  ];

  const steps = [
    {
      title: "Digital Farm Profile",
      description: "Create your farm's digital twin with our easy setup",
      icon: "🌱",
    },
    {
      title: "Smart Coverage",
      description: "Select AI-recommended insurance plans",
      icon: "🛡️",
    },
    {
      title: "Grow Protected",
      description: "Monitor & manage everything in real-time",
      icon: "📈",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white overflow-x-hidden">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-green-700 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-white">
                  Smart Crop Protection
                </span>
                <br />
                Powered by Blockchain & AI
              </h1>
              <p className="text-lg mb-8 text-emerald-100 max-w-2xl">
                Transform your farming with decentralized insurance solutions
                and AI-powered agricultural insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-emerald-800 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-lg"
                >
                  Get Started Free
                </motion.button>
                <button className="border-2 border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                  Watch Demo
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                <div className="absolute inset-0 border border-white/10 rounded-2xl" />
                <ImageCarousel />
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Next-Gen Farming Solutions
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Integrated technologies for complete farm management and risk
              protection
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <div
                  className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-green-50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Simple & Transparent Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three easy steps to secure your crops and optimize your yield
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 h-1 bg-emerald-200 hidden lg:block z-0" />
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative bg-white p-8 rounded-2xl shadow-lg text-center z-10"
              >
                <div className="w-20 h-20 bg-emerald-600 text-3xl rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-sm">
                  Step {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[url('/pattern.svg')] bg-cover">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm p-12 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Start Your Risk-Free Journey Today
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join 50,000+ farmers already protecting ₹1200+ crores worth of
              crops
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-600 text-white px-12 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg"
            >
              Protect Your Farm Now
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gradient-to-b from-emerald-800 to-emerald-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/10 pb-12">
            <div>
              <h4 className="text-lg font-semibold mb-4">Agro360</h4>
              <p className="text-emerald-200 text-sm leading-relaxed">
                Empowering farmers through blockchain technology and AI-driven
                agricultural solutions.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Solutions</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-emerald-200 hover:text-white">
                    Crop Insurance
                  </a>
                </li>
                <li>
                  <a href="#" className="text-emerald-200 hover:text-white">
                    Market Predictions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-emerald-200 hover:text-white">
                    Farm Analytics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-emerald-200 hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-emerald-200 hover:text-white">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-emerald-200 hover:text-white">
                    API Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-emerald-200 hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-emerald-200 hover:text-white">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="text-emerald-200 hover:text-white">
                    Support Portal
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-emerald-300 text-sm">
            © 2024 Agro360. All rights reserved.
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default HomePage;
// const HomeP
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
//       {/* Hero Section */}
//       <header className="bg-green-800 text-white">
//         <div className="container mx-auto px-6 py-16">
//           <div className="flex flex-col md:flex-row items-center justify-between">
//             <div className="md:w-1/2 mb-8 md:mb-0">
//               <h1 className="text-4xl md:text-5xl font-bold mb-6">
//                 Secure Your Harvest with Blockchain Technology
//               </h1>
//               <p className="text-lg mb-8">
//                 Smart farming meets smart insurance. Protect your crops with our
//                 AI-powered, blockchain-based insurance platform.
//               </p>
//               <div className="space-x-4">
//                 <button className="bg-white text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-green-100 transition-colors">
//                   Get Started
//                 </button>
//                 <button className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
//                   Learn More
//                 </button>
//               </div>
//             </div>
//             <div className="md:w-1/2">
//               <img
//                 src="/api/placeholder/600/400"
//                 alt="Farming Insurance"
//                 className="rounded-lg shadow-xl"
//               />
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Features Section */}
//       <section className="py-16">
//         <div className="container mx-auto px-6">
//           <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
//             Smart Solutions for Modern Farming
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: <Shield className="w-12 h-12 text-green-600" />,
//                 title: "Blockchain Security",
//                 description:
//                   "Secure and transparent insurance coverage backed by blockchain technology",
//               },
//               {
//                 icon: <Camera className="w-12 h-12 text-green-600" />,
//                 title: "Crop Assessment",
//                 description:
//                   "AI-powered image recognition for instant crop health analysis",
//               },
//               {
//                 icon: <Brain className="w-12 h-12 text-green-600" />,
//                 title: "Smart Recommendations",
//                 description:
//                   "Personalized farming advice based on data analytics",
//               },
//               {
//                 icon: <ChartBar className="w-12 h-12 text-green-600" />,
//                 title: "Price Predictions",
//                 description:
//                   "Market trend analysis to help you make informed decisions",
//               },
//               {
//                 icon: <Leaf className="w-12 h-12 text-green-600" />,
//                 title: "Easy Claims",
//                 description:
//                   "Automated smart contracts for quick and hassle-free payouts",
//               },
//               {
//                 icon: <Languages className="w-12 h-12 text-green-600" />,
//                 title: "Multi-language Support",
//                 description: "Access the platform in your preferred language",
//               },
//             ].map((feature, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
//               >
//                 <div className="mb-4">{feature.icon}</div>
//                 <h3 className="text-xl font-semibold mb-2 text-gray-800">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-600">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="bg-green-50 py-16">
//         <div className="container mx-auto px-6">
//           <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
//             How It Works
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 step: "1",
//                 title: "Register Your Farm",
//                 description:
//                   "Sign up and provide basic details about your farming operation",
//               },
//               {
//                 step: "2",
//                 title: "Choose Coverage",
//                 description:
//                   "Select from our flexible insurance plans tailored to your needs",
//               },
//               {
//                 step: "3",
//                 title: "Start Protection",
//                 description:
//                   "Get immediate coverage and access to all smart farming tools",
//               },
//             ].map((step, index) => (
//               <div key={index} className="text-center">
//                 <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
//                   {step.step}
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
//                 <p className="text-gray-600">{step.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="bg-green-800 text-white py-16">
//         <div className="container mx-auto px-6 text-center">
//           <h2 className="text-3xl font-bold mb-6">
//             Ready to Secure Your Farm's Future?
//           </h2>
//           <p className="text-lg mb-8 max-w-2xl mx-auto">
//             Join thousands of farmers who have already transformed their farming
//             practice with our smart insurance platform.
//           </p>
//           <button className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-100 transition-colors">
//             Get Started Now
//           </button>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-green-900 text-white py-8">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div>
//               <h4 className="text-lg font-semibold mb-4">About Us</h4>
//               <p className="text-green-100">
//                 Revolutionizing agricultural insurance through blockchain
//                 technology and AI.
//               </p>
//             </div>
//             <div>
//               <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
//               <ul className="space-y-2">
//                 <li>
//                   <a href="#" className="text-green-100 hover:text-white">
//                     Home
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-green-100 hover:text-white">
//                     Features
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-green-100 hover:text-white">
//                     How It Works
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-green-100 hover:text-white">
//                     Contact
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-lg font-semibold mb-4">Resources</h4>
//               <ul className="space-y-2">
//                 <li>
//                   <a href="#" className="text-green-100 hover:text-white">
//                     FAQ
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-green-100 hover:text-white">
//                     Support
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-green-100 hover:text-white">
//                     Terms
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-green-100 hover:text-white">
//                     Privacy
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
//               <ul className="space-y-2">
//                 <li className="text-green-100">
//                   Email: support@farmsecure.com
//                 </li>
//                 <li className="text-green-100">Phone: +1 (555) 123-4567</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };
// const images = ["./../../Picture1.png", "./../../Picture2.png"];
// export default HomePage;