import React from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function DevBadge() {
  return (
    <div>
      <span className="flex justify-center items-center text-white bg-neutral-700 px-2.5 py-1.5 rounded-lg text-xs font-doto">
        Created by Sohamm Kulkarni
        <div className="flex -space-x-1 ml-3">
          {/* GitHub */}
          <div
            className="size-6 rounded-full bg-white ring-2 ring-neutral-700 cursor-pointer flex items-center justify-center"
            title="Open GitHub"
            onClick={() =>
              window.open("https://github.com/sohammk08", "_blank")
            }
          >
            <FaGithub className="size-4.5 text-black" />
          </div>

          {/* X (Twitter) */}
          <div
            className="size-6 rounded-full bg-black ring-2 ring-neutral-700 cursor-pointer flex items-center justify-center"
            title="Open X"
            onClick={() => window.open("https://x.com/skulkarni2517", "_blank")}
          >
            <FaXTwitter className="size-4 p-0.5 text-white" />
          </div>

          {/* LinkedIn */}
          <div
            className="size-6 rounded-full bg-[#0A66C2] ring-2 ring-neutral-700 cursor-pointer flex items-center justify-center"
            title="Open LinkedIn"
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/sohamm-kulkarni-1b418b292/",
                "_blank",
              )
            }
          >
            <FaLinkedinIn className="size-4 p-0.5 text-white" />
          </div>
        </div>
      </span>
    </div>
  );
}

export default DevBadge;
