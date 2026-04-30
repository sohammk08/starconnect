import Nav from "../components/Nav";

function Landing() {
  return (
    <div className="mx-2 sm:mx-4 mt-4">
      <Nav />
      <div className="flex h-[85vh] bg-black items-center justify-center mt-4 rounded-lg px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-anton font-medium flex max-w-sm sm:max-w-xl text-left rounded-lg text-white">
          Yo, this the landing page :)
        </h1>
      </div>
    </div>
  );
}

export default Landing;
