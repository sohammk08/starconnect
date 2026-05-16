import { useContext } from "react";
import { db } from "../../firebase";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import ExpandedContactView from "./ExpandedContactView";
import { AuthContext } from "../context/Auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";

function Home({ username }) {
  let navigate = useNavigate();
  const location = useLocation();
  const [contacts, setContacts] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [showSorted, setShowSorted] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [sortedContacts, setSortedContacts] = useState([]);
  const [activeContacts, setActiveContacts] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [archivedContacts, setArchivedContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isAddingContact, setIsAddingContact] = useState(false);

  // Retrieve contacts
  useEffect(() => {
    if (!currentUser) return;

    // Refer collection and set up a listener
    const contactsCollection = collection(db, `contacts-${currentUser.email}`);
    const unsubscribe = onSnapshot(contactsCollection, (snapshot) => {
      setContacts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    // Cleanup
    return unsubscribe;
  }, [currentUser, showArchived, showSorted]);

  // Detect URL changes and update UI state accordingly
  useEffect(() => {
    const updateFromLocation = () => {
      if (location.pathname === "/add-contact") {
        setIsAddingContact(true);
        setSelectedContact(null);
        return;
      } else {
        setIsAddingContact(false);
      }

      const isArchivedPath = location.pathname.startsWith("/archive");
      const isLabelPath = location.pathname.includes("/label/");

      setShowArchived(isArchivedPath);
      setShowSorted(isLabelPath);

      let contactName = "";
      let labelName = "";

      if (isArchivedPath) {
        contactName = location.pathname.split("/archive/")[1] || "";
      } else if (isLabelPath) {
        const afterLabel = location.pathname.split("/label/")[1] || "";
        const parts = afterLabel.split("/");
        labelName = parts[0] || "";
        contactName = parts[1] || "";
      } else {
        contactName = location.pathname.split("/contact/")[1] || "";
      }

      const filteredContacts = contacts.filter((c) =>
        isArchivedPath
          ? c.contactStatus === "archived"
          : c.contactStatus === "active" || c.contactStatus === "starred",
      );

      if (isLabelPath && labelName) {
        const labelFiltered = filteredContacts.filter(
          (c) =>
            Array.isArray(c.labels) &&
            c.labels.some((l) =>
              typeof l === "string"
                ? l === labelName
                : l?.labelName === labelName,
            ),
        );
        setSortedContacts(labelFiltered);
        setSelectedLabel({ labelName });
      } else {
        setSortedContacts([]);
        setSelectedLabel(null);
      }

      if (contactName) {
        const contact = filteredContacts.find((c) => {
          const fullName = c.lastName
            ? `${c.firstName}-${c.lastName}`.toLowerCase()
            : c.firstName.toLowerCase();
          return fullName === contactName;
        });
        setSelectedContact(contact || null);
      } else {
        setSelectedContact(null);
      }
    };

    updateFromLocation();
  }, [location, contacts]);

  // Handle 'add contact (+)' click
  const handleAddContact = () => {
    setIsAddingContact(true);
    setSelectedContact(null);
    navigate("/add-contact");
  };

  // Handle navigating home
  const handleNavigateHome = () => {
    setSelectedContact(null);
    setShowSorted(false);
    setShowArchived(false);
    setSortedContacts([]);
    setSelectedLabel(null);
    navigate("/");
  };

  // Navigate to archive
  const handleArchiveClick = () => {
    setShowArchived(true);
    setSelectedContact(null);
    navigate("/archive");
  };

  // Filter contacts based on contactStatus
  useEffect(() => {
    const splitContacts = () => {
      if (contacts) {
        // Active contacts
        const activeContacts = contacts.filter(
          (contact) =>
            contact.contactStatus === "active" ||
            contact.contactStatus === "starred",
        );
        setActiveContacts(activeContacts);

        // Archived contacts
        const archivedContacts = contacts.filter(
          (contact) => contact.contactStatus === "archived",
        );
        setArchivedContacts(archivedContacts);
      } else {
        setActiveContacts([]);
        setArchivedContacts([]);
      }
    };

    splitContacts();
  }, [contacts]);

  return (
    <div className="flex bg-black h-full transition-all duration-200 items-center justify-center">
      <Sidebar
        contacts={
          showArchived
            ? archivedContacts
            : showSorted
              ? sortedContacts
              : activeContacts
        }
        onAddContact={handleAddContact}
        handleNavigateHome={handleNavigateHome}
        handleArchiveClick={handleArchiveClick}
        clearSelectedContact={setSelectedContact}
      />
      <ExpandedContactView
        isAddingContact={isAddingContact}
        setIsAddingContact={setIsAddingContact}
      />
    </div>
  );
}

export default Home;
