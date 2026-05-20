import React from "react";
import Nav from "../components/Nav";

function ErrorPage() {
  return (
    <div className="mx-2 sm:mx-4 mt-4">
      <Nav />
      <div className="relative flex min-h-[85vh] bg-black items-center justify-center mt-4 rounded-lg overflow-hidden py-6 sm:py-0">
        <div className="absolute inset-0 p-2 sm:p-5">
          <img
            src="/image.png"
            className="h-full w-full object-cover rounded-lg"
            alt=""
          />
        </div>

        <div className="absolute inset-0 bg-black/10 rounded-lg" />
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-[15rem] text-white z-10 italic tracking-wider font-bold font-anton">
            404
          </h1>
          <p className="text-white z-10 text-2xl font-medium">Page Not Found</p>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
