import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface PropsType {
  close: () => void;
}

const CreateRoomModal = ({ close }: PropsType) => {
  const [roomData, setRoomData] = useState({ roomName: "", description: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:4000/api/v1/room/create-room",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(roomData),
        }
      );

      const data = await response.json();

      if (!data.success) {
        return toast.error(data.message || "Failed to create room");
      }

      toast.success(data.message);
      navigate("/all-rooms");
      close();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
          <button
            onClick={close}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold mb-4">Create Room</h1>

          <form onSubmit={handleCreateRoom}>
            <div className="mb-4">
              <label
                htmlFor="roomName"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Enter Your Room Name:
              </label>
              <input
                type="text"
                name="roomName"
                id="roomName"
                value={roomData.roomName}
                onChange={handleChange}
                placeholder="Room Name"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Write Description:
              </label>
              <input
                type="text"
                name="description"
                id="description"
                value={roomData.description}
                onChange={handleChange}
                placeholder="Room Name"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-gray-800"
            >
              Create Room
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateRoomModal;
