import { IoSearchOutline } from "react-icons/io5";

interface ChatListSearchInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ChatListSearchInput({
  onChange,
}: ChatListSearchInputProps) {
  return (
    <div className="sticky top-0 left-0 w-full p-4 bg-white rounded-t-lg z-10">
      <div className="w-full flex justify-center items-center relative">
        <IoSearchOutline className="absolute left-3 text-gray-400" />
        <input
          onChange={onChange}
          type="text"
          className="w-full pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ring-1 ring-gray-200"
          placeholder="Search"
        />
      </div>
    </div>
  );
}
