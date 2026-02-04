import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ScreenHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

const ScreenHeader = ({ title, showBack = true, onBack, rightElement }: ScreenHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-background border-b border-border">
      <div className="w-10">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
      </div>
      {title && (
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
      )}
      <div className="w-10 flex justify-end">
        {rightElement}
      </div>
    </header>
  );
};

export default ScreenHeader;
