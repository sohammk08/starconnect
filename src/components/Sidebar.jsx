import Search from "./Search";
import { CgSortAz } from "react-icons/cg";
import { MdArchive, MdLabelOutline } from "react-icons/md";
import ActiveContactList from "./ActiveContactList";

function Sidebar({ onAddContact }) {
  const isArchivePage = false;

  return (
    <div className="w-68 bg-gray-100 border border-gray-300 rounded-tl-lg rounded-bl-lg">
      <h1 className="text-xl font-semibold text-gray-800 mt-4 ml-4 cursor-pointer">
        Star Connect
      </h1>
      <div className="border border-gray-300 my-2" />
      <div className="flex flex-col space-y-3 pr-4 py-2">
        {/* top-left menu */}
        <div className="flex flex-col pl-3 space-y-3">
          <>
            <Search className={onAddContact} />
            <div className="flex justify-between relative space-x-1.5">
              <button
                className="flex items-center p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer duration-200 ease-in-out transition"
                onClick={() => {
                  // handleArchiveClick();
                  // clearSelectedContact(null);
                }}
              >
                <MdArchive size={20} className="mr-2" />
                <span className="text-base">Archive</span>
              </button>
              <button
                className="flex items-center p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer duration-200 ease-in-out"
                title="Sort contacts"
                // ref={labelButtonRef}
              >
                <MdLabelOutline size={20} className="mr-2" />
                <span className="text-base">Labels</span>
              </button>
              <button
                disabled={isArchivePage}
                title={
                  isArchivePage
                    ? "Not available for archived contacts"
                    : "Sort contacts by label"
                }
                className={`flex items-center p-1.5 rounded-md duration-200 ease-in-out ${
                  isArchivePage
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                }`}
                // onClick={() => {
                //   if (!isArchivePage) setIsSortModalOpen(!isSortModalOpen);
                // }}
                // ref={sortButtonRef}
              >
                <CgSortAz size={20} />
              </button>
            </div>
          </>
        </div>
        <ActiveContactList />
      </div>
    </div>
  );
}

export default Sidebar;
