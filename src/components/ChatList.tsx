import { ChatMapped } from "@/context/chatContext";
import Link from "next/link";
import LastMessage from "./LastMessage";
import { formatDate, generateAvatarName } from "@/utils";
import { SocketContext } from "@/context/socket";
import { useContext, useEffect, useState } from "react";

interface ChatListProps {
  chats: ChatMapped[];
}

export default function ChatList({ chats }: ChatListProps) {
  return (
    <ul className="py-4 flex flex-col gap-y-4 px-2">
      {chats.map((chat) => (
        <ChatListItem key={chat._id} chat={chat} />
      ))}
    </ul>
  );
}

const ChatListItem = ({ chat }: { chat: ChatMapped }) => {
  const { socket } = useContext(SocketContext);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (!socket) return;
    socket.on("online", ({ userId, isOnline }) => {
      if (userId === chat.participant._id) {
        setOnline(isOnline);
      }
    });
  }, [socket, chat.participant._id]);

  useEffect(() => {
    // get online status initially
    if (!socket) return;
    socket.emit(
      "getOnlineSocket",
      { userId: chat.participant._id },
      ({ userId, isOnline }) => {
        if (userId === chat.participant._id) {
          setOnline(isOnline);
        }
      }
    );
  }, [socket, chat.participant._id]);

  return (
    <li>
      <Link href={`/app?chatId=${chat._id}`}>
        <div className="flex items-center gap-x-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          <div className="w-12 h-12 rounded-full grid place-content-center bg-blue-500 text-white text-xl relative">
            {/* Online indecator */}
            {online && (
              <div className="absolute w-3 h-3 bg-green-500 rounded-full bottom-0 right-0"></div>
            )}
            {generateAvatarName(chat.participant.name)}
          </div>

          <LastMessage chatId={chat._id} messageId={chat.lastMessage as string}>
            {(message, loading) => {
              const messageText = message?.message || null;
              const messageDate = message?.timeStamp || null;
              return (
                <>
                  <div className="flex-1">
                    <h3 className="font-semibold">{chat.participant.name}</h3>
                    <p className="text-sm text-gray-400">
                      {loading ? "loading..." : messageText}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {loading
                      ? "loading..."
                      : messageDate && formatDate(messageDate)}
                  </p>
                </>
              );
            }}
          </LastMessage>
        </div>
      </Link>
    </li>
  );
};
