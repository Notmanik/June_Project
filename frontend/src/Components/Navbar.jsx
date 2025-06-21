import { jwtDecode } from 'jwt-decode';
import { Link, Outlet } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem("token");
  let username = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.username;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  return token ? (
    <div className="flex space justify-between items-center bg-gray-800 p-4 text-white">
      <h1 className="text-lg font-bold">Hello {username}</h1>
      {/* Logout */}
      <div>
        <ul className="flex space-x-4">
          <li className="text-lg font-bold">
            <Link to="/home">Home</Link>
          </li>
          <li className="text-lg font-bold">
            <Link to="/home/profile">Profile</Link>
          </li>
          <li className="text-lg font-bold">
            <Link to="/home/createpost">Create Post</Link>
          </li>
        </ul>
      </div>
        <Link
            to="/"
            className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
            }}> LogOut</Link>
    </div>
  ) : (
    <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
      <ul className="flex space-x-4">
        <li className="text-lg font-bold">
          <Link to="/SignUp">SignUp</Link>
        </li>
        <li className="text-lg font-bold">
          <Link to="/LogIn">LogIn</Link>
        </li>
      </ul>
      <Outlet />
    </nav>
  );
};

export default Navbar;
