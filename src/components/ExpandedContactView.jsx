import React from "react";
import { Link } from "react-router-dom";

function ExpandedContactView() {
  return (
    <div className="flex bg-gray-100 w-280 justify-center items-center min-h-[calc(100vh-1.4rem)] border border-r-gray-300 border-y-gray-300 border-l-transparent rounded-r-lg">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
          Connections, secured
        </h1>
        <ul className="space-y-4 text-lg text-blue-500 dark:text-blue-400">
          <li>
            <Link to="/settings">Manage Settings</Link>
          </li>
          <li>
            <Link to="/starconnect/archive">See Archive</Link>
          </li>
          <li>
            <Link to="/documentation">See Docs</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ExpandedContactView;
