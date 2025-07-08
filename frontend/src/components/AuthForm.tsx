import { Link } from "react-router-dom";

interface Props {
  type: string;
}
export const AuthFrom = ({ type }: Props) => {
  return (
    <section className="flex items-center justify-center pt-20">
      <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-[#FEFAE0] text-black shadow-[#CCC5B9]">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight capitalize text-gray-900 md:text-2xl text-center font-sans">
            {
                type === "login" ? "Login meeting account" : "Create a meeting account"
            }
          </h1>

          <form className="space-y-4 md:space-y-6">
            {type !== "login" && (
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
                  id="email"
                  className="
                border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600
                 focus:border-primary-600 block w-full p-2.5 bg-gray-300 "
                  placeholder="mdkhalidalam001@gmail.com"
                  required
                />
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 text-[16px]"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="
                border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600
                 focus:border-primary-600 block w-full p-2.5 bg-gray-300 "
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium text-gray-900 text-[16px]"
              >
                Confirm password
              </label>
              <input
                type="confirm-password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                className="
                border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600
                 focus:border-primary-600 block w-full p-2.5 bg-gray-300 "
                required
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-gray-800"
            >
              Create an account
            </button>

            <p className="text-sm font-light text-gray-800 dark:text-gray-500 text-center">
              Already have an account?{" "}
              <Link
                to={ type === "login" ? "/signup" : "/login"}
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                {
                    type === "login" ? "Signup" : "Login"
                }
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
