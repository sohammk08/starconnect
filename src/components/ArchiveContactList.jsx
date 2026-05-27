import React from "react";
import { MdArrowLeft } from "react-icons/md";

function ArchiveContactList({ goHome, contacts, onContactSelect }) {
  return (
    <div>
      {/* Contact Display */}
      <div className="w-72 flex justify-center border-t border-gray-600 py-2 mt-2 relative">
        <MdArrowLeft
          size={24}
          className="rounded p-1 hover:bg-gray-700 absolute left-2 text-gray-300 cursor-pointer"
          onClick={() => goHome()}
          title="See all contacts"
        />
        <span className="font-semibold mx-auto text-center text-gray-200">
          Archive
        </span>
      </div>

      <div className="w-full h-px bg-gray-600" />

      <div
        className={`divide-y divide-gray-700 h-[calc(100vh-16rem)] ${contacts.length > 7 ? "overflow-y-scroll" : ""}`}
      >
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className="p-4 hover:bg-gray-700 cursor-pointer flex items-center duration-150 ease-in-out text-gray-200"
              onClick={() => onContactSelect(contact)}
            >
              <span>{contact.firstName + " " + contact.lastName}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ArchiveContactList;
