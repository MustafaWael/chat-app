/* eslint-disable react/no-unescaped-entities */
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import ScrollArea from "./ScrollArea";
import { IoMdArrowBack, IoMdSend } from "react-icons/io";
import { Message, MessageContext } from "@/context/messageContext";
import { AuthContext, AuthentecatedUser, User } from "@/context/authContext";
import { formatDate, generateAvatarName, isMyMessage } from "@/utils";
import { ChatContext } from "@/context/chatContext";
import { SocketContext } from "@/context/socket";
import { useRouter } from "next/router";

export default function RightSide() {
  const { messages, getMessages, onReceiveMessage, loading } =
    useContext(MessageContext);
  const { chat, getChat } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
    });
  }, [messages]);

  useEffect(() => {
    getChat();
    getMessages();
  }, [getChat, getMessages]);

  useEffect(() => {
    onReceiveMessage();

    return () => {
      socket?.off("message");
    };
  }, [onReceiveMessage, socket]);

  return (
    <div className="flex-1 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
      {/* Chat Heaer Component */}
      <ChatHeader name={chat?.participant.name as string} />
      <ScrollArea ref={scrollAreaRef}>
        {/* Chat DWindow Component */}
        <ChatWindow
          messages={messages || []}
          user={user as AuthentecatedUser}
          loading={loading}
        />
      </ScrollArea>
      {/* Chat Input Component */}
      <ChatInput />
    </div>
  );
}

const ChatHeader = ({ name }: { name: User["name"] }) => {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const { socket } = useContext(SocketContext);
  const { chat } = useContext(ChatContext);

  useEffect(() => {
    if (!socket) return;
    socket.on("online", ({ userId, isOnline }) => {
      if (userId === chat?.participant._id) {
        setIsOnline(isOnline);
      }
    });

    return () => {
      setIsOnline(false);
    };
  }, [socket, chat?.participant._id]);

  useEffect(() => {
    // get online status initially
    if (!socket) return;
    socket.emit(
      "getOnlineSocket",
      { userId: chat?.participant._id as string },
      ({ userId, isOnline }) => {
        if (userId === chat?.participant._id) {
          setIsOnline(isOnline);
        }
      }
    );

    return () => {
      // set isOnline to false when component unmounts
      setIsOnline(false);
    };
  }, [socket, chat?.participant._id]);

  return (
    <div className="bg-gray-100 p-3 flex items-center gap-x-3 sticky top-0 left-0 w-full">
      {/* back button */}
      <button
        className="md:hidden text-gray-500 hover:text-gray-600"
        onClick={router.back}
      >
        <IoMdArrowBack size={20} />
      </button>
      <div className="w-12 h-12 rounded-full grid place-content-center bg-blue-500 text-white text-xl">
        {generateAvatarName(name)}
      </div>

      <div>
        <h3 className="font-semibold capitalize">{name}</h3>
        {isOnline && <p className="text-sm text-gray-400">Online</p>}
      </div>
    </div>
  );
};

const ChatWindow = ({
  messages,
  user,
  loading,
}: {
  messages: Message[];
  user: AuthentecatedUser;
  loading: boolean;
}) => {
  return (
    <div className="">
      {loading ? (
        <div className="flex items-center justify-center h-20">
          <p className="text-gray-400 font-semibold">Loading...</p>
        </div>
      ) : (
        <MessageList messages={messages} user={user} />
      )}
    </div>
  );
};

const MessageList = ({
  messages,
  user,
}: {
  messages: Message[];
  user: AuthentecatedUser;
}) => {
  return (
    <ul className="p-4 flex-1 flex flex-col gap-y-4">
      {messages.map((message) => (
        <MessageListItem
          key={message._id}
          isMyMessage={isMyMessage(message.sender._id, user)}
          message={message}
        />
      ))}
    </ul>
  );
};

const MessageListItem = ({
  isMyMessage,
  message,
}: {
  isMyMessage: boolean;
  message: Message;
}) => {
  const myMessageClass = isMyMessage ? "bg-blue-400" : "bg-gray-400";
  return (
    <li className={`${isMyMessage ? "self-end" : "self-start"}`}>
      <div
        className={`flex items-center gap-x-4  p-2 rounded-lg  ${myMessageClass}`}
      >
        <div className="flex-1 min-w-[40px]">
          <p className="text-white">{message.message}</p>
        </div>
      </div>
      <span
        className={`text-xs text-gray-300 flex ${
          isMyMessage ? "justify-end" : "justify-start"
        }`}
      >
        {formatDate(message.timeStamp)}
      </span>
    </li>
  );
};

const ChatInput = () => {
  const { sendMessage } = useContext(MessageContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSumit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;

    if (inputRef.current) inputRef.current.value = "";

    if (message) {
      sendMessage(message);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={handleSumit}
      className="bg-gray-100 p-3 flex items-center gap-x-3 sticky top-0 left-0 mt-auto"
    >
      <input
        ref={inputRef}
        type="text"
        name="message"
        className="flex-1 bg-gray-200 py-3 px-4 rounded-xl outline-none"
        placeholder="Type a message"
      />
      <button
        type="submit"
        className="w-10 h-10 rounded-xl bg-blue-500 text-white grid place-content-center"
      >
        <IoMdSend />
      </button>
    </form>
  );
};
