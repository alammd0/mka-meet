
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout(){
     logout();
     toast.success("Logout Successfully");
     navigate("/login");
  }

  return (
    <div className="w-9/12 mx-auto bg-[#FEFAE0] px-4 py-2 mt-4 rounded-md shadow-md shadow-[#CCC5B9]">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-sans font-bold text-shadow-cyan-200 text-shadow-2xs">
          MKA MEET
        </div>

        <div className="flex">
          {!user.token ? (
            <div className="flex gap-6">
              <button className="px-4 bg-gray-300 py-2 text-[16px] font-semibold font-serif text-center rounded-xl hover:scale-95 transition-all duration-100 cursor-pointer">
                <Link to="/login">Login</Link>
              </button>
              <button className="px-4 bg-gray-300 py-2 text-[16px] font-semibold font-serif text-center rounded-xl hover:scale-95 transition-all duration-100 cursor-pointer">
                <Link to="/signup">Signup</Link>
              </button>
            </div>
          ) : (
            <div className="flex gap-6">
              <button className="px-4 bg-gray-300 py-2 text-[16px] font-semibold font-serif text-center rounded-xl hover:scale-95 transition-all duration-100 cursor-pointer">
                Join Room
              </button>
              <button onClick={handleLogout} className="px-4 bg-gray-300 py-2 text-[16px] font-semibold font-serif text-center rounded-xl hover:scale-95 transition-all duration-100 cursor-pointer">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
