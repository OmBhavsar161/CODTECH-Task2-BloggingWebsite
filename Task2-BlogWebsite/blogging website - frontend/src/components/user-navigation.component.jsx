import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

export default function UserNavigationPanel() {
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(UserContext);

  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ access_token: null });
  };

  return (
    <div className="shadow-md rounded-lg p-5 w-[240px] bg-cyan-50 mt-1">
      <h2 className="text-xl font-semibold mb-8">User Navigation</h2>
      <nav className="flex flex-col space-y-3">
        <Link
          to="/editor"
          className="flex items-center text-gray-700 hover:text-blue-500 transition duration-200"
        >
          {/* <i className="fi fi-rr-file-edit mr-2"></i> */}
          <span>Write</span>
        </Link>

        <Link
          to={`/user/${username}`}
          className="text-gray-700 hover:text-blue-500 transition duration-200"
        >
          Profile
        </Link>

        <Link
          to="/dashboard/blogs"
          className="text-gray-700 hover:text-blue-500 transition duration-200"
        >
          Dashboard
        </Link>

        <Link
          to="/settings/edit-profile"
          className="text-gray-700 hover:text-blue-500 transition duration-200"
        >
          Settings
        </Link>
      </nav>

      <div className="border-t border-gray-300 my-4"></div>

      <button
        onClick={signOutUser}
        className="flex items-center w-full bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 transition duration-200"
      >
        <h1 className="font-semibold">Sign Out</h1>
        <p className="ml-4">@{username}</p>
      </button>
    </div>
  );
}
