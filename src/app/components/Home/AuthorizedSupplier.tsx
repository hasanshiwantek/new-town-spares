import React from 'react';
import Image from 'next/image';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

const AuthorizedSupplier: React.FC = () => {
  const featureData: FeatureCard[] = [
    {
      icon: "/best-price.png",
      title: 'Best Price',
      description:
        'Get unbeatable deals on top-quality new and refurbished IT equipment — without compromising on performance.',
    },
    {
      icon: "/free-delivery.png",
      title: 'Free Delivery up to 10 lbs',
      description:
        'Enjoy fast and reliable shipping on lightweight orders, delivered safely to your doorstep at no extra cost.',
    },
    {
      icon: "/money.png",
      title: 'Secure Payment Methods',
      description:
        'Shop confidently with multiple payment options backed by advanced encryption and data protection.',
    },
    {
      icon: "/support 2.png",
      title: '24/7 Support',
      description:
        'Our expert team is always available to assist you — anytime, anywhere, with quick and reliable help.',
    },
  ];

  const FeatureCard: React.FC<FeatureCard> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center border-y justify-center text-center px-6 bg-[#FAFAFA] border-r border-gray-200 last:border-r-0 h-[28.2rem]">
      <div className="mb-4 inline-block w-16 h-16 relative">
        <Image
          src={icon}
          alt={title + " icon"}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="h3-secondary !text-[#2A2A2A] mb-3">{title}</h3>
      <p className="h5-regular !text-[#666666] mb-4">{description}</p>
      <a href="#" className="h4-rwgular !text-[#F15939]">
        Learn more
      </a>
    </div>
  );

  return (
    <div className="max-w-full mx-auto bg-[#FAFAFA]">

      {/* SAM.GOV + D&B — Ek hi row mein, dono cards side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Card 1: SAM.GOV */}
        <div className="flex flex-col border border-gray-200 rounded-lg p-7" style={{ minHeight: '540px' }}>
          {/* Logo — Top Center */}
          <div className="flex justify-center items-center h-[121px]">
            <Image
              src="/samlogo.webp"
              alt="SAM.GOV Logo"
              width={342}
              height={121}
              className="object-contain max-w-[342px] h-auto"
            />
          </div>

          {/* Content — Bottom Left Aligned */}
          <div className="text-left mt-auto min-h-[297px]">
            <h2 className="text-[2.1rem] !text-[#333333] mb-3">
              Authorized Supplier on SAM.gov
            </h2>
            <p className="text-[1.42rem] !text-[#808080]">
              We feel tremendous pride in having achieved verified vendor status due to our ongoing commitment to
              adhering to the exacting requirements set by the US Federal Contractor Registration. We take great pride
              in our membership among the renowned ranks of SAM participants, which further establishes our standing
              as a reputable and illustrious company in the field of contracting and procurement.
            </p>
          </div>
        </div>

        {/* Card 2: D&B */}
        <div className="flex flex-col border border-gray-200 rounded-lg p-7" style={{ minHeight: '540px' }}>
          {/* Logo — Top Center */}
          <div className="flex justify-center items-center h-[121px]">
            <Image
              src="/dunlogo.webp"
              alt="Dun & Bradstreet Logo"
              width={342}
              height={121}
              className="object-contain max-w-[342px] h-auto"
            />
          </div>

          {/* Content — Bottom Left Aligned */}
          <div className="text-left mt-auto min-h-[297px]">
            <h2 className="text-[2.1rem] !text-[#333333] mb-3">
              Dun & Bradstreet Rating
            </h2>
            <p className="text-[1.42rem] !text-[#808080]">
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

    </div>
  );
};

export default AuthorizedSupplier;