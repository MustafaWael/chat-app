import { useState, useContext, useEffect } from "react";
import { ChatContext } from "@/context/chatContext";
import ChatList from "@/components/ChatList";
import ChatListSearchInput from "@/components/ChatListSearchInput";
import ScrollArea from "@/components/ScrollArea";
import AddContactButton from "@/components/AddContactButton";
import ContactModal from "@/components/ContaxtModal";
import ChatListHeader from "@/components/ChatListHeader";
import { debounce } from "@/utils";
import Skeleton from "./Skeleton";

export default function LeftSide() {
  const { chats, getChats, searchChats, loading } = useContext(ChatContext);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const debouncedSearch = debounce(searchChats, 500);

  useEffect(() => {
    getChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Wrap it with debounce function

    debouncedSearch(e.target.value);
  };

  return (
    <div className="w-full md:w-96 flex flex-col h-full bg-white overflow-hidden rounded-lg relative">
      <ScrollArea>
        {/* ChatListHeader Component */}
        <ChatListHeader />
        {/* ChatListSearchInput Component */}
        <ChatListSearchInput onChange={handleSearch} />
        {/* ChatList Component */}
        {loading && !chats ? (
          <p className="p-4">Loading...</p>
        ) : (
          <ChatList chats={chats} />
        )}
        {/* ContactModal Component*/}
        {contactModalOpen && (
          <ContactModal onClose={() => setContactModalOpen(false)} />
        )}
      </ScrollArea>
      
      {/* AddContactButton Component */}
      <div className="absolute bottom-4 right-4 z-10">
        <AddContactButton onClick={() => setContactModalOpen(true)} />
      </div>
    </div>
  );
}
