import React from "react";
import { useLocation } from "react-router-dom";

function ActiveContactList({
  contacts = [],
  onContactSelect = () => {},
  selectedLabel = null,
  onResetFilter = () => {},
}) {
  let location = useLocation();
  const filteredContacts = contacts;
  const isSortRoute = location.pathname.includes("/label/");

  return (
    <div>
      <div className="w-72 border-t flex items-center justify-center border-gray-300 dark:border-gray-600 py-2 mt-2">
        {selectedLabel ? (
          <div className="mx-auto flex items-center text-gray-800 dark:text-gray-200">
            <MdArrowLeft
              size={24}
              className="rounded p-1 hover:bg-gray-300 dark:hover:bg-gray-700 absolute left-2 text-gray-600 dark:text-gray-300 cursor-pointer"
              onClick={onResetFilter}
              title="All contacts"
            />
            <span className="font-semibold mx-auto text-gray-800 dark:text-gray-200">
              {selectedLabel.labelName}
            </span>
          </div>
        ) : (
          <div className="">
            <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
              All Contacts
            </span>
          </div>
        )}
      </div>
      <div className="w-72 h-px bg-gray-300 dark:bg-gray-600" />
      <div
        className={`divide-y divide-gray-200 dark:divide-gray-700 h-[calc(100vh-16rem)] custom-scrollbar ${
          filteredContacts.length > 7 ? "overflow-y-scroll" : ""
        }`}
      >
        <ul>
          {filteredContacts.length === 0 && isSortRoute ? (
            <li className="p-6 text-center text-gray-600 dark:text-gray-300">
              No contacts with this label
            </li>
          ) : (
            filteredContacts.map((contact) => (
              <li
                key={contact.id}
                className="p-4 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center duration-150 ease-in-out text-gray-800 dark:text-gray-200"
                onClick={() => onContactSelect(contact)}
              >
                <span>contact.firstName + " " + contact.lastName</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default ActiveContactList;
