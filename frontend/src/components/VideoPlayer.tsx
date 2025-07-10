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
        //   socket.on("user-connected", async (userId: string) => {
        //     const pc = createPeerConnection(userId);
        //     peerConnections.current[userId] = pc;

        //     localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

        //     const offer = await pc.createOffer();
        //     await pc.setLocalDescription(offer);

        //     socket.emit("offer", { to: userId, offer });
        //   });

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
    <div>
      <video
        ref={localVideo}
        height= "430px"
        autoPlay
        muted
        playsInline
      />
      {remoteStreams.map(({ id, stream }) => (
        <video
          key={id}
          autoPlay
          playsInline
          height= "430px"
          ref={(el) => {
            if (el) el.srcObject = stream;
          }}
        />
      ))}
    </div>
  );
}
