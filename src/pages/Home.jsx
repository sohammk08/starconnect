import Sidebar from "../components/Sidebar";
import ExpandedContactView from "../components/ExpandedContactView";

function Home({ username }) {
  return (
    <div className="flex bg-neutral-900 h-full transition-all duration-200 items-center justify-center">
      <Sidebar />
      <ExpandedContactView />
    </div>
  );
}

export default Home;
