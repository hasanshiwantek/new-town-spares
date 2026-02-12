import React from 'react';
// Next.js के लिए: Image कंपोनेंट को इंपोर्ट करें (अगर आप Next.js उपयोग कर रहे हैं)
import Image from 'next/image'; 
// या सामान्य React के लिए: import Logo from '...';

// 1. Feature Card Interface
interface FeatureCard {
  icon: string; // Tailwind class or image path for icon
  title: string;
  description: string;
}

const AuthorizedSupplier: React.FC = () => {
  // 2. Data for the four feature cards
  const featureData: FeatureCard[] = [
    {
      icon: "/best-price.png", // Using emoji as placeholder for Best Price icon
      title: 'Best Price',
      description:
        'Get unbeatable deals on top-quality new and refurbished IT equipment — without compromising on performance.',
    },
    {
      icon: "/free-delivery.png", // Using emoji as placeholder for Delivery icon
      title: 'Free Delivery up to 10 lbs',
      description:
        'Enjoy fast and reliable shipping on lightweight orders, delivered safely to your doorstep at no extra cost.',
    },
    {
      icon: "/money.png", // Using emoji as placeholder for Secure Payment icon
      title: 'Secure Payment Methods',
      description:
        'Shop confidently with multiple payment options backed by advanced encryption and data protection.',
    },
    {
      icon: "/support 2.png", // Using emoji as placeholder for 24/7 Support icon
      title: '24/7 Support',
      description:
        'Our expert team is always available to assist you — anytime, anywhere, with quick and reliable help.',
    },
  ];

const FeatureCard: React.FC<FeatureCard> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center border-y justify-center text-center px-6 bg-[#FAFAFA] border-r border-gray-200 last:border-r-0 h-[28.2rem]">
    {/* Icon Area - Using Next.js Image */}
    <div className="mb-4 inline-block w-16 h-16 relative">
      <Image
        src={icon}
        alt={title + " icon"}
        fill
        className="object-contain"
      />
    </div>

    <h3 className="h3-secondary  !text-[#2A2A2A] mb-3">{title}</h3>
    <p className="h5-regular !text-[#666666] mb-4">{description}</p>
    <a
      href="#"
      className="h4-rwgular !text-[#F15939]"
    >
      Learn more
    </a>
  </div>
);
  return (
    <div className="max-w-full mx-auto bg-[#FAFAFA]">
      
      {/* 1. SAM.GOV Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 py-16 md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%]">
        
        {/* SAM.GOV Logo Placeholder */}
        <div className="w-[35.1%]">
          <Image
                     src="/sam-gov-logo.png"
                     alt="Man holding laptop, representing IT solutions"
                     width={500}
                     height={700}
                     className="w-full 2xl:w-[69.2%] h-[85px] object-contain m-auto"
                   />
        </div>

        {/* Text Content */}
        <div className="max-w-[63.3%] text-center md:text-left">
          <p className="h5-medium px-2 py-1 inline-block rounded-full mb-2 bg-[#00000005]">
            CAGE Code: <span className='text-[#F15939]'>9EQB2</span>
          </p>
          <h2 className="h1-secondary-medium !text-[#2A2A2A] mb-3">
            AUTHORIZED SUPPLIER ON SAM.GOV
          </h2>
          <p className="h4-regular !text-[#666666]">
            We feel tremendous pride in having achieved verified vendor status due to our ongoing commitment to 
            adhering to the exacting requirements set by the US Federal Contractor Registration. We take great pride 
            in our membership among the renowned ranks of SAM participants, which further establishes our standing 
            as a reputable and illustrious company in the field of contracting and procurement.
          </p>
        </div>
      </div>
      
      {/* 2. Four Feature Cards Section */}
      <div className="bg-[#FAFAFA] rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-gray-200 md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%]">
        {featureData.map((feature, index) => (
          <FeatureCard 
            key={index} 
            icon={feature.icon} 
            title={feature.title} 
            description={feature.description} 
          />
        ))}
      </div>

      {/* 3. DUN & BRADSTREET RATING Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-16 md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%]">
        
        {/* D&B Logo Placeholder */}
          {/* Replace with your Dun & Bradstreet logo image */}
          <div className="w-[35.1%]">
    
             <Image
                     src="/bradstreet.png"
                     alt="Man holding laptop, representing IT solutions"
                     width={500}
                     height={700}
                     className="w-full 2xl:w-[56%] h-[56px] object-contain m-auto"
                   />
          </div>

        {/* Text Content */}
        <div className="max-w-[63.3%] text-center md:text-left">
             <p className="h5-medium px-2 py-1 inline-block rounded-full mb-2 bg-[#00000005]">
              D-U-N-S® Number is:  <span className='text-[#F15939]'>117396845</span>
          </p>
          <h2 className="h1-secondary-medium !text-[#2A2A2A] mb-3">
            DUN & BRADSTREET RATING
          </h2>
          <p className="h4-regular !text-[#666666]">
            Our continuous commitment centers on providing the highest standard computer accessories to our 
            esteemed consumers. Our outstanding Duns & Bradstreet rating, which is a loud statement of not just 
            our unrivaled financial stability but also the formidable prowess we wield within the business, is 
            something we proudly announce. This excellent grade positions us as an unshakable pillar of strength 
            in the field of computer accessory provision and serves as a tangible witness to the unwavering trust 
            our stakeholders may place in our unwavering dedication to excellence.
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default AuthorizedSupplier;