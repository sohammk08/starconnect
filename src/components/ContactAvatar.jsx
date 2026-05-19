import React from "react";

function ContactAvatar({ contact, preference, className = "" }) {
  const initials = `${contact?.firstName?.[0] || ""}${
    contact?.lastName?.[0] || ""
  }`;

  // Contact avatar color map
  const COLOR_MAP = {
    green: "bg-green-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
  };

  /* Gradient ring */
  if (preference === "gradient-ring") {
    const isEncrypted =
      contact?.contactEncryption === "base64" ||
      contact?.contactEncryption === "aes256";

    return (
      <div
        className={`relative h-32 w-32 rounded-full flex items-center justify-center ${className}`}
      >
        <div
          className={`absolute inset-0 rounded-full p-1 ${
            isEncrypted
              ? "bg-linear-to-r from-yellow-200 via-purple-400 to-blue-500"
              : "bg-gray-300"
          }`}
        >
          <div className="h-full w-full rounded-full bg-[#121212] flex items-center justify-center">
            <span className="text-gray-100 text-4xl font-semibold">
              {initials}
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* Filled-color (default) */
  return (
    <div
      className={`h-32 w-32 rounded-full flex items-center justify-center ${
        COLOR_MAP[contact?.avatarColor] || "bg-gray-500"
      } ${className}`}
    >
      <span className="text-white text-4xl font-semibold">{initials}</span>
    </div>
  );
}

export default ContactAvatar;
