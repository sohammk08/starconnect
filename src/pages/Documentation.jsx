import React from "react";
import Nav from "../components/Nav";
import DevBadge from "../components/DevBadge";

function Documentation() {
  return (
    <div className="mx-2 sm:mx-4 mt-4">
      <Nav />

      <div className="relative flex flex-col min-h-[85vh] bg-black items-center justify-center mt-4 rounded-lg overflow-hidden py-6 sm:py-12">
        {/* <div className="space-y-5 sm:space-y-10 text-white px-5 my-auto items-center"> */}
        <div className="space-y-5 sm:space-y-10 text-white px-5 my-auto items-center max-w-xl">
          <h1 className="text-2xl sm:text-4xl md:text-4xl text-center font-bold text-white mb-5 sm:mb-14">
            Documentation
          </h1>
          {/* Introduction Section */}
          <div className="space-x-1.5">
            <h3 className="text-lg sm:text-xl font-medium text-white">
              Introduction
            </h3>
            <p className="text-xs sm:text-base leading-relaxed text-white/80">
              Star Connect is a place where you can save your contacts for
              backup or for referencing, just in case you misplace any or all of
              your contacts. It is free and open source!
            </p>
          </div>

          {/* About Section */}
          <div className="space-x-1.5">
            <h3 className="text-lg sm:text-xl font-medium text-white">About</h3>
            <p className="text-xs sm:text-base leading-relaxed text-white/80">
              Originally, Star Connect was a part of starrvault.com but due to
              issues with managing and maintaining the code, I decided to
              modularize Star Connect and make it into its own open-source
              project. If you find this project useful, please give a shoutout
              to Sohamm Kulkarni on LinkedIn, X or Instagram.
            </p>
          </div>
          <p className="text-xs sm:text-base italic leading-relaxed text-white/80">
            I hope you find Star Connect useful. Thanks for being here :)
          </p>
          <DevBadge />
        </div>
      </div>
    </div>
  );
}

export default Documentation;
