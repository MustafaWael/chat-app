import { BsFillPersonPlusFill } from "react-icons/bs";

export default function AddContactButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex-1 flex justify-center items-center">
      <button
        onClick={onClick}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-4 rounded-3xl"
      >
        <BsFillPersonPlusFill />
      </button>
    </div>
  );
}
