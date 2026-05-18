import {
  MdArchive,
  MdUnarchive,
  MdLabelOutline,
  MdOutlineShare,
} from "react-icons/md";
import {
  AiFillStar,
  AiOutlineEdit,
  AiOutlineStar,
  AiOutlineDelete,
} from "react-icons/ai";
import { format } from "date-fns";
import { db } from "../../firebase";
import { GoLinkExternal } from "react-icons/go";
import AddContact from "../components/AddContact";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth/AuthContext";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useState, useEffect, useContext, useRef } from "react";
import { FiArrowLeft, FiCheck, FiTrash, FiX } from "react-icons/fi";

function ExpandedContactView({
  labels,
  selectedContact,
  isAddingContact,
  onContactArchived,
  setIsAddingContact,
  handleNavigateHome,
  contactAvatarPreference,
}) {
  let navigate = useNavigate();
  const labelModalRef = useRef();
  const contactDeletionModalRef = useRef();
  const { currentUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [labelModal, setLabelModal] = useState(false);
  const [localContact, setLocalContact] = useState(null);
  const dbName = "contacts-" + (currentUser?.email || "");
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [contactDeletionModal, setContactDeletionModal] = useState(false);

  const selectedLabelNames = new Set(selectedLabels.map((l) => l.labelName));

  // ---- Helpers ----
  const normalizeLabels = (labelsArr) => {
    if (!labelsArr) return [];
    return labelsArr.map((l) =>
      typeof l === "string"
        ? { labelName: l }
        : l && l.labelName
          ? l
          : { labelName: String(l) },
    );
  };

  // Format Firestore timestamp to display "PP"
  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    // handle plain string/date or Firestore timestamp
    if (typeof timestamp === "string") {
      try {
        return format(new Date(timestamp), "PP");
      } catch {
        return timestamp;
      }
    }
    if (timestamp.seconds && timestamp.nanoseconds !== undefined) {
      const date = new Date(
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000,
      );
      return format(date, "PP");
    }
    // fallback
    try {
      return format(new Date(timestamp), "PP");
    } catch {
      return "-";
    }
  };

  // Convert timestamp/various formats into yyyy-MM-dd for <input type="date">
  const formatDateForInput = (timestamp) => {
    if (!timestamp) return "";

    const ms =
      timestamp.seconds != null
        ? timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
        : timestamp;

    const date = new Date(ms);
    return date instanceof Date && !isNaN(date)
      ? date.toISOString().slice(0, 10)
      : "";
  };

  // Persist labels (array of strings) to firestore for a contact
  const onLabelAssigning = async (contactId, labelsArray) => {
    if (!contactId) return;
    try {
      const contactRef = doc(db, dbName, contactId);
      await updateDoc(contactRef, { labels: labelsArray });
    } catch (err) {
      alert("Failed to assign labels. Please try again later.");
    }
  };

  // ---- Sync selectedContact -> localContact ----
  useEffect(() => {
    const syncSelectedContact = () => {
      if (!selectedContact) {
        setLocalContact(null);
        setSelectedLabels([]);
        setIsEditing(false);
        return;
      }
      setLocalContact(selectedContact);
      setSelectedLabels(normalizeLabels(selectedContact.labels || []));
      setIsEditing(false);
    };

    syncSelectedContact();
  }, [selectedContact]);

  // ---- Actions ----

  // Star/unstar
  const handleContactStarring = async () => {
    if (!localContact?.id) return;
    const updateContactStatus =
      localContact.contactStatus === "starred" ? "active" : "starred";
    await updateDoc(doc(db, dbName, localContact.id), {
      contactStatus: updateContactStatus,
    });
    setLocalContact((prevContact) =>
      prevContact
        ? { ...prevContact, contactStatus: updateContactStatus }
        : prevContact,
    );
  };

  // Open label modal seeded from saved labels
  const handleOpenLabelModal = () => {
    setSelectedLabels(
      localContact && localContact.labels
        ? normalizeLabels(localContact.labels)
        : [],
    );
    setLabelModal(true);
  };

  const handleLabelChange = (label) => {
    setSelectedLabels((prev = []) => {
      const alreadySelected = prev.some((l) => l.labelName === label.labelName);
      return alreadySelected
        ? prev.filter((l) => l.labelName !== label.labelName)
        : [...prev, label];
    });
  };

  const handleSaveLabels = async () => {
    if (!localContact?.id) return;
    try {
      const labelsToStore = selectedLabels.map((l) => l.labelName);
      await onLabelAssigning(localContact.id, labelsToStore);

      // update localContact so UI outside modal reflects saved labels
      setLocalContact((prev) =>
        prev ? { ...prev, labels: labelsToStore } : prev,
      );

      setLabelModal(false);
    } catch (err) {
      alert(
        "There was an error, failed to save labels. Please try again after some time or contact website support.",
      );
    }
  };

  const handleCancelLabels = () => {
    setSelectedLabels(
      localContact && localContact.labels
        ? normalizeLabels(localContact.labels)
        : [],
    );
    setLabelModal(false);
  };

  // Archive / Unarchive
  const handleContactArchiving = async () => {
    if (!localContact?.id) return;
    await updateDoc(doc(db, dbName, localContact.id), {
      contactStatus: "archived",
    });
    onContactArchived(localContact.id);
  };

  const handleContactUnarchiving = async () => {
    if (!localContact?.id) return;
    await updateDoc(doc(db, dbName, localContact.id), {
      contactStatus: "active",
    });
    onContactArchived(localContact.id);
    navigate("/starconnect/archive");
  };

  // Delete
  const handleContactDeletion = async () => {
    if (!localContact?.id) return;
    setContactDeletionModal(false);
    await deleteDoc(doc(db, dbName, localContact.id));
    onContactArchived(localContact.id);
    navigate("/starconnect");
  };

  // Save edits (saves localContact directly)
  const handleSave = async () => {
    try {
      if (!localContact?.id) {
        alert("No contact selected to save.");
        return;
      }
      await updateDoc(doc(db, dbName, localContact.id), localContact);
      setIsEditing(false);
      navigate("/");
    } catch (error) {
      alert("Failed to save changes. Please try again.");
    }
  };

  // Copy helper
  const handleCopy = (text) => {
    if (!text) return;
    try {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex bg-[#121212] p-4 relative rounded-r-lg">
      <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] w-6xl">
        {isAddingContact ? (
          <AddContact toggle={setIsAddingContact} />
        ) : localContact ? (
          <div className="w-6xl h-full">
            <button onClick={handleNavigateHome}>
              <FiArrowLeft
                className="mt-2 ml-2 mb-5 cursor-pointer rounded-full text-gray-400"
                size="20"
                title="Go back"
              />
            </button>

            {/* Contact topbar */}
            <div className="flex items-center ml-4 mb-4">
              <div
                className={`relative h-32 w-32 mr-3 rounded-full flex items-center justify-center ${
                  contactAvatarPreference === "filled-color"
                    ? localContact.avatarColor === "green"
                      ? "bg-green-500"
                      : localContact.avatarColor === "red"
                        ? "bg-red-500"
                        : localContact.avatarColor === "blue"
                          ? "bg-blue-500"
                          : localContact.avatarColor === "purple"
                            ? "bg-purple-500"
                            : localContact.avatarColor === "pink"
                              ? "bg-pink-500"
                              : "bg-gray-300"
                    : ""
                }`}
              >
                {/* Gradient Ring */}
                {contactAvatarPreference === "gradient-ring" && (
                  <div
                    className={`absolute inset-0 rounded-full ${
                      localContact?.contactEncryption === "base64" ||
                      localContact?.contactEncryption === "aes256"
                        ? "bg-linear-to-r from-yellow-200 via-purple-400 to-blue-500 p-1"
                        : "bg-gray-300 p-[0.18rem]"
                    }`}
                  >
                    <div
                      className="h-full w-full rounded-full bg-white"
                      style={{
                        backgroundColor: "transparent",
                      }}
                    >
                      <span className="text-gray-600 text-4xl font-semibold flex items-center justify-center h-full">
                        {(localContact.firstName?.[0] || "") +
                          (localContact.lastName
                            ? localContact.lastName[0]
                            : "")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Filled Color */}
                <span className="text-white text-4xl font-semibold flex items-center justify-center h-full">
                  {(localContact.firstName?.[0] || "") +
                    (localContact.lastName ? localContact.lastName[0] : "")}
                </span>
              </div>

              {/* Contact Name */}
              <h2 className="text-3xl font-medium text-gray-100">
                {`${localContact?.firstName || ""} ${
                  localContact?.lastName || ""
                }`.trim()}
              </h2>

              {/* Option Menu */}
              <div className="flex absolute top-4 right-6 space-x-6">
                {/* Accessibility icons */}
                <div
                  className="text-gray-400 cursor-pointer pt-2"
                  onClick={handleContactStarring}
                >
                  {localContact.contactStatus === "starred" ? (
                    <AiFillStar
                      size={23}
                      className="text-yellow-400"
                      title="Unstar"
                    />
                  ) : (
                    <AiOutlineStar size={23} title="Star" />
                  )}
                </div>
                <div className="text-gray-400 font-medium cursor-pointer pt-2">
                  <MdOutlineShare size={23} title="Share" />
                </div>
                <div className="text-gray-400 cursor-pointer pt-2">
                  <MdLabelOutline
                    size={23}
                    title="Label"
                    onClick={handleOpenLabelModal}
                  />
                </div>
                <div className="text-gray-400 cursor-pointer pt-2">
                  {localContact.contactStatus === "archived" ? (
                    <MdUnarchive
                      size={23}
                      title="Unarchive"
                      onClick={handleContactUnarchiving}
                    />
                  ) : (
                    <MdArchive
                      size={23}
                      title="Archive"
                      onClick={handleContactArchiving}
                    />
                  )}
                </div>
                <div
                  className="text-gray-400 hover:text-red-600 cursor-pointer pt-2"
                  onClick={() => setContactDeletionModal(true)}
                >
                  <AiOutlineDelete size={23} title="Delete" />
                </div>
              </div>
            </div>

            {/* Labels modal */}
            {labelModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                <div
                  ref={labelModalRef}
                  className="relative bg-[#1f1f1f] rounded-lg shadow-md p-4 w-[15%] text-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Labels</h2>
                    <FiX
                      className="text-lg cursor-pointer text-gray-300"
                      onClick={handleCancelLabels}
                      title="Close"
                    />
                  </div>
                  <div className="-mx-4 my-3 border border-neutral-700" />
                  <ul className="space-y-2">
                    {(labels || []).map((label) => {
                      const isSelected = selectedLabelNames.has(
                        label.labelName,
                      );
                      return (
                        <li
                          key={label.labelName}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleLabelChange(label)
                          }
                          onClick={() => handleLabelChange(label)}
                          className={`px-3 py-2 rounded cursor-pointer transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            isSelected
                              ? "bg-blue-500 text-white"
                              : "bg-[#2b2b2b] text-gray-200 hover:bg-[#3a3a3a]"
                          }`}
                        >
                          <span className="text-md font-medium">
                            {label.labelName}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="-mx-4 my-3 border border-neutral-700" />
                  <div className="flex justify-end items-center space-x-2">
                    <button
                      className="flex text-sm items-center py-1 px-2 rounded border border-neutral-700 bg-transparent text-gray-200"
                      onClick={handleCancelLabels}
                    >
                      Close
                    </button>
                    <button
                      className="flex text-sm items-center py-1 px-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={handleSaveLabels}
                    >
                      <FiCheck className="mr-1" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="flex justify-between">
              {/* Contact Info Card */}
              <div className="bg-[#1f1f1f] w-[calc(100vw-67rem)] p-4 mx-4 mt-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-200">
                    Contact Info
                  </h3>
                  {isEditing ? (
                    <div className="flex ml-auto -mt-6 -mr-2 space-x-3">
                      <FiCheck
                        size={18}
                        className="text-green-600 cursor-pointer"
                        onClick={handleSave}
                        title="Save changes"
                      />
                      <FiX
                        size={18}
                        className="text-gray-300 cursor-pointer"
                        onClick={() => {
                          // revert changes by re-syncing from selectedContact
                          setLocalContact(selectedContact);
                          setIsEditing(false);
                        }}
                        title="Cancel editing"
                      />
                    </div>
                  ) : (
                    <AiOutlineEdit
                      className="text-gray-300 hover:text-white -mt-6 -mr-2 transition-colors cursor-pointer"
                      size={18}
                      title="Edit contact"
                      onClick={() => setIsEditing(true)}
                    />
                  )}
                </div>

                {/* Contact Info Fields */}
                <ul className="space-y-2 ml-3 text-gray-300">
                  {/* First Name */}
                  <li
                    className={`${isEditing ? "flex" : "hidden"} items-center`}
                  >
                    <span className="w-24 font-semibold">First name:</span>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      className="flex-1 p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={(isEditing && localContact?.firstName) || ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const value = raw;
                        setLocalContact((prev) => ({
                          ...(prev || {}),
                          firstName: value,
                          id: prev?.id,
                        }));
                      }}
                    />
                  </li>

                  {/* Last Name */}
                  <li
                    className={`${isEditing ? "flex" : "hidden"} items-center`}
                  >
                    <span className="w-24 font-semibold">Last name:</span>
                    <input
                      type="text"
                      placeholder="Enter last name"
                      className="flex-1 p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={(isEditing && localContact?.lastName) || ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const value = raw;
                        setLocalContact((prev) => ({
                          ...(prev || {}),
                          lastName: value,
                          id: prev?.id,
                        }));
                      }}
                    />
                  </li>

                  {/* Phone */}
                  {(isEditing || localContact?.phone) && (
                    <li className="flex items-center">
                      <span className="w-24 font-semibold">Phone:</span>
                      {isEditing ? (
                        <input
                          type="text"
                          placeholder="Enter phone number"
                          className="flex-1 p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={localContact?.phone || ""}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const value = raw;
                            setLocalContact((prev) => ({
                              ...(prev || {}),
                              phone: value,
                              id: prev?.id,
                            }));
                          }}
                        />
                      ) : (
                        <span
                          className="hover:text-white transition-colors cursor-pointer"
                          title="Copy phone number"
                          onClick={() => handleCopy(localContact?.phone)}
                        >
                          {localContact?.phone}
                        </span>
                      )}
                    </li>
                  )}

                  {/* Email */}
                  {(isEditing || localContact?.email) && (
                    <li className="flex items-center">
                      <span className="w-24 font-semibold">Email:</span>
                      {isEditing ? (
                        <input
                          type="email"
                          placeholder="Enter email"
                          className="flex-1 p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={(isEditing && localContact?.email) || ""}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const value = raw;
                            setLocalContact((prev) => ({
                              ...(prev || {}),
                              email: value,
                              id: prev?.id,
                            }));
                          }}
                        />
                      ) : (
                        <span
                          className="flex-1 group relative hover:text-white transition-colors cursor-pointer"
                          title="Copy email"
                          onClick={() => handleCopy(localContact?.email)}
                        >
                          {localContact?.email}
                        </span>
                      )}
                    </li>
                  )}

                  {/* Address */}
                  {(isEditing || localContact?.address) && (
                    <li className="flex items-center">
                      <span className="w-24 font-semibold">Address:</span>
                      {isEditing ? (
                        <input
                          type="text"
                          placeholder="Enter address"
                          className="flex-1 p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={(isEditing && localContact?.address) || ""}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const value = raw;
                            setLocalContact((prev) => ({
                              ...(prev || {}),
                              address: value,
                              id: prev?.id,
                            }));
                          }}
                        />
                      ) : (
                        <span
                          className="flex-1 group relative hover:text-white transition-colors cursor-pointer"
                          title="Copy address"
                          onClick={() => handleCopy(localContact?.address)}
                        >
                          {localContact?.address}
                        </span>
                      )}
                    </li>
                  )}

                  {/* Birthday */}
                  {(isEditing || localContact?.birthday) && (
                    <li className="flex items-center">
                      <span className="w-24 font-semibold">Birthday:</span>
                      {isEditing ? (
                        <input
                          type="date"
                          className="flex-1 p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formatDateForInput(localContact?.birthday)}
                          onChange={(e) =>
                            setLocalContact((prev) => ({
                              ...(prev || {}),
                              birthday: e.target.value,
                              id: prev?.id,
                            }))
                          }
                        />
                      ) : (
                        <span
                          className="flex-1 group relative hover:text-white transition-colors cursor-pointer"
                          title="Copy birthday"
                          onClick={() =>
                            handleCopy(formatDate(localContact?.birthday))
                          }
                        >
                          {formatDate(localContact?.birthday)}
                        </span>
                      )}
                    </li>
                  )}

                  {/* Avatar Color */}
                  <li
                    className={`${isEditing ? "flex" : "hidden"} items-center`}
                  >
                    <span className="w-24 font-semibold">Avatar color:</span>
                    <select
                      className="flex-1 p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={localContact?.avatarColor || "green"}
                      onChange={(e) =>
                        setLocalContact((prev) => ({
                          ...(prev || {}),
                          avatarColor: e.target.value,
                          id: prev?.id,
                        }))
                      }
                    >
                      <option value="green">Green</option>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="purple">Purple</option>
                      <option value="pink">Pink</option>
                    </select>
                  </li>
                </ul>
              </div>

              {/* Socials Card */}
              <div className="bg-[#1f1f1f] w-full sm:w-auto min-w-88 h-28 overflow-y-hidden p-3 mx-4 mt-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-200">
                    Socials
                  </h3>
                  <GoLinkExternal
                    className="text-gray-300 hover:text-white -mt-3 transition-colors cursor-pointer"
                    size={15}
                    title="See more"
                    // onClick={() => setSocialsModal(true)}
                  />
                </div>
                {/* <SocialBlocks content={localContact?.socials} /> */}
              </div>
            </div>

            {/* Assigned Labels Display */}
            {localContact?.labels && localContact.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 mx-4">
                {normalizeLabels(localContact.labels).map((label) => (
                  <span
                    key={label.labelName}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 bg-neutral-700"
                  >
                    <span className="text-neutral-400">#</span>
                    {label.labelName}
                  </span>
                ))}
              </div>
            )}
          </div>
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
      {/* Contact Deletion Modal */}
      {contactDeletionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div
            className="relative bg-[#1f1f1f] rounded-lg shadow-md p-4 w-[90%] md:w-[30%] lg:w-[20%] space-y-3"
            ref={contactDeletionModalRef}
          >
            <div className="flex justify-between items-center mb-3 px-1">
              <h2 className="text-lg font-semibold text-gray-100">
                Delete Contact
              </h2>
              <FiX
                size={23}
                className="text-lg text-gray-300 cursor-pointer"
                onClick={() => setContactDeletionModal(false)}
                title="Close"
              />
            </div>

            <div className="-mx-4 mb-4 border border-neutral-700" />

            <div className="flex flex-col items-center">
              <p className="text-center text-gray-400 px-1 mb-2">
                Are you sure you want to delete this contact? This action{" "}
                <span className="font-semibold">cannot be undone.</span>
              </p>

              <button
                className="flex text-md font-medium p-2 w-full md:w-auto rounded text-red-500 hover:text-white hover:bg-red-600 ease-in duration-200"
                onClick={handleContactDeletion}
              >
                <FiTrash className="mt-[0.2rem] mr-1" />
                Delete Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpandedContactView;
