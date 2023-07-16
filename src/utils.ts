import { AuthentecatedUser } from "./context/authContext";
import { Chat, ChatMapped, Participant } from "./context/chatContext";

export const filterParticipants = (
  participants: Participant[],
  filter: Participant["email"]
) => {
  return participants.filter((participant) => {
    return participant.email.toLowerCase() !== filter.toLowerCase();
  });
};

export const chatsMapper = (
  chats: Chat[],
  email: Participant["email"]
): ChatMapped[] => {
  return chats.map((chat) => {
    const { _id, participants, messages } = chat;
    const participant = filterParticipants(participants, email)[0];
    const lastMessage = messages[messages.length - 1];
    return { _id, participant, lastMessage };
  });
};

export const isMyMessage = (
  id: Participant["_id"],
  user: AuthentecatedUser
) => {
  if (user === null) return false;
  return id.toLowerCase() === user.user._id.toLowerCase();
};

export const generateAvatarName = (name: string) => {
  if (!name) return "";
  if (name.length === 0) return "";
  const splitedName = name.split(" ");
  if (splitedName.length === 1) return splitedName[0][0];
  return `${splitedName[0][0]}${splitedName[1][0]}`;
};

export const formatDate = (lastMessageDate: Date): string => {
  const date = new Date(lastMessageDate);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedTime = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedTime;
};

export const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: any[]) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
