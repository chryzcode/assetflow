//import svg
//where should it be placed?

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-6 border-b border-gray-800">
      <p className="text-xl font-bold text-blue-500">ASSETFLOW</p>

      <div className="space-x-6">
        {/* add a line under the text when hover */}

        <a
          href="#"
          className="text-white hover:border-b-2 border-blue-900"
        >
          Home
        </a>
        <a
          href="#"
          className="text-white  hover:border-b-2 border-blue-900"
        >
          Service
        </a>

        <a
          href="#"
          className="text-white  hover:border-b-2 border-blue-900"
        >
          Work
        </a>
        <a
          href="#"
          className="text-white  hover:border-b-2 border-blue-900"
        >
          About us
        </a>
        <a
          href="#"
          className="text-white  hover:border-b-2 border-blue-900"
        >
          Blog
        </a>
      </div>
      <button className="bg-blue-500 px-4 py-2 text-white font-bold">
        Register
      </button>
    </nav>
  );
};

export default Navbar;
