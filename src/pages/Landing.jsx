import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { MdOutlineAttachMoney } from "react-icons/md";
import { DiOpensource } from "react-icons/di";
import { FaGaugeSimple } from "react-icons/fa6";

function Landing() {
  return (
    <div className="mx-2 sm:mx-4 mt-4">
      <Nav />
      <div className="flex flex-col lg:flex-row min-h-[85vh] bg-black items-center justify-center mt-4 rounded-lg px-4 sm:px-6 py-12 gap-8 lg:gap-12">
        <img
          src="/logo.png"
          className="max-h-40 md:max-h-72 lg:max-h-96 w-auto object-contain shrink-0"
          alt="Star Connect Logo"
        />

        {/* Right section */}
        <div className="flex flex-col max-w-lg w-full items-center lg:items-start text-center lg:text-left">
          <h1 className="text-[1.95rem] sm:text-[3rem] md:text-[4.5rem] lg:text-[5.85rem] font-anton font-medium flex max-w-sm sm:max-w-xl lg:max-w-none text-center lg:text-left rounded-lg text-white mt-4 lg:mt-0">
            STAR CONNECT
          </h1>
          <span className="text-[1.3rem] text-gray-300">
            Never lose your contacts again
          </span>
          <p className="text-gray-400 mt-2 max-w-md">
            Save contacts to create a fail-safe in case you lose your contacts,
            or use as a digital phone book -{" "}
            <span>
              completely free and{" "}
              <Link
                className="underline underline-offset-[0.13rem]"
                to="https://www.github.com/sohammk08/starconnect"
                target="_blank"
                rel="noopener noreferrer"
              >
                open source
              </Link>
              .
            </span>
          </p>
          <ul className="flex flex-wrap justify-center lg:justify-start text-white gap-[1.17rem] no-underline mt-5">
            <li className="flex py-1.5 px-2 bg-white/10 rounded-xl border border-gray-800 gap-[0.65rem] items-center">
              <MdOutlineAttachMoney />
              Free Forever
            </li>
            <li className="flex py-1.5 px-2 bg-white/10 rounded-xl border border-gray-800 gap-[0.65rem] items-center">
              <DiOpensource /> Open Source
            </li>
            <li className="flex py-1.5 px-2 bg-white/10 rounded-xl border border-gray-800 gap-[0.65rem] items-center">
              <FaGaugeSimple /> Built for Simplicity
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Landing;
