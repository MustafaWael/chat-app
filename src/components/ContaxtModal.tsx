import { api } from "@/api";
import { AuthContext } from "@/context/authContext";
import { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import { FormEvent, useContext, useState } from "react";
import LoadingIcon from "./LoadingIcon";
import { ChatContext } from "@/context/chatContext";

export default function ContactModal({ onClose }: { onClose: () => void }) {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { getChats } = useContext(ChatContext);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userId = formData.get("userId");

    const token = (user?.token || getCookie("token")) as string;

    try {
      setLoading(true);
      if (userId) {
        if (!user) return;

        const { data } = await api.post(
          "/chats",
          {
            participants: [userId, user.user._id],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data) {
          onClose();
          getChats();
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return setError(error.response?.data.error);
      }

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-20 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold">Add Contact</h3>
        <p className="text-gray-400 mb-2">Enter ID of the user</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="userId"
            placeholder="User ID"
            className="border border-gray-300 p-2 rounded-lg w-full"
          />
          {/* Error */}
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <div className="flex justify-end gap-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 p-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-lg flex gap-x-3 items-center"
            >
              <span>Add</span> {loading && <LoadingIcon />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
