import { db } from "../../firebase";
import AddContact from "../components/AddContact";
import { Link, useNavigate } from "react-router-dom";
import ContactAvatar from "../components/ContactAvatar";
import { AuthContext } from "../context/Auth/AuthContext";
import ContactInfoCard from "../components/ContactInfoCard";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useState, useEffect, useContext, useMemo, useCallback } from "react";

import {
  MdArchive,
  MdUnarchive,
  MdLabelOutline,
  MdOutlineShare,
} from "react-icons/md";
import { GoLinkExternal } from "react-icons/go";
import { FiArrowLeft, FiCheck, FiTrash, FiX } from "react-icons/fi";
import { AiFillStar, AiOutlineDelete, AiOutlineStar } from "react-icons/ai";

function ExpandedContactView({
  labels,
  selectedContact,
  isAddingContact,
  onContactArchived,
  setIsAddingContact,
  handleNavigateHome,
  contactAvatarPreference,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({});
  const { currentUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [labelModal, setLabelModal] = useState(false);
  const [localContact, setLocalContact] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [contactDeletionModal, setContactDeletionModal] = useState(false);

  const dbName = useMemo(
    () => "contacts-" + (currentUser?.email || ""),
    [currentUser?.email],
  );

  const ROUTES = {
    home: "/starconnect",
    archive: "/starconnect/archive",
  };

  /* ---- Module helpers ---- */
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

  /* ---- Sync prop -> local state ---- */
  useEffect(() => {
    if (!selectedContact) {
      setLocalContact(null);
      setSelectedLabels([]);
      setIsEditing(false);
      return;
    }
    setLocalContact(selectedContact);
    setSelectedLabels(normalizeLabels(selectedContact.labels || []));
    setIsEditing(false);
  }, [selectedContact]);

  const selectedLabelNames = useMemo(
    () => new Set(selectedLabels.map((l) => l.labelName)),
    [selectedLabels],
  );

  const setLoad = (key, val) => setLoading((p) => ({ ...p, [key]: val }));

  /* ---- Firestore actions ---- */

  // Handle contact - STAR
  const handleContactStarring = async () => {
    if (!localContact?.id || loading.starring) return;
    setLoad("starring", true);
    try {
      const next =
        localContact.contactStatus === "starred" ? "active" : "starred";
      await updateDoc(doc(db, dbName, localContact.id), {
        contactStatus: next,
      });
      setLocalContact((p) => (p ? { ...p, contactStatus: next } : p));
    } catch {
      alert("Failed to update star status.");
    } finally {
      setLoad("starring", false);
    }
  };

  // Handle contact - ARCHIVE
  const handleContactArchiving = async () => {
    if (!localContact?.id || loading.archiving) return;
    setLoad("archiving", true);
    try {
      await updateDoc(doc(db, dbName, localContact.id), {
        contactStatus: "archived",
      });
      onContactArchived(localContact.id);
    } catch {
      alert("Failed to archive contact.");
    } finally {
      setLoad("archiving", false);
    }
  };

  // Handle contact - UNARCHIVE
  const handleContactUnarchiving = async () => {
    if (!localContact?.id || loading.archiving) return;
    setLoad("archiving", true);
    try {
      await updateDoc(doc(db, dbName, localContact.id), {
        contactStatus: "active",
      });
      onContactArchived(localContact.id);
      navigate(ROUTES.archive);
    } catch {
      alert("Failed to unarchive contact.");
    } finally {
      setLoad("archiving", false);
    }
  };

  // Handle label - SAVE
  const handleSaveLabels = async () => {
    if (!localContact?.id || loading.labels) return;
    setLoad("labels", true);
    try {
      const labelsToStore = selectedLabels.map((l) => l.labelName);
      await updateDoc(doc(db, dbName, localContact.id), {
        labels: labelsToStore,
      });
      setLocalContact((p) => (p ? { ...p, labels: labelsToStore } : p));
      setLabelModal(false);
    } catch {
      alert("Failed to save labels.");
    } finally {
      setLoad("labels", false);
    }
  };

  // Handle label - CANCEL
  const handleCancelLabels = () => {
    setSelectedLabels(
      localContact && localContact.labels
        ? normalizeLabels(localContact.labels)
        : [],
    );
    setLabelModal(false);
  };

  // Handle contact - DELETE
  const handleContactDeletion = async () => {
    if (!localContact?.id || loading.deleting) return;
    setLoad("deleting", true);
    try {
      await deleteDoc(doc(db, dbName, localContact.id));
      setContactDeletionModal(false);
      onContactArchived(localContact.id);
      navigate(ROUTES.home);
    } catch {
      alert("Failed to delete contact.");
    } finally {
      setLoad("deleting", false);
    }
  };

  // Handle contact - SAVE
  const handleSave = async () => {
    if (!localContact?.id || loading.saving) return;
    setLoad("saving", true);
    try {
      /* Whitelist: never write the whole object back */
      const payload = {
        firstName: localContact.firstName,
        lastName: localContact.lastName,
        phone: localContact.phone,
        email: localContact.email,
        address: localContact.address,
        birthday: localContact.birthday,
        avatarColor: localContact.avatarColor,
      };
      await updateDoc(doc(db, dbName, localContact.id), payload);
      setIsEditing(false);
      navigate(ROUTES.home);
    } catch {
      alert("Failed to save changes.");
    } finally {
      setLoad("saving", false);
    }
  };

  const handleCancelEdit = () => {
    setLocalContact(selectedContact);
    setIsEditing(false);
  };

  const handleFieldChange = useCallback((field, value) => {
    setLocalContact((prev) => (prev ? { ...prev, [field]: value } : prev));
  }, []);

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
      const exists = prev.some((l) => l.labelName === label.labelName);
      return exists
        ? prev.filter((l) => l.labelName !== label.labelName)
        : [...prev, label];
    });
  };

  if (isAddingContact) {
    return (
      <div className="flex bg-[#121212] p-4 relative rounded-r-lg">
        <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] w-full max-w-7xl">
          <AddContact toggle={setIsAddingContact} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#121212] p-4 relative rounded-r-lg overflow-y-auto">
      <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] w-full max-w-7xl">
        {localContact ? (
          <div className="w-full max-w-7xl h-full">
            {/* Top toolbar */}
            <div className="flex items-center justify-between ml-2 mb-6">
              <button
                onClick={handleNavigateHome}
                className="text-gray-400 hover:text-white cursor-pointer transition-colors p-1"
              >
                <FiArrowLeft title="Go back" />
              </button>

              <div className="flex items-center space-x-6 pr-2">
                <button
                  className="text-gray-400 hover:text-white text-lg md:text-xl cursor-pointer disabled:opacity-50"
                  onClick={handleContactStarring}
                  disabled={loading.starring}
                  title={
                    localContact.contactStatus === "starred" ? "Unstar" : "Star"
                  }
                >
                  {localContact.contactStatus === "starred" ? (
                    <AiFillStar className="text-yellow-400" />
                  ) : (
                    <AiOutlineStar />
                  )}
                </button>

                <button
                  className="text-gray-400 hover:text-white text-lg md:text-xl cursor-pointer"
                  title="Share"
                >
                  <MdOutlineShare />
                </button>

                <button
                  className="text-gray-400 hover:text-white text-lg md:text-xl cursor-pointer"
                  onClick={handleOpenLabelModal}
                  title="Label"
                >
                  <MdLabelOutline />
                </button>

                <button
                  className="text-gray-400 hover:text-white cursor-pointer text-lg md:text-xl disabled:opacity-50"
                  onClick={
                    localContact.contactStatus === "archived"
                      ? handleContactUnarchiving
                      : handleContactArchiving
                  }
                  disabled={loading.archiving}
                  title={
                    localContact.contactStatus === "archived"
                      ? "Unarchive"
                      : "Archive"
                  }
                >
                  {localContact.contactStatus === "archived" ? (
                    <MdUnarchive />
                  ) : (
                    <MdArchive />
                  )}
                </button>

                <button
                  className="text-gray-400 hover:text-red-600 text-lg md:text-xl cursor-pointer"
                  onClick={() => setContactDeletionModal(true)}
                  title="Delete"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </div>

            <div className="flex items-center ml-4 mb-4">
              <ContactAvatar
                contact={localContact}
                preference={contactAvatarPreference}
                className="mr-3"
              />
              <h2 className="text-xl md:text-3xl font-medium text-gray-100">
                {`${localContact.firstName || ""} ${localContact.lastName || ""}`.trim()}
              </h2>
            </div>

            {/* Cards */}
            <div className="flex flex-col lg:flex-row gap-4">
              <ContactInfoCard
                contact={localContact}
                isEditing={isEditing}
                onEditStart={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                onFieldChange={handleFieldChange}
              />

              {/* Socials */}
              <div className="bg-[#1f1f1f] w-full lg:w-96 shrink-0 h-28 p-3 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-200">
                    Socials
                  </h3>
                  <GoLinkExternal
                    className="text-gray-300 hover:text-white cursor-pointer transition-colors"
                    size={15}
                    title="See more"
                  />
                </div>
              </div>
            </div>

            {/* Label chips */}
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

            {/* Label Modal */}
            {labelModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                <div className="relative bg-[#1f1f1f] rounded-lg shadow-md p-4 w-72 text-gray-100">
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
                      className="flex text-sm items-center py-1 px-2 rounded bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                      onClick={handleSaveLabels}
                      disabled={loading.labels}
                    >
                      <FiCheck className="mr-1" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Resting page */
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

      {/* Delete Modal */}
      {contactDeletionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="relative bg-[#1f1f1f] rounded-lg shadow-md p-4 w-[90%] md:w-80 space-y-3">
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
                className="flex text-md font-medium p-2 w-full md:w-auto rounded text-red-500 hover:text-white hover:bg-red-600 ease-in duration-200 disabled:opacity-50"
                onClick={handleContactDeletion}
                disabled={loading.deleting}
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
