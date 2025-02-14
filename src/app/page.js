import NavBar from "@/custom-components/NavBar";
import ProblemList from "@/custom-components/ProblemList";

export default function Home() {
  return (
    <div className="w-full">
      <NavBar/>
      <ProblemList/>
    </div>
  );
}
