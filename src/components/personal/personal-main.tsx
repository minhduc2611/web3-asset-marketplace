"use client";
import { useEffect, useState } from "react";
import FrameFigma from "./components/FrameFigma";
import { cn } from "@/lib/utils";

const FirstSlide = () => {
  return (
    <div className="flex flex-col items-center justify-start h-full bg-blue-100 rounded-lg overflow-y-scroll py-16">
      <h2 className="text-2xl font-bold text-blue-800">
        A1: Self-Introduction
      </h2>
      <div className="w-full h-auto px-24">
        <ul className="my-3 list-disc list-inside">
          <li>
            Hi, My name is Duc, I'm a Software Engineering student at
            Haaga-Helia University of Applied Sciences.
            <br />
            I have a strong passion for software development and digital
            services design.
            <br />
            I have experience in developing web applications using React,
            Node.js, Golang.
            <br />
            I have also worked on a few projects that involve designing digital
            services.
            <br />
            I have a good understanding of the principles of user experience
            design and I'm familiar with tools like Figma.
            <br />
            I'm always eager to learn new technologies and improve my skills in
            digital services design.
          </li>
        </ul>
        <div className="my-3">
          <li>
            I have passed the Introduction to Digital Services and Introduction
            to Software Development.
          </li>
        </div>
        <div className="my-3">
          <li>
            Tools and methods I know that can be used in digital service design
            and prototyping: I have experience in using Figma to design user
            flows, site maps, and so on.
          </li>
        </div>
        <div className="my-3">
          <li>
            My main objectives are to design a great service that meets the
            needs of the users . Here is my current work, but I don't know if
            this is a good design or not:
            <br />
            <FrameFigma />
            <br />
            So I am eager to learn more.
          </li>
        </div>
        <div className="my-3">
          <li>
            Are there any known obstacles on your way? yes, I don't know what is
            a beautiful design.
          </li>
        </div>
      </div>
    </div>
  );
};
const SecondSlide = () => (
  <div className="bg-green-100 flex flex-col items-center justify-start h-full rounded-lg overflow-y-scroll py-16">
    <h2 className="text-2xl font-bold text-green-800">A2: W3 CSS Tutorial</h2>
    <div>
      <div className="flex flex-row">
        <img
          className="h-48 w-96 object-contain"
          src="https://i0.wp.com/www.tutorialsavvy.com/wp-content/uploads/2015/09/image81.png"
          alt="w3css"
        />
        <img
          className="h-48 w-96 object-contain"
          src="https://localo.com/assets/img/definitions/what-is-bootstrap.webp"
          alt="bootstrapcss"
        />
        <img
          className="h-48 w-96 object-contain"
          src="https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ftlqh86jgl25x41gf9eed.png"
          alt="bootstrapcss"
        />
      </div>
      <ul className="my-3 list-disc list-inside">
        <li>
          W3.CSS Framework is a modern, responsive CSS framework developed by
          W3Schools, it's light weight, responsive and free to use.
        </li>
        <li>
          W3.CSS Framework includes css utility classes, we can use it to build
          website with out actually write any css code.
        </li>
        <li>
          I love css utility frameworks because of it convenience. My personal
          portfolio is also developed by this kind of framework, it's call
          tailwindCss.
        </li>
      </ul>
    </div>
  </div>
);

const ThirdSlide = () => (
  <div className="bg-yellow-100 flex flex-col items-center justify-start h-full rounded-lg overflow-y-scroll py-16">
    <h2 className="text-2xl font-bold text-yellow-800">
      A3: Building Team Web Portfolio
    </h2>
    <div>
      <div className="flex flex-row justify-center">
        <img
          className="h-48 w-96 object-contain"
          src="https://1000logos.net/wp-content/uploads/2023/02/Canva-logo.png"
          alt="w3css"
        />
      </div>
      <ul className="my-3 list-disc list-inside">
        <li>
          We have decided that we'll use Canva to create our Team Web Portfolio
          page/site.
        </li>
        <li>
          Because it is super easy to build a web page with Canva, we just have
          to drag and drop components to the the canvas And Canva handles the
          rest for us.
        </li>
        <li>
          For my personal portfolio, I use conventional HTML, CSS and javascript
          to build my website which you are reading right now.
        </li>
      </ul>
    </div>
  </div>
);

const FourthSlide = () => (
  <div className="bg-red-100 flex flex-col items-center justify-start h-full rounded-lg overflow-y-scroll py-16 px-16">
    <h2 className="text-2xl font-bold text-red-800">
      A4: The Immutable Rules of UX by Jakob Nielsen
    </h2>
    <div>
      <div className="flex flex-row justify-center">
        <img
          className="h-48 w-96 object-contain"
          src="https://miro.medium.com/v2/resize:fit:1400/1*JWStOGfx3DvZDDphuMNvgQ.jpeg"
          alt="w3css"
        />
      </div>
      <ul className="my-3 list-disc list-inside">
        <li>
          This video includes keynotes by Jakob Nielsen is a great video talking
          about immutable rules remain constant in the field of UX.
        </li>
        <div>Highlights</div>
        <li>
          Nielsen outlines three design principles that have lived by time, such
          as early focus on users, empirical measurement, and iterative design.{" "}
          <br />
          These principles are the foundation but people often overlooked those
          in practice. <br />
          There is also a gap between knowledge and application in UX design.
          The speaker suggested that education must adherence to these
          principles to achieve more successful outcome.
        </li>
        <li>
          Nielsen demonstrates how understanding user context became incredibly
          important. Successful UX design must consider diverse user backgrounds
          and languages.
        </li>
        <li>
          Usability Testing with real users is also very important as many
          design failures because of a lack of user testing. What we should do
          is to integrating user feedback into every stage of the design
          process, so that we can create more user friendly product.
        </li>
        <li>
          Nielsen mentioned that as websites improve, users’ expectations rise ,
          creating a continuous cycle of pressure to meet those expectation. The
          designers need to focus not just on improving products, but also on
          managing user expectations effectively.
        </li>
        <li>
          Nielsen showed two critical gaps in user experience:the first one gap
          is the utility gap which questions about how the product meets the
          user need. And the second gap is the usability gap which question
          about how users can effectively use the product. This showed that even
          a well-designed features may fail if users can not easily access or
          use them.
        </li>
        <li>
          Due to both utility and usability issues, a big percentage of user
          needs are unmet. To solve this, designing an AI system is crucial
          because it make everything easier for users to engage with, thereby
          enhancing overall experience.
        </li>
        <li>
          Nielsen also said that UX is a long term work to do and it require
          continuous refinement and adaptation.
        </li>
        <li>
          As user needs and technologies evolve everyday, designers must stay
          updated all the time, continuously improving and ensuring that the
          products meet users expectations.
        </li>
      </ul>
    </div>
  </div>
);

const FifthSlide = () => (
  <div className="bg-purple-100 flex flex-col items-center justify-start h-full rounded-lg overflow-y-scroll py-16">
    <h2 className="text-2xl font-bold text-purple-800">
      Fifth and Final Slide
    </h2>
  </div>
);
export default PersonalMain;

const pages = [FirstSlide, SecondSlide, ThirdSlide, FourthSlide, FifthSlide];

function PersonalMain() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    // event listen to key > or
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === ">") {
        handleNext();
      } else if (event.key === "ArrowLeft" || event.key === "<") {
        handlePrev();
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleNext = () => {
    setIndex((prevIndex) =>
      prevIndex === pages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? pages.length - 1 : prevIndex - 1
    );
  };
  return (
    <div
      id="default-carousel"
      className="relative w-full h-full"
      data-carousel="slide"
    >
      <div className="relative h-56 overflow-hidden rounded-lg md:h-full">
        {pages.map((PageComponent, idx) => {
          return (
            <div
              className={cn(
                "duration-700 ease-in-out w-full h-full p-5",
                index === idx ? "relative" : "hidden"
              )}
            >
              <PageComponent />
            </div>
          );
        })}
      </div>
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        <button
          type="button"
          className="w-3 h-3 rounded-full"
          aria-current="true"
          aria-label="Slide 1"
          data-carousel-slide-to="0"
        ></button>
        <button
          type="button"
          className="w-3 h-3 rounded-full"
          aria-current="false"
          aria-label="Slide 2"
          data-carousel-slide-to="1"
        ></button>
        <button
          type="button"
          className="w-3 h-3 rounded-full"
          aria-current="false"
          aria-label="Slide 3"
          data-carousel-slide-to="2"
        ></button>
        <button
          type="button"
          className="w-3 h-3 rounded-full"
          aria-current="false"
          aria-label="Slide 4"
          data-carousel-slide-to="3"
        ></button>
        <button
          type="button"
          className="w-3 h-3 rounded-full"
          aria-current="false"
          aria-label="Slide 5"
          data-carousel-slide-to="4"
        ></button>
      </div>
      <button
        onClick={() => {
          handlePrev();
        }}
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-prev
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-800/30 dark:bg-gray-800/30 group-hover:bg-amber-800/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-amber-800 dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        onClick={() => {
          handleNext();
        }}
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-next
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-800/30 dark:bg-gray-800/30 group-hover:bg-amber-800/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-amber-800 dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
}
