"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group !left-1/2 !right-auto !w-full !max-w-[430px] !-translate-x-1/2 !px-6"
      position="bottom-center"
      offset={{ bottom: 176, left: 16, right: 16 }}
      mobileOffset={{ bottom: 176, left: 16, right: 16 }}
      expand={false}
      visibleToasts={1}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        unstyled: true,
        duration: 1600,
        classNames: {
          toast:
            "cn-toast !mx-auto !flex !h-8 !w-[260px] !items-center !justify-center !rounded-full border border-border bg-popover px-3 text-center text-xs font-medium text-popover-foreground shadow-md [&_svg]:hidden",
          content: "!m-0 !w-full !p-0 text-center",
          title: "!w-full text-center text-xs font-medium leading-none",
          description: "hidden",
          success: "!border-accent-lime !bg-accent-lime !text-primary-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
