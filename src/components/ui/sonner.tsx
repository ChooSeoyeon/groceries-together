import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-foreground/85 group-[.toaster]:text-background group-[.toaster]:border-0 group-[.toaster]:shadow-lg group-[.toaster]:rounded-full group-[.toaster]:backdrop-blur-md group-[.toaster]:px-4 group-[.toaster]:py-2 group-[.toaster]:text-sm group-[.toaster]:w-auto group-[.toaster]:min-w-0",
          description: "group-[.toast]:text-background/70",
          actionButton: "group-[.toast]:bg-background/20 group-[.toast]:text-background group-[.toast]:rounded-full group-[.toast]:px-2 group-[.toast]:py-1",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
