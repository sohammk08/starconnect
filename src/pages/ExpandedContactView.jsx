import { Link } from "react-router-dom";

function ExpandedContactView() {
  return (
    <div className=" border border-gray-200 dark:border-none dark:bg-[#121212]">
      <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] w-6xl">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
            Connections, secured
          </h1>
          <ul className="space-y-4 text-lg text-blue-500 dark:text-blue-400">
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
      </div>
    </div>
  );
}

export default ExpandedContactView;
