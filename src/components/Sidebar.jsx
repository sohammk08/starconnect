import Search from "./Search";
import { CgSortAz } from "react-icons/cg";
import { useLocation } from "react-router-dom";
import ActiveContactList from "./ActiveContactList";
import ArchiveContactList from "./ArchiveContactList";
import { MdArchive, MdLabelOutline } from "react-icons/md";

function Sidebar({
  contacts,
  onAddContact,
  onContactSelect,
  handleNavigateHome,
  handleArchiveClick,
  clearSelectedContact,
}) {
  const location = useLocation();
  const isArchivePage = location.pathname.includes("/archive");

  return (
    <div className="w-68 bg-[#1f1f1f] rounded-tl-lg rounded-bl-lg border-l border-y border-gray-800">
      <div
        className="flex space-x-2 text-white bg-black justify-center items-center cursor-pointer rounded-tl-lg p-5"
        onClick={() => handleNavigateHome()}
      >
        <img src="/logo.png" className="max-h-8" />
        <span className="text-2xl font-anton">STAR CONNECT</span>
      </div>
      <div className="flex flex-col space-y-1 py-2">
        {/* top-left menu */}
        <div className="flex flex-col pl-3 pr-4 space-y-3">
          <>
            <Search onAddContact={onAddContact} />
            <div className="flex justify-between relative space-x-1.5">
              <button
                className="flex items-center p-1.5 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 cursor-pointer duration-200 ease-in-out transition"
                onClick={() => {
                  handleArchiveClick();
                  clearSelectedContact(null);
                }}
              >
                <MdArchive size={20} className="mr-2" />
                <span className="text-base">Archive</span>
              </button>
              <button
                className="flex items-center p-1.5 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 cursor-pointer duration-200 ease-in-out"
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
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600 cursor-pointer"
                }`}
                // onClick={() => {
                // if (!isArchivePage) setIsSortModalOpen(!isSortModalOpen);
                // }}
                // ref={sortButtonRef}
              >
                <CgSortAz size={20} />
              </button>
            </div>
          </>
        </div>
        {location.pathname.includes("/archive") ? (
          <ArchiveContactList
            contacts={contacts.filter((c) => c.contactStatus === "archived")}
            onContactSelect={onContactSelect}
          />
        ) : (
          <ActiveContactList
            contacts={contacts}
            onContactSelect={onContactSelect}
          />
        )}
      </div>
    </div>
  );
}

export default Sidebar;
