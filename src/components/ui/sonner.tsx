import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={{ '--width': '50vw' } as React.CSSProperties}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-foreground/50 group-[.toaster]:text-background group-[.toaster]:border-0 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-[999px] group-[.toaster]:backdrop-blur-xl group-[.toaster]:px-3 group-[.toaster]:py-1.5 group-[.toaster]:text-xs group-[.toaster]:min-w-0 group-[.toaster]:max-w-[50vw] group-[.toaster]:w-[50vw] group-[.toaster]:inline-flex group-[.toaster]:items-center group-[.toaster]:gap-2",
          description: "group-[.toast]:text-background/60 group-[.toast]:text-xs",
          actionButton: "group-[.toast]:!bg-background/20 group-[.toast]:!text-background group-[.toast]:!rounded-full group-[.toast]:!h-7 group-[.toast]:!w-7 group-[.toast]:!p-0 group-[.toast]:!min-w-0 group-[.toast]:!text-base group-[.toast]:!ml-auto group-[.toast]:!flex group-[.toast]:!items-center group-[.toast]:!justify-center group-[.toast]:!leading-none",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
