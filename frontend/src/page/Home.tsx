import { useState } from "react";
import CreateRoomModal from "../components/CreateRoomModal";
import { Link } from "react-router-dom";

const Home = () => {
  const [openModal, setOpenModal] = useState(false);

  const closemodal = () => setOpenModal(false);

  return (
    <div className="w-9/12 mx-auto pt-50">
      <div className="flex flex-col gap-4 items-center justify-center">
        <h2 className="text-4xl font-bold font-sans">Welcome to MKA MEET</h2>

        <div className="text-center flex gap-2 flex-col">
          <p className="text-[16px] font-semibold font-sans">
            Video conferencing and collaboration platform
          </p>
          <p className="text-[16px] font-semibold font-sans">
            For developers, teams, and anyone needing an interactive space for
            remote collaboration.
          </p>
        </div>

        <div className="flex gap-14">
          <button
            onClick={() => setOpenModal(true)}
            className="px-4 bg-gray-300 py-2 text-[16px] font-semibold font-serif text-center rounded-xl hover:scale-95 transition-all duration-100 cursor-pointer"
          >
            Create Room
          </button>
          <button className="px-4 bg-gray-300 py-2 text-[16px] font-semibold font-serif text-center rounded-xl hover:scale-95 transition-all duration-100 cursor-pointer">
            <Link to="/all-rooms">All Rooms</Link>
          </button>
        </div>

        {openModal && <CreateRoomModal close={closemodal} />}
      </div>
    </div>
  );
};

export default Home;
