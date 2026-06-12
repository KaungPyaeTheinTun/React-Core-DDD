import { Loader } from "lucide-react";

const Spinner = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white/70">
      <Loader className="w-12 h-12 animate-spin text-blue-500" />
    </div>
  );
};

export default Spinner;
