import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillEyeFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

interface Props {
  type: string;
}

export const AuthFrom = ({ type }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  // console.log(login);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      console.log(formData);
      if (type === "signup") {
        const response = await fetch(
          "http://localhost:4000/api/v1/auth/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        toast.success(data.message);
        navigate("/login");
      } else {
        const response = await fetch(
          "http://localhost:4000/api/v1/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();
        if (!data.success) {
          toast.error(data.message);
          return;
        }

        console.log(data);

        toast.success(data.message);
        login({
          id: data.data.user.id,
          name: data.data.user.name,
          email: data.data.user.email,
          token: data.token,
        });
        navigate("/home");
      }
    } catch (error: string | any) {
      console.error("Login Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex items-center justify-center pt-20">
      {loading ? (
        <div>loading</div>
      ) : (

        <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-[#FEFAE0] text-black shadow-[#CCC5B9]">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight capitalize text-gray-900 md:text-2xl text-center font-sans">
              {type === "login"
                ? "Login meeting account"
                : "Create a meeting account"}
            </h1>

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {type !== "login" ? (
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 text-[16px]"
                  >
                    Your Name
                  </label>
                  <input
                    type="name"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="
                    border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600
                     focus:border-primary-600 block w-full p-2.5 bg-gray-300 "
                    placeholder="Enter Your Name"
                    required
                  />
                </div>
              ) : null}

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 text-[16px]"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  id="email"
                  className="
                border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600
                 focus:border-primary-600 block w-full p-2.5 bg-gray-300 "
                  placeholder="mdkhalidalam001@gmail.com"
                  required
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 text-[16px]"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="
                border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600
                 focus:border-primary-600 block w-full p-2.5 bg-gray-300 "
                  required
                />
                <p className="absolute right-3 top-13 transform -translate-y-1/2 text-gray-600">
                  {showPassword ? (
                    <BsFillEyeFill onClick={() => setShowPassword(false)} />
                  ) : (
                    <BsFillEyeSlashFill onClick={() => setShowPassword(true)} />
                  )}
                </p>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-gray-800"
              >
                {type === "login" ? "Login" : "Signup"}
              </button>

              <p className="text-sm font-light text-gray-800 dark:text-gray-500 text-center">
                Already have an account?{" "}
                <Link
                  to={type === "login" ? "/signup" : "/login"}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {type === "login" ? "Signup" : "Login"}
                </Link>
              </p>
            </form>
          </div>
        </div>
        
      )}
    </section>
  );
};
