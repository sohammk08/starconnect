import Sidebar from "./components/Sidebar";
import ExpandedContactView from "./pages/ExpandedContactView";

function StarConnect() {
  const onAddContact = () => {
    return;
  };

  return (
    <div>
      <div className="flex justify-end pr-5 min-h-screen py-5 bg-gray-100">
        <Sidebar onAddContact={onAddContact} />
        <ExpandedContactView />
      </div>
    </div>
  );
}

export default StarConnect;
