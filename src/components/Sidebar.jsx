import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import Search from "./Search";
import { IoAdd } from "react-icons/io5";
import { CgSortAz } from "react-icons/cg";
import ActiveContactList from "./ActiveContactList";
import ArchiveContactList from "./ArchiveContactList";
import { FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdSettings, IoMdDocument } from "react-icons/io";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { MdArchive, MdCheck, MdLabelOutline } from "react-icons/md";

function Sidebar({
  contacts,
  labels = [],
  onAddContact,
  handleAddLabel,
  onContactSelect,
  handleEditLabel,
  handleDeleteLabel,
  handleNavigateHome,
  handleSortClick,
  handleArchiveClick,
  clearSelectedContact,
  setSelectedLabel = () => {},
}) {
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const sortModalRef = useRef(null);
  const sortButtonRef = useRef(null);
  const labelButtonRef = useRef(null);
  const [labelText, setLabelText] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [editLabelId, setEditLabelId] = useState(null);
  const [editingLabel, setEditingLabel] = useState(null);
  const [editLabelValue, setEditLabelValue] = useState("");
  const isArchivePage = location.pathname.includes("/archive");
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [sortModalPosition, setSortModalPosition] = useState({
    top: 0,
    left: 0,
  });

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsLabelModalOpen(false);
      }

      // Close sort modal on outside clicks
      if (
        isSortModalOpen &&
        sortModalRef.current &&
        !sortModalRef.current.contains(event.target) &&
        sortButtonRef.current &&
        !sortButtonRef.current.contains(event.target)
      ) {
        setIsSortModalOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsLabelModalOpen(false);
      }
    };

    if (isLabelModalOpen || isSortModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    if (isLabelModalOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isLabelModalOpen, isSortModalOpen]);

  // Calc and set sort modal position on open
  useLayoutEffect(() => {
    if (isSortModalOpen && labelButtonRef.current) {
      const button = labelButtonRef.current;

      setSortModalPosition({
        top: button.offsetTop + button.offsetHeight + 95,
        left: button.offsetLeft + 350,
      });
    }
  }, [isSortModalOpen]);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setEditingLabel(null);
    setLabelText("");
    setEditLabelId(null);
    setEditLabelValue("");
  }, [setEditLabelId, setEditLabelValue]);

  // Handle save edit
  const handleSaveEdit = useCallback(() => {
    if (editLabelValue?.trim() && labelText.trim()) {
      handleEditLabel(editLabelId, labelText.trim());
    }
    handleCancelEdit();
  }, [
    editLabelId,
    editLabelValue,
    handleCancelEdit,
    handleEditLabel,
    labelText,
  ]);

  // Handle label selection from sort modal
  const handleLabelSelect = useCallback(
    (label) => {
      handleSortClick(label);
      setSelectedLabel(label);
      setIsSortModalOpen(false);
    },
    [handleSortClick, setSelectedLabel],
  );

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
              ref={labelButtonRef}
              onClick={() => setIsLabelModalOpen(true)}
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

        {/* Sort modal (labels list) */}
        {isSortModalOpen && sortModalPosition && (
          <div
            className="absolute bg-[#2b2b2b] shadow-lg shadow-black rounded-md py-3 pl-2 pr-4 z-50 border border-gray-700 overflow-y-auto custom-scrollbar max-h-48"
            style={{
              top: sortModalPosition.top,
              left: sortModalPosition.left,
            }}
            ref={sortModalRef}
          >
            <div className="absolute -left-1.75 top-4 h-0 w-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-[#2b2b2b]" />
            <span className="w-full font-semibold ml-3 text-gray-300 -mt-1">
              Labels
            </span>
            <div className="border-t border-gray-600 mt-2 -ml-2 -mr-4" />
            {labels.map((label) => (
              <div
                key={label.labelName}
                className="flex items-center text-gray-100 mt-3 cursor-pointer hover:text-blue-400"
                onClick={() => handleLabelSelect(label)}
              >
                <MdLabelOutline size={19} className="mr-1" />
                <span className="text-sm font-medium mt-[0.15rem]">
                  {label.labelName.length > 5
                    ? `${label.labelName.slice(0, 5)}...`
                    : label.labelName}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Label Modal UI (create / edit labels) */}
        {isLabelModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div
              className="relative bg-[#1f1f1f] rounded-lg shadow-md py-4 px-6 text-gray-100 space-y-3"
              ref={modalRef}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Labels</h2>
                <FiX
                  className="text-lg text-gray-300 cursor-pointer"
                  onClick={() => setIsLabelModalOpen(false)}
                  title="Close"
                />
              </div>

              <div className="border-t border-gray-600 mt-2 -mx-6" />
              <div className="flex items-center mt-2">
                <div className="relative w-48">
                  <input
                    type="text"
                    placeholder="Add a label"
                    className="w-full focus:border-transparent focus:outline-none focus:ring-0 rounded-md p-2 pr-10 bg-gray-800 text-gray-100"
                    value={labelInput}
                    onChange={(e) => setLabelInput(e.target.value)}
                  />
                  <button
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => handleAddLabel(labelInput)}
                    title="Add label"
                  >
                    <div className="p-1.5 rounded-lg text-green-500 hover:bg-gray-700 transition">
                      <IoAdd size={20} />
                    </div>
                  </button>
                </div>
              </div>

              <div
                className={`flex flex-col ${
                  labels.length > 5
                    ? "max-h-40 overflow-y-auto custom-scrollbar"
                    : ""
                }`}
              >
                {labels.map((label, index) => (
                  <div key={label.labelName} className="flex items-center mt-3">
                    <MdLabelOutline size={20} className="mr-1" />
                    {editingLabel === label.labelName ? (
                      <>
                        <input
                          type="text"
                          value={labelText}
                          onChange={(e) => setLabelText(e.target.value)}
                          className="w-24 border border-gray-600 rounded-md p-1 mr-2 bg-gray-800 text-gray-100"
                        />
                        <div className="ml-auto flex space-x-2">
                          <button
                            className="text-green-500"
                            onClick={handleSaveEdit}
                          >
                            <MdCheck size={20} />
                          </button>
                          <button
                            className="text-gray-500 hover:text-red-500"
                            onClick={handleCancelEdit}
                          >
                            <FiX size={20} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">{label.labelName}</span>
                        <div className="ml-auto flex space-x-2">
                          <button
                            className="text-gray-300 hover:text-white"
                            onClick={() => {
                              setEditLabelId(index);
                              setEditLabelValue(label.labelName);
                              setLabelText(label.labelName);
                              setEditingLabel(label.labelName);
                            }}
                          >
                            <AiOutlineEdit size={18} />
                          </button>
                          <button
                            className="text-gray-300 hover:text-red-500"
                            onClick={() => handleDeleteLabel(index)}
                          >
                            <AiOutlineDelete size={18} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {location.pathname.includes("/archive") ? (
          <ArchiveContactList
            contacts={contacts.filter((c) => c.contactStatus === "archived")}
            onContactSelect={onContactSelect}
          />
        ) : (
          <ActiveContactList
            contacts={contacts}
            onResetFilter={() => {
              handleNavigateHome();
              setSelectedLabel(null);
              clearSelectedContact(null);
            }}
            onContactSelect={onContactSelect}
          />
        )}
      </div>
    </div>
  );
}

export default Sidebar;
