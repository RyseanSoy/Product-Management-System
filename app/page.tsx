import Image from "next/image";
import { getHomepageContent } from "@/lib/redis";
import { CldImage } from 'next-cloudinary';

export const dynamic = "force-dynamic";

export default async function Home() {
  // Load the homepage text from Redis before rendering the page.
  const content = await getHomepageContent();

  return (
    <section className="page">
      <p className="eyebrow">{content.title}</p>
      <h1>{content.title}</h1>

      <div className="homeHero">

        <Image
          className="homeHeroImage"
          src="https://res.cloudinary.com/ec7ulxcg/image/upload/v1794410735/homepage2.jpg"
          width={200}
          height={200}
          alt={content.imageAlt}
        />

        <div className="homeHeroText">
          <h2>{content.heading}</h2>
          <p>{content.description}</p>
        </div>
      </div>
    </section>
  );
}
