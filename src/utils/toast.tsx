import { MessageSquare } from "lucide-react";
import { toast } from "react-toastify";

export const showNewCommentToast = (author: string, message: string): void => {
  toast(
    <div className="flex items-center gap-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 border border-blue-200/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
        <MessageSquare className="h-5 w-5 stroke-[2.5] text-blue-600" />
      </div>
      <div className="flex flex-col tracking-wide">
        <span className="text-sm font-bold text-zinc-800 leading-tight">
          New Message.
        </span>
        <span className="text-xs text-zinc-500 font-medium mt-0.5">
          {author}:{ }
          <span className="text-zinc-600 font-normal">{message}</span>
        </span>
      </div>
    </div>,
  );
};
