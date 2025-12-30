import React from "react";
import Search from "./Search";
import { MdArchive, MdLabelOutline } from "react-icons/md";
import { CgSortAz } from "react-icons/cg";

function Sidebar({ onAddContact }) {
  const isArchivePage = false;

  return (
    <div className="w-68 bg-gray-100 border border-gray-300 rounded-tl-lg rounded-bl-lg">
      <h1 className="text-xl font-bold text-gray-800 mt-4 ml-4 cursor-pointer">
        Star Connect
      </h1>
      <div className="border border-gray-300 my-2" />
      <div className="flex flex-col space-y-3 px-4 py-2">
        <Search className={onAddContact} />

        {/* top-left menu */}
        <div className="flex justify-between relative">
          <>
            <button className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer duration-200 ease-in-out transition">
              <MdArchive className="mr-2" />
              Archive
            </button>
            <button
              className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer duration-200 ease-in-out"
              title="Sort contacts"
              // ref={labelButtonRef}
            >
              <MdLabelOutline className="mr-2" />
              Labels
            </button>
            <button
              disabled={isArchivePage}
              title={
                isArchivePage
                  ? "Not available for archived contacts"
                  : "Sort contacts by label"
              }
              className={`flex items-center px-2 py-2 rounded-md duration-200 ease-in-out ${
                isArchivePage
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
              }`}
              // onClick={() => {
              //   if (!isArchivePage) setIsSortModalOpen(!isSortModalOpen);
              // }}
              // ref={sortButtonRef}
            >
              <CgSortAz />
            </button>
          </>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
