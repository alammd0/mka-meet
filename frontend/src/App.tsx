import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Signup } from "./page/Singup";
import { Login } from "./page/Login";

function App() {
  return (
    <>
      <div className="">
        <Navbar />

        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
