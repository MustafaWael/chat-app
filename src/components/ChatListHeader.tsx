import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { HiOutlineLogout } from "react-icons/hi";
import LoadingIcon from "./LoadingIcon";
import { generateAvatarName } from "@/utils";
import { SocketContext } from "@/context/socket";

export default function ChatListHeader() {
  const { user: authUser, logout, loading } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const username = authUser?.user.name as string;

  const handleLogout = () => {
    logout();
    socket?.disconnect();
  };

  return (
    <div className="bg-gray-100 p-3 sticky top-0 left-0 w-full flex">
      <div className="flex items-center gap-x-3">
        <div className="w-12 h-12 rounded-full grid place-content-center bg-blue-500 text-white text-xl">
          {generateAvatarName(username)}
        </div>

        <div>
          <div className="flex items-center gap-x-2">
            <h3 className="font-semibold capitalize">{username} </h3>
            <span className="text-gray-400 font-bold text-sm flex">Online</span>
          </div>
          <span className="text-gray-400 text-sm flex">
            {authUser?.user._id}
          </span>
        </div>
      </div>

      <div className="flex-1 flex justify-end items-center">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold p-3 rounded-xl"
        >
          {loading ? <LoadingIcon /> : <HiOutlineLogout size={20} />}
        </button>
      </div>
    </div>
  );
}
