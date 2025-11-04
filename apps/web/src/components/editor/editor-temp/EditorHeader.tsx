import { Button } from "@/components/ui/button";
import { Sparkles, LogOut } from "lucide-react";
import { ReactNode } from "react";

type EditorHeaderProps = {
  onLogout: () => void;
  children?: ReactNode;
};

export const EditorHeader = ({ onLogout, children }: EditorHeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          SlidesAI Editor
        </span>
      </div>

      <div className="flex items-center gap-3">
        {children}
        <Button variant="ghost" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </header>
  );
};
