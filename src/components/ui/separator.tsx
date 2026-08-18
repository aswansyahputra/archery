import { cn } from "@/lib/utils";
import * as React from "react";

export const Separator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("h-px w-full bg-border", className)} role="separator" {...props} />
));
Separator.displayName = "Separator";
