import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Room = () => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:4000/api/v1/room/all-rooms",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!data.success) {
          return toast.error(data.message);
        }

        toast.success(data.message);
        setRooms(data.data);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [token]);

  console.log(token);
  console.log(rooms);

  return (
    <div className="w-9/12 mx-auto p-10">
      <div className="flex flex-col gap-4">
        {loading ? (
          <div>loading...</div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold font-sans text-center">
              All Rooms
            </h2>
            <div className="grid grid-cols-3 gap-4 mt-7">
              {rooms.map((room: any) => (
                <div
                  className="bg-[#FEFAE0] p-4 flex justify-between flex-col rounded-md shadow-md shadow-[#CCC5B9] px-4 py-2"
                  key={room.id}
                >
                  <div className="flex flex-col gap-4">
                    <p className="text-[16px] font-semibold font-sans">{room.roomName}</p>
                    <p className="text-[16px] font-sans">{room.description}</p>
                  </div>

                  <div className="flex items-center justify-center mt-4">
                    <button className="px-4 bg-gray-300 py-2 text-[16px] font-semibold font-serif text-center rounded-xl hover:scale-95 transition-all duration-100 cursor-pointer">Join</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;
