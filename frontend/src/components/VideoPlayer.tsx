import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket";

export function VideoPlayer() {
  const { roomId } = useParams();
  const localVideo = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const [remoteStreams, setRemoteStreams] = useState<
    { id: string; stream: MediaStream }[]
  >([]);

  const [muted, setMuted] = useState(true);
  const [remoteMuted, setRemoteMuted] = useState<Record<string, boolean>>({});

  // mute and unmute Function
  const toggleMute = () => {
    if (!localVideo.current?.srcObject) return;

    const stream = localVideo.current?.srcObject as MediaStream;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setMuted((prev) => !prev);
    socket.emit("toggle-audio", { roomId, userId: socket.id, toggle: !muted });
  };

  // console.log("remoteMuted", remoteMuted);
  // console.log("muted - ", muted);

  useEffect(() => {
    let localStream: MediaStream;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream = stream;
        if (localVideo.current) {
          localVideo.current.srcObject = stream;
        }

        socket.emit("join-room", { roomId, userId: socket.id });

        // handle user Audio mute
        socket.on("toggle-audio", ({ userId, toggle }) => {
          setRemoteMuted((prev) => {
            return {
              ...prev,
              [userId]: toggle,
            };
          });
        });

        // handle existing users
        socket.on("existing-users", (users: string[]) => {
          users.forEach(async (userId) => {
            const pc = createPeerConnection(userId);
            peerConnections.current[userId] = pc;

            localStream
              .getTracks()
              .forEach((track) => pc.addTrack(track, localStream));

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit("offer", { to: userId, offer });
          });
        });

        // handle user-connected
        socket.on("user-connected", async (userId: string) => {
          const pc = createPeerConnection(userId);
          peerConnections.current[userId] = pc;

          localStream
            .getTracks()
            .forEach((track) => pc.addTrack(track, localStream));
        });

        // handle offer
        socket.on("offer", async ({ from, offer }) => {
          const pc = createPeerConnection(from);
          peerConnections.current[from] = pc;

          localStream
            .getTracks()
            .forEach((track) => pc.addTrack(track, localStream));

          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          socket.emit("answer", { to: from, answer });
        });

        // handle answer
        socket.on("answer", async ({ from, answer }) => {
          const pc = peerConnections.current[from];
          if (!pc) return;
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        // handle ICE
        socket.on("ice-candidate", async ({ from, candidate }) => {
          const pc = peerConnections.current[from];
          if (!pc) return;
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        });

        socket.on("user-disconnected", (userId: string) => {
          if (peerConnections.current[userId]) {
            peerConnections.current[userId].close();
            delete peerConnections.current[userId];
            setRemoteStreams((prev) => prev.filter((s) => s.id !== userId));
          }
        });
      });

    return () => {
      socket.off("existing-users");
      socket.off("user-connected");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-disconnected");
    };
  }, [roomId]);

  function createPeerConnection(userId: string): RTCPeerConnection {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: userId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      if (stream) {
        setRemoteStreams((prev) => [
          ...prev.filter((s) => s.id !== userId),
          { id: userId, stream },
        ]);
      }
    };

    return pc;
  }

  return (
    <div className="w-9/12 max-w-7xl mx-auto p-4 bg-[#FEFAE0] mt-4 rounded-md shadow-md shadow-[#CCC5B9]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Local Video */}
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg border-2 border-gray-300">
          <video
            ref={localVideo}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
          <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1">
            You
          </div>

          <button
            onClick={toggleMute}
            className="absolute top-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded"
          >
            {muted ? "Mute" : "Unmute"}
          </button>
        </div>

        {/* Remote Videos */}
        {remoteStreams.map(({ id, stream }) => (
          <div
            key={id}
            className="relative aspect-video rounded-lg overflow-hidden shadow-lg border-2 border-gray-300"
          >
            <video
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              ref={(el) => {
                if (el) el.srcObject = stream;
              }}
            />

            {remoteMuted[id] && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded">
                Muted
              </div>
            )}

            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1">
              Remote user
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
