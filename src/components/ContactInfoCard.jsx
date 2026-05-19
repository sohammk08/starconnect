import { format } from "date-fns";
import { AiOutlineEdit } from "react-icons/ai";
import { FiCheck, FiX } from "react-icons/fi";

function ContactInfoCard({
  onSave,
  contact,
  onCancel,
  isEditing,
  onEditStart,
  onFieldChange,
}) {
  // Handle text copying
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  /* ---- Helpers (module scope) ---- */
  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    if (typeof timestamp === "string") {
      try {
        return format(new Date(timestamp), "PP");
      } catch {
        return timestamp;
      }
    }
    if (timestamp.seconds != null && timestamp.nanoseconds != null) {
      const date = new Date(
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000,
      );
      return format(date, "PP");
    }
    try {
      return format(new Date(timestamp), "PP");
    } catch {
      return "-";
    }
  };

  const formatDateForInput = (timestamp) => {
    if (!timestamp) return "";
    const ms =
      timestamp.seconds != null
        ? timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
        : timestamp;
    const date = new Date(ms);
    return !isNaN(date) ? date.toISOString().slice(0, 10) : "";
  };

  /* ---- Config ---- */
  const FIELDS = [
    { key: "firstName", label: "First name", type: "text", editOnly: true },
    { key: "lastName", label: "Last name", type: "text", editOnly: true },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "email", label: "Email", type: "email" },
    { key: "address", label: "Address", type: "text" },
    { key: "birthday", label: "Birthday", type: "date" },
    {
      key: "avatarColor",
      label: "Avatar color",
      type: "select",
      editOnly: true,
      options: ["green", "red", "blue", "purple", "pink"],
    },
  ];

  return (
    <div className="bg-[#1f1f1f] p-4 rounded-xl border border-gray-700 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-200">Contact Info</h3>
        {isEditing ? (
          <div className="flex items-center space-x-3">
            <FiCheck
              size={18}
              className="text-green-500 cursor-pointer"
              onClick={onSave}
              title="Save"
            />
            <FiX
              size={18}
              className="text-gray-300 cursor-pointer"
              onClick={onCancel}
              title="Cancel"
            />
          </div>
        ) : (
          <AiOutlineEdit
            size={18}
            className="text-gray-300 hover:text-white cursor-pointer transition-colors"
            onClick={onEditStart}
            title="Edit contact"
          />
        )}
      </div>

      <ul className="space-y-3 ml-1 text-gray-300">
        {FIELDS.map(({ key, label, type, editOnly, options }) => {
          const value = contact?.[key];
          const show = isEditing || (!editOnly && value);
          if (!show) return null;

          return (
            <li key={key} className="flex items-center gap-3">
              <span className="w-24 font-semibold shrink-0">{label}:</span>

              {isEditing ? (
                type === "select" ? (
                  <select
                    className="flex-1 p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={value || "green"}
                    onChange={(e) => onFieldChange(key, e.target.value)}
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="flex-1 p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={
                      type === "date"
                        ? formatDateForInput(value)
                        : (value ?? "")
                    }
                    onChange={(e) => onFieldChange(key, e.target.value)}
                  />
                )
              ) : (
                <span
                  className="flex-1 hover:text-white transition-colors cursor-pointer truncate"
                  title={`Copy ${label.toLowerCase()}`}
                  onClick={() =>
                    handleCopy(type === "date" ? formatDate(value) : value)
                  }
                >
                  {type === "date" ? formatDate(value) : value}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ContactInfoCard;
