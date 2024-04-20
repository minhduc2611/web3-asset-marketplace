import { Icons } from "@/components/common/icons";
import TinderBase from "@/module/tinder/components/TinderBase";
const Home = () => {
  return (
    <main className="min-h-screen p-10 md:px-24 flex flex-col items-center justify-start bg-white text-primary overflow-x-hidden">
      <div>
        <Icons.tinder className="w-11 h-11" />
      </div>
      <TinderBase />
    </main>
  );
};

export default Home;
