import { Metadata } from "next";
import FrameFigma from "./components/FrameFigma";

export const metadata: Metadata = {
  title: "Duc Le",
  description: "My Portfolio",
};

async function Home() {
  return (
    <div className="w-full h-full overflow-y-scroll px-24 py-16">
      <ul className="my-3 list-disc list-inside">
        <li>
          Hi, My name is Duc, I'm a Software Engineering student at Haaga-Helia
          University of Applied Sciences.
          <br />
          I have a strong passion for software development and digital services
          design.
          <br />
          I have experience in developing web applications using React, Node.js,
          Golang.
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
      <p className="my-3">
        <li>
          I have passed the Introduction to Digital Services and Introduction to
          Software Development.
        </li>
      </p>
      <p className="my-3">
        <li>
          Tools and methods I know that can be used in digital service design
          and prototyping: I have experience in using Figma to design user
          flows, site maps, and so on.
        </li>
      </p>
      <p className="my-3">
        <li>
          My main objectives are to design a great service that meets the needs
          of the users . Here is my current work, but I don't know if this is a
          good design or not:
          <br />
          <FrameFigma/>
          <br />
          So I am eager to learn more.
        </li>
      </p>
      <p className="my-3">
        <li>
          Are there any known obstacles on your way? yes, I don't know what is a
          beautiful design.
        </li>
      </p>
    </div>
  );
}

export default Home;
