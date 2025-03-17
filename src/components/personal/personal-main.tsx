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
  <div className="bg-purple-100 flex flex-col items-center justify-start h-full rounded-lg overflow-y-scroll py-16 px-48">
    <h2 className="text-2xl font-bold text-purple-800">
      A5: Working as a Digital Designer
    </h2>
    <div>
      <div className="flex flex-row justify-center">
        <img
          className="aspect-[16/3] h-60 object-contain"
          src="https://media.geeksforgeeks.org/wp-content/uploads/20230209175403/Different-Between-UI-and-UX.png"
          alt="w3css"
        />
      </div>
      <ul className="my-3 list-disc list-inside">
        <li>
          I learned that there are different types of designers: graphic
          designers, branding designers, website designers, UI designers, visual
          designers, illustrators, UI/UX designers, and so on.
        </li>
        <li>
          What kind of designer do I want to be? I want to be a UI/UX designer
          who designs components and pages—and eventually, a product that
          everyone can use to achieve their goals. I also want to focus more on
          research and conceptual development.
        </li>
        <li>
          In the video, the speaker introduced himself as a Product Designer. He
          conducted research, checked with colleagues to understand customer
          needs, wrote tickets, and held meetings to discuss solutions. Then, he
          designed the product, focusing on UI elements.
        </li>
        <li>
          He talked about the skills required to become a Product Designer,
          which include both hard and soft skills. Hard skills involve tools
          like Photoshop and Figma, while soft skills include time management,
          communication, leadership, and collaboration.
        </li>
        <li>
          He also emphasized that hard skills alone aren’t enough to land the
          job I want. I need to develop strong soft skills because a Product
          Designer must communicate with stakeholders, interview users,
          facilitate workshops, and collaborate with developers.
        </li>
        <li>
          He mentioned that he isn't the best UI/UX designer, but his soft
          skills helped him secure the job he wanted. People enjoy working with
          him and recommend him because of his ability to communicate and
          collaborate effectively.
        </li>
        <li>
          Everything he mentioned felt familiar to me, as I have already done
          similar tasks during my course—working with users, collaborating with
          team members, and developing app concepts.
        </li>
        <li>
          I want to continue creating more apps and solutions in the future.
        </li>
      </ul>
    </div>
  </div>
);

const SixSlide = () => {
  return (
    <div className="flex flex-col items-center justify-start h-full bg-blue-100 rounded-lg overflow-y-scroll py-16 px-48">
      <h2 className="text-2xl font-bold text-blue-800">
        A6: Living with Complexity
      </h2>
      <div className="w-full h-auto px-24"></div>
    </div>
  );
};

const SevenSlide = () => (
  <div className="bg-green-100 flex flex-col items-center justify-start h-full rounded-lg overflow-y-scroll py-16 px-52">
    <h2 className="text-2xl font-bold text-green-800">
      A7: Reflections on Map, Sketch, and Decide
    </h2>
    <div>
      <div className="flex flex-row justify-center">
        <img
          className="aspect-[16/3] h-72  object-contain"
          src="https://assets.justinmind.com/wp-content/uploads/2019/07/ui-sketch-app-evidence.png"
          alt="w3css"
        />
      </div>
      <ul className="my-3 list-disc list-inside">
        <li>
          Some techniques our team has used include Empathy Mapping, HMW (How
          Might We), Lotus Blossom, Crazy 8, and sketching.
        </li>
        <li>
          Personally, I find these techniques valuable for designing solutions
          tailored to specific problems and users.
        </li>
        <li>
          Initially, we felt overwhelmed because we didn’t know where to start.
          There were thousands of possible solutions, making it difficult to
          decide.
        </li>
        <li>
          However, by taking it step by step—brainstorming pain points and
          potential solutions—we identified two key user problems to solve. As I
          progressed through the course, the solution became clearer. We gained
          a crystal-clear vision of what we wanted to achieve and executed it
          with confidence.
        </li>
        <li>
          At first, I was skeptical about the sketching phase, assuming it could
          be skipped in favor of jumping straight into Figma. However, I later
          realized that sketching—especially with pen and paper—is incredibly
          fast, practical, and highly effective for collaboration.
        </li>
      </ul>
    </div>
  </div>
);
const EightSlide = () => (
  <div className="bg-yellow-100 flex flex-col items-center justify-start h-full rounded-lg overflow-y-scroll py-16 px-60">
    <h2 className="text-2xl font-bold text-yellow-800">
      A8: Reflections on Journey Mapping
    </h2>
    <div>
      <div className="flex flex-row justify-center">
        <img
          className="h-48 w-96 object-contain"
          src="https://www.crmsoftwareblog.com/wp-content/uploads/Customer-Journey-emfluence.png"
          alt="w3css"
        />
      </div>
      <ul className="my-3 list-disc list-inside">
        <li>
          When creating a customer journey map, I first list all the pain points
          the user experiences, identify key touchpoints, and then design
          services accordingly to address their problems—especially when dealing
          with complex user interactions.
        </li>
        <li>
          As I understand it, a customer journey map helps the entire team share
          a unified vision of the user experience. It presents insights in a
          clear and visual way, ensuring that any design decisions are grounded
          in this framework. While we can be creative, the ultimate goal remains
          the same: solving user pain points at every interaction.
        </li>
        <li>
          In the future, I would use journey mapping whenever I need to solve
          user problems. It helps me think creatively while staying aligned with
          the goal. More importantly, it allows us to genuinely understand and
          care about users' pain points.
        </li>
        <li>
          One of the biggest challenges in this process is creating an accurate
          customer persona. Often, both the persona and the journey map rely
          more on assumptions than on meaningful data. To make the map truly
          useful, we need to gather insights through user interviews and
          analytics, ensuring that our design decisions are based on real user
          behavior rather than guesswork.
        </li>
      </ul>
    </div>
  </div>
);

const NineSlide = () => (
  <div className="bg-red-100 flex flex-col items-center justify-start h-full rounded-lg overflow-y-scroll py-16  px-60">
    <h2 className="text-2xl font-bold text-red-800">
      A9: UI Design Principles
    </h2>
    <div>
      <div className="flex flex-row justify-center">
        <img
          className="h-48 w-96 object-contain"
          src="https://miro.medium.com/v2/resize:fit:1400/1*JWStOGfx3DvZDDphuMNvgQ.jpeg"
          alt="w3css"
        />
      </div>

      <p>
        Create a check list (7-10 items): what would you like to go through when
        evaluating the work you/your team has done.
      </p>
      <ol className="my-3 list-disc list-inside">
        <li>
          [Balance] are the placement of components symmetrical, asymmetrical,
          or radial?
        </li>
        <li>
          [Proximity and Alignment] Grouping related elements enhances clarity
          and organization.
        </li>
        <li>
          [Proximity and Alignment] Proper alignment, especially when using
          grids, makes designs appear more professional by reducing arbitrary
          object placement.
        </li>
        <li>
          [Contrast] Proper alignment, especially when using grids, makes
          designs appear more professional by reducing arbitrary object
          placement.
        </li>
        <li>
          [White Space] Effective use of white space improves readability and
          reduces clutter.
        </li>
        <li>
          [Keep It Simple] Avoid using too many colors or unnecessary elements.
        </li>
        <li>
          [Keep It Simple] Eliminate superfluous details to enhance clarity and
          impact.
        </li>
        <li>
          [Keep It Simple] Always ask yourself: What am I representing? How am I
          representing it?
        </li>
        <li>
          [File Management] Organize working files and finalized files properly.
        </li>
      </ol>

      <p>
        I have chosen these principles because they are the backbone of a
        beautiful design. Always aim for balance, harmony, and clear
        prioritization in your design.
        <br />
        It's helpful to have a checklist to evaluate team's design.
      </p>
    </div>
  </div>
);

const TenSlide = () => (
  <div className="bg-purple-100 flex flex-col items-center justify-start h-full rounded-lg overflow-y-scroll py-16 px-48">
    <h2 className="text-2xl font-bold text-purple-800">
      A10: Reflections from the Course
    </h2>
    <div>
      <div className="flex flex-row justify-center">
        <img
          className="aspect-[16/3] h-60 object-contain"
          src="https://media.licdn.com/dms/image/v2/C4D12AQFUi54jK-aYVg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1619555265597?e=2147483647&v=beta&t=N4xUY82C2j_UOJ_sTdDy-O6dgoAJFsZCtklhXtXKbQ8"
          alt="w3css"
        />
      </div>
      <ul className="my-3 list-disc list-inside">
        <p>My 5 Key Learnings from This Course:</p>{" "}
        <li>
          Service Design and Stakeholders: This involves designing the backend
          of the service, focusing on the aspects behind the scenes that enable
          great user experiences and meet customers' needs.
        </li>{" "}
        <li>
          Brainstorming: Techniques like How Might We (HMW), Lotus Blossom, and
          Crazy 8 have helped me generate creative solutions and refine ideas
          through structured ideation.
        </li>{" "}
        <li>
          User Journey Mapping: I learned how to visualize and understand the
          user’s experience through each touchpoint.
        </li>{" "}
        <li>
          Feedback Loop: Gathering feedback is crucial for continuous
          improvement. I can ensure the product evolves to better meet users’
          expectations by gather user feedback into the design process
          iteratively.
        </li>{" "}
        <li>
          Principles of Good Design: I’ve learned that good design should be
          clear, balanced, easy to understand, purposeful, and most importantly,
          solve real problems for people.
        </li>{" "}
        <p>
          When I compare these learnings to the objectives I set in my first
          assignment (A1), I now have a clearer understanding of what makes a
          design truly effective. A good design should not only be visually
          appealing but also functional and user-centered.
        </p>{" "}
        <p>
          Looking back at my Figma design from the first assignment, I realize
          it was a solid design overall, but it still needs some modifications.
          However, I am still so happy about the progress I’ve made and the
          knowledge I have gained .
        </p>
        <p>
          <b>ASSESSMENT</b>
          <li>
            I supported my teammates as much as possible by offering
            recommendations and ideas. We all shared the workload equally. I
            mostly worked on sketching, creating the Figma prototype, and making
            iterative changes until it looked good enough.
          </li>
          <li>
            Olga was very active in the group work, showing great enthusiasm for
            the solution, the users, and the Figma design.
          </li>
          <li>
            Kristina was very thoughtful and contributed many great ideas that
            we could apply to the project. She was also meticulous with the team
            slides and design. Additionally, she conducted some interviews to
            gather feedback on the prototype.
          </li>
          <li>
            Similarly, Yanli was very active and contributed to all tasks. She
            created a lot of content for others to base their work on, and also
            conducted interviews to collect feedback on the prototype.
          </li>
          <li>
            I believe the result turned out really well because the team was
            productive. There was a small disagreement at the beginning of the
            course, but that's normal since we weren't sure what to focus on. In
            the end, thanks to the private training, we all aligned on the same
            vision.
          </li>
          <li>
            Overall, I’m very happy with the course, the instructor, and my
            teammates.
          </li>
        </p>
      </ul>
    </div>
  </div>
);
export default PersonalMain;

const pages = [
  FirstSlide,
  SecondSlide,
  ThirdSlide,
  FourthSlide,
  FifthSlide,
  SixSlide,
  SevenSlide,
  EightSlide,
  NineSlide,
  TenSlide,
];

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
