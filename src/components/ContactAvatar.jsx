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

  return (
    <div
      className={`h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full flex items-center justify-center ${
        COLOR_MAP[contact?.avatarColor] || "bg-gray-500"
      } ${className}`}
    >
      <span className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold">
        {initials}
      </span>
    </div>
  );
}

export default ContactAvatar;
