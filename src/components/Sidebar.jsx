import Search from "./Search";
import { CgSortAz } from "react-icons/cg";
import { IoMdSettings, IoMdDocument } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import ActiveContactList from "./ActiveContactList";
import ArchiveContactList from "./ArchiveContactList";
import { MdArchive, MdLabelOutline } from "react-icons/md";
import { useRef } from "react";

function Sidebar({
  contacts,
  onAddContact,
  onContactSelect,
  handleNavigateHome,
  handleArchiveClick,
  clearSelectedContact,
}) {
  const sortButtonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isArchivePage = location.pathname.includes("/archive");

  return (
    <div className="w-full md:w-68 bg-[#1f1f1f] rounded-tl-lg rounded-bl-lg border-l border-y border-gray-800">
      <div
        className="flex space-x-2 text-white bg-black justify-center items-center cursor-pointer pt-4 md:pt-5 rounded-tl-lg p-3"
        onClick={() => handleNavigateHome()}
      >
        <img src="/logo.png" className="h-5 md:h-8" />
        <span className="text-xl md:text-2xl font-anton">STAR CONNECT</span>
      </div>
      <div className="flex flex-col space-y-1 py-2">
        {/* top-left menu */}
        <div className="flex flex-col pl-3 pr-5 space-y-3">
          <div className="flex md:hidden justify-around items-center gap-2">
            <button
              onClick={() => navigate("/settings")}
              className="flex flex-1 items-center justify-center text-sm font-medium gap-1 p-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 cursor-pointer duration-200 ease-in-out transition"
              title="Settings"
            >
              <IoMdSettings size={20} />
              Settings
            </button>
            <button
              onClick={() => navigate("/documentation")}
              className="flex flex-1 items-center justify-center text-sm font-medium gap-1 p-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 cursor-pointer duration-200 ease-in-out transition"
              title="Documentation"
            >
              <IoMdDocument size={20} />
              See Docs
            </button>
          </div>

          <Search onAddContact={onAddContact} />

          <div className="flex relative space-x-1.5">
            <button
              className="flex flex-1 items-center justify-center p-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 cursor-pointer duration-200 ease-in-out transition"
              onClick={() => {
                handleArchiveClick();
                clearSelectedContact(null);
              }}
            >
              <MdArchive size={20} className="mr-2" />
              <span className="text-sm md:text-base font-medium">Archive</span>
            </button>
            <button
              className="flex flex-1 items-center justify-center p-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 cursor-pointer duration-200 ease-in-out transition"
              title="Sort contacts"
              // ref={labelButtonRef}
            >
              <MdLabelOutline size={20} className="mr-2" />
              <span className="text-sm md:text-base font-medium">Labels</span>
            </button>
            <button
              disabled={isArchivePage}
              title={
                isArchivePage
                  ? "Not available for archived contacts"
                  : "Sort contacts by label"
              }
              className={`flex flex-1 items-center justify-center p-2 rounded-md duration-200 ease-in-out transition ${
                isArchivePage
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600 cursor-pointer"
              }`}
              onClick={() => {
                if (!isArchivePage) setIsSortModalOpen(!isSortModalOpen);
              }}
              ref={sortButtonRef}
            >
              <CgSortAz size={20} />
              <span className="text-sm md:hidden font-medium">Sort</span>
            </button>
          </div>
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
