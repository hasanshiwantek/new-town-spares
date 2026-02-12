import React from "react";
import Image from "next/image";

// Placeholder images
const IMAGE_ENVIRONMENT = "/about/about-social-img1.png";
const IMAGE_COMMUNITY = "/about/about-social-img2.png";
const IMAGE_ETHICS = "/about/about-social-img3.png";

const highlightColor = "text-[#F15939]"; // Highlight color

const cards = [
  {
    image: IMAGE_ENVIRONMENT,
    alt: "Environmental sustainability with eco icons",
    title:
      "Embracing sustainability in Information and Communication Technology",
    description:
      "We prioritize minimizing our environmental impact through responsible sourcing, energy-efficient products, and promoting a circular economy by recycling and managing e-waste.",
  },
  {
    image: IMAGE_COMMUNITY,
    alt: "Group of diverse, happy people",
    title: "Empowering Communities and Fostering Inclusivity",
    description:
      "Our commitment to social responsibility includes supporting projects that provide education, training, and resources to underprivileged communities, and fostering a diverse and inclusive workplace that values equal opportunities.",
  },
  {
    image: IMAGE_ETHICS,
    alt: "Business people with a glowing globe representing ethical practices",
    title: "Leading the Way: Ethical Practices and Industry Collaboration",
    description:
      "As a responsible ICT supplier, we demonstrate ethical business practices, transparency, and actively collaborate with partners to address global social and environmental challenges.",
  },
];

const SocialResponsibilitySection = () => {
  return (
    <section className="bg-white ">
      <div className="py-6 md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%]">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="h1-lg leading-tight">
            Our Approach to Social{" "}
            <span className={highlightColor}>Responsibility</span>
            <br />
            and <span className={highlightColor}>Sustainability</span>
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white  overflow-hidden flex flex-col  2xl:min-h-[600px] h-auto "
            >
              <div className="relative w-full  h-[250px] sm:h-[300px] lg:h-[200px]   xl:h-[300px]  2xl:h-[400px]">
                <Image
                  src={card.image}
                  alt={card.alt}
                  width={500}
                  height={500}
                  className="object-cover w-full h-full sm:h-[300px] lg:h-[200px]   xl:h-[300px]  2xl:h-[400px] rounded-xl "
                />
              </div>
              <div className="p-6 flex flex-col  flex-grow ">
                <h3 className="h3-24px-medium   mb-2 ">{card.title}</h3>
                <p className="h6-18-px-regular  flex-grow">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialResponsibilitySection;
