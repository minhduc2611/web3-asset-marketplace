import NoSsr from "@/components/common/no-ssr";
import PersonalMain from "@/components/personal/personal-main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Duc Le",
  description: "My Portfolio",
};

async function Home() {
  return (
    <NoSsr>
      <PersonalMain />
    </NoSsr>
  );
}

export default Home;
