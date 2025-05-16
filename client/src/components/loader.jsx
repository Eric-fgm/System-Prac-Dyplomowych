import { Loader2 } from "lucide-react";
import { cn } from "../helpers/utils";

export function Loader({
  size = "md",
  text,
  fullScreen = false,
  className,
  containerClassName,
}) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-16 w-16",
  };

  const textSizeMap = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const loader = (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <Loader2
        className={cn("animate-spin text-gray-950", sizeMap[size], className)}
      />
      {text && (
        <p className={cn("mt-2 text-gray-500", textSizeMap[size])}>{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {loader}
      </div>
    );
  }

  return loader;
}
