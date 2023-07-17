import { SocketContext } from "@/context/socket";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function Layout() {
  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const { chatId } = router.query;

  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (!socket) return;
    socket.connect();

    // dissconnect socket on window close or refresh or tap change
    window.addEventListener("beforeunload", () => {
      socket.disconnect();
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  if (isSmallScreen && chatId) {
    return <RightSide />;
  }

  if (isSmallScreen && !chatId) {
    return <LeftSide />;
  }

  if (!isSmallScreen && !chatId) {
    return <LeftSide />;
  }

  return (
    <>
      {/* Left side */}
      <LeftSide />
      {/* Right side */}
      <RightSide />
    </>
  );
}
