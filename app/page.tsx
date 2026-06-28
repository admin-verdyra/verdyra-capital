import Navbar from "./components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-black">
            Capital That Moves{" "}
            <span className="text-yellow-600">Businesses Forward</span>
          </h1>

          <p className="mt-6 text-xl text-gray-600">
            Collateral-Free Business Financing from India's Leading Lending
            Partners.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <button className="rounded-full bg-yellow-600 px-8 py-4 font-semibold text-white hover:bg-yellow-700">
              Apply Now
            </button>

            <button className="rounded-full border border-black px-8 py-4 font-semibold hover:bg-gray-100">
              Become a Partner
            </button>
          </div>
        </div>
      </main>
    </>
  );
}