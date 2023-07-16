import { Message, MessageContext } from "@/context/messageContext";
import { useContext, useEffect, useState } from "react";

interface LastMessageProps {
  chatId: string;
  messageId: string;
  children: (message: Message | undefined, loading: boolean) => React.ReactNode;
}

export default function LastMessage({
  chatId,
  messageId,
  children,
}: LastMessageProps) {
  const [lastMessage, setLastMessage] = useState<Message | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const { getMessageById } = useContext(MessageContext);

  useEffect(() => {
    if (!messageId || !chatId) return;
    setLoading(true);
    const getMessage = async () => {
      const message = await getMessageById(messageId, chatId);
      setLastMessage(message);
      setLoading(false);
    };

    getMessage();
  }, [chatId, getMessageById, messageId]);

  return <>{children(lastMessage, loading)}</>;
}
