import { FaPlus } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";

function Search({ onAddContact }) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Find a contact"
        className="w-full p-2 pl-10 rounded 
          bg-gray-200 text-gray-900 placeholder-gray-500 
          dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 
          focus:outline-none"
      />
      <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300" />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-500 hover:text-blue-600 transition">
        <FaPlus
          className="w-4 h-4"
          title="New contact"
          onClick={() => onAddContact()}
        />
      </div>
    </div>
  );
}

export default Search;
