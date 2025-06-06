

import NavBar from "@/custom-components/NavBar";
import ProblemList from "@/custom-components/ProblemList";

export const metadata = {
  title: 'Code mastr | Home',
};

export default function Home() {
  return (
      <div className="w-full pt-20 md:px-10 px-3 h-screen pb-4">
        
        <ProblemList/>
      </div>
  );
}
