import { db } from "../../firebase";
import { FiX } from "react-icons/fi";
import DatePicker from "react-datepicker";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from "../context/Auth/AuthContext";
import { addDoc, updateDoc, collection } from "firebase/firestore";

function AddContact({ toggle }) {
  const navigate = useNavigate();
  const [birthday, setBirthday] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactFirstName, setContactFirstName] = useState("");

  // Assign random color for contact avatar
  const assignRandomColor = () => {
    const colors = ["green", "red", "blue", "purple", "pink"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return randomColor;
  };

  // Handle new contact submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const collectionTitle = "contacts-" + currentUser.email;

    try {
      assignRandomColor();

      // Add a new document with a generated ID
      const docRef = await addDoc(collection(db, collectionTitle), {
        birthday: birthday,
        phone: contactPhone,
        email: contactEmail,
        contactStatus: "active",
        address: contactAddress,
        lastName: contactLastName,
        firstName: contactFirstName,
        avatarColor: assignRandomColor(),
      });

      // Update the document with its own ID
      await updateDoc(docRef, { id: docRef.id });

      alert("Contact has been saved");
      navigate("/");
    } catch (err) {
      alert(
        "There was an error saving the label. Please try again after some time.",
      );
    }
  };

  return (
    <div className="h-full w-full p-6 bg-[#121212] text-gray-100 overflow-y-auto relative">
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-gray-300 hover:text-white"
        onClick={() => {
          navigate("/starconnect");
          toggle(false);
        }}
      >
        <FiX size={24} />
      </button>

      <h1 className="text-center text-xl font-semibold mb-6">Add Contact</h1>

      {/* Contact form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile image and name fields */}
        <div className="flex items-center mb-4">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              placeholder="First Name"
              className="block w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setContactFirstName(e.target.value)}
              value={contactFirstName}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="block w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setContactLastName(e.target.value)}
              value={contactLastName}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-200">Email</label>
          <input
            type="email"
            className="block w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            onChange={(e) => setContactEmail(e.target.value)}
            value={contactEmail}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium text-gray-200">Phone</label>
          <input
            type="tel"
            className="block w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone"
            onChange={(e) => setContactPhone(e.target.value)}
            value={contactPhone}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium text-gray-200">
            Address
          </label>
          <input
            type="text"
            className="block w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Address"
            onChange={(e) => setContactAddress(e.target.value)}
            value={contactAddress}
          />
        </div>

        {/* Birthday */}
        <div>
          <label className="block mb-1 font-medium text-gray-200">
            Birthday
          </label>
          <DatePicker
            selected={birthday}
            className="block w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(bDate) => setBirthday(bDate)}
          />
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save
        </button>
      </form>
    </div>
  );
}

export default AddContact;
