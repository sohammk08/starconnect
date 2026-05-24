import {
  doc,
  where,
  query,
  getDocs,
  updateDoc,
  onSnapshot,
  arrayUnion,
  collection,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebase";
import Sidebar from "../components/Sidebar";
import { useState, useEffect, useContext } from "react";
import ExpandedContactView from "./ExpandedContactView";
import { AuthContext } from "../context/Auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

function Home({ username, contactAvatarPreference }) {
  let navigate = useNavigate();
  const location = useLocation();
  const [labels, setLabels] = useState([]);
  const [contacts, setContacts] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [labelInput, setLabelInput] = useState("");
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

  // Retrieve labels
  useEffect(() => {
    if (!currentUser) return;

    const uDocQuery = query(
      collection(db, "users"),
      where("email", "==", currentUser.email),
    );

    // Set up the Firestore listener
    const unsubscribe = onSnapshot(uDocQuery, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setLabels(doc.data().contactLabels || []);
      });
    });
  }, [currentUser]);

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

  // Handle sort button click
  const handleSortClick = (label) => {
    setShowSorted(true);
    navigate(`/label/${label.labelName}`);
  };

  // Handle action on clicking contact
  const handleSelectContact = (selectedContact) => {
    if (!selectedContact) {
      setSelectedContact(null);
      return;
    }

    let contactName;
    setIsAddingContact(false);
    setSelectedContact(selectedContact);

    contactName = selectedContact.lastName
      ? (
          selectedContact.firstName +
          "-" +
          selectedContact.lastName
        ).toLowerCase()
      : selectedContact.firstName.toLowerCase();

    // If archived, keep old archival path
    if (selectedContact.contactStatus === "archived") {
      navigate(`/archive/${contactName}`);
      return;
    }

    // If the current route is a label route, navigate to the label-specific contact route:
    // {/label/{labelName}/{contactName}
    if (location.pathname.includes("/label/")) {
      // extract labelName from path
      const afterLabelSegment = location.pathname.split("/label/")[1] || "";
      const labelNameFromPath = afterLabelSegment.split("/")[0];

      if (labelNameFromPath) {
        navigate(`/label/${labelNameFromPath}/${contactName}`);
        return;
      }
    }
  };

  // Function to handle archiving a contact
  const handleContactArchived = (contactId) => {
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== contactId),
    );
    if (selectedContact && selectedContact.id === contactId) {
      setSelectedContact(null);
    }
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

  // Function to handle adding a new label
  const handleAddLabel = async (labelInput) => {
    if (labelInput.trim() === "") return;

    const newLabel = { labelName: labelInput.trim() };
    const updatedLabels = [...labels, newLabel];
    setLabels(updatedLabels);

    if (currentUser) {
      try {
        const userRef = collection(db, "users");
        const q = query(userRef, where("email", "==", currentUser.email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          const userDocRef = doc(db, "users", userDoc.id);
          await updateDoc(userDocRef, {
            contactLabels: arrayUnion(newLabel),
          });

          setLabelInput("");
        }
      } catch (error) {
        alert("There was an error adding the label. Please try again later.");
      }
    }
  };

  // Function to handle the editing of a label
  const handleEditLabel = async (index, labelText) => {
    const oldLabel = labels[index];
    const updatedLabels = labels.map((label, i) =>
      i === index ? { labelName: labelText } : label,
    );
    setLabels(updatedLabels);

    if (currentUser) {
      try {
        const userRef = collection(db, "users");
        const q = query(userRef, where("email", "==", currentUser.email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          const userDocRef = doc(db, "users", userDoc.id);

          // Add the new label and then delete the old one
          await updateDoc(userDocRef, {
            contactLabels: arrayUnion({ labelName: labelText }),
          });

          await updateDoc(userDocRef, {
            contactLabels: arrayRemove(oldLabel),
          });

          setEditLabelId(null);
          setEditLabelValue("");
        }
      } catch (error) {
        alert(
          "There was an error editing the label. Please try again or after some time.",
        );
      }
    }
  };

  // Handle the deletion of a label
  const handleDeleteLabel = async (index) => {
    const labeltoDelete = labels[index];
    const updatedLabels = labels.filter((_, i) => i !== index);
    setLabels(updatedLabels);

    if (currentUser) {
      try {
        const userRef = collection(db, "users");
        const q = query(userRef, where("email", "==", currentUser.email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          const userDocRef = doc(db, "users", userDoc.id);
          await updateDoc(userDocRef, {
            contactLabels: arrayRemove(labeltoDelete),
          });
        }
      } catch (error) {
        alert(
          "There was an error deleting the label. Please try again after some time.",
        );
      }
    }
  };

  const showExpanded = selectedContact || isAddingContact;

  return (
    <div className="flex bg-black md:px-45 h-full transition-all duration-200 items-center justify-center overflow-hidden">
      <div
        className={`w-full md:w-auto ${showExpanded ? "hidden md:block" : "block"}`}
      >
        <Sidebar
          contacts={
            showArchived
              ? archivedContacts
              : showSorted
                ? sortedContacts
                : activeContacts
          }
          labels={labels}
          onAddContact={handleAddContact}
          handleSortClick={handleSortClick}
          onContactSelect={handleSelectContact}
          handleNavigateHome={handleNavigateHome}
          handleAddLabel={handleAddLabel}
          handleEditLabel={handleEditLabel}
          handleDeleteLabel={handleDeleteLabel}
          handleArchiveClick={handleArchiveClick}
          clearSelectedContact={setSelectedContact}
          setSelectedLabel={setSelectedLabel}
        />
      </div>
      <div
        className={`w-full md:flex-1 ${showExpanded ? "block" : "hidden md:block"}`}
      >
        <ExpandedContactView
          labels={labels}
          contactAvatarPreference={contactAvatarPreference}
          handleNavigateHome={handleNavigateHome}
          isAddingContact={isAddingContact}
          onContactArchived={handleContactArchived}
          setIsAddingContact={setIsAddingContact}
          selectedContact={selectedContact}
        />
      </div>
    </div>
  );
}

export default Home;
