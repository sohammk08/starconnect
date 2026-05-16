import { Link } from "react-router-dom";
import AddContact from "../components/AddContact";

function ExpandedContactView({ isAddingContact, setIsAddingContact }) {
  return (
    <div className="flex bg-[#121212] p-4 relative rounded-r-lg">
      <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] w-6xl">
        {isAddingContact ? (
          <AddContact toggle={setIsAddingContact} />
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-semibold text-gray-100 mb-8">
              Connections, secured
            </h1>
            <ul className="space-y-4 text-lg text-blue-400">
              <li>
                <Link to="/settings">Manage Settings</Link>
              </li>
              <li>
                <Link to="/archive">See Archive</Link>
              </li>
              <li>
                <Link to="/documentation">See Docs</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpandedContactView;
