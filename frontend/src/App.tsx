import { Navigate, Route, Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Signup } from "./page/Singup";
import { Login } from "./page/Login";
import Home from "./page/Home";
import Room from "./page/Room";
import { VideoPlayer } from "./components/VideoPlayer";

function App() {
  return (
    <>
      <div className="">
        <Navbar />

        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route path="/home" element={<Home />} />
          <Route path="/all-rooms" element={<Room />} />
          <Route path="/room/:roomId" element={<VideoPlayer />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
