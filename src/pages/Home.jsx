import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import ExpandedContactView from "./ExpandedContactView";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/Auth/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

function Home({ username }) {
  let navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [showSorted, setShowSorted] = useState(false);
  const [sortedContacts, setSortedContacts] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

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

  const handleAddContact = () => {
    setIsAddingContact(true);
    setSelectedContact(null);
    navigate("/add-contact");
  };

  const handleNavigateHome = () => {
    setSelectedContact(null);
    setShowSorted(false);
    setShowArchived(false);
    setSortedContacts([]);
    setSelectedLabel(null);
    navigate("/");
  };

  const handleArchiveClick = () => {
    setShowArchived(true);
    setSelectedContact(null);
    navigate("/archive");
  };

  return (
    <div className="flex bg-black h-full transition-all duration-200 items-center justify-center">
      <Sidebar
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
