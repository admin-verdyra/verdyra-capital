export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div>
          <h1 className="text-3xl font-bold">
            <span className="text-black">Verdyra </span>
            <span className="text-yellow-600">Capital</span>
          </h1>
        </div>

        {/* Navigation */}
        <div className="hidden items-center gap-8 text-gray-700 lg:flex">
          <a href="#">Home</a>
          <a href="#">Business Loans</a>
          <a href="#">Personal Loans</a>
          <a href="#">Partners</a>
          <a href="#">About Us</a>
          <a href="#">Contact</a>
        </div>

        {/* Button */}
        <button className="rounded-full bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800">
          Merchant Login
        </button>
      </div>
    </nav>
  );
}