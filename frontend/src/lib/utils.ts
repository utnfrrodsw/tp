import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "bg-color": [
        {
          bg: [
            "background",
            "foreground",
            "popover",
            "popover-foreground",
            "primary",
            "primary-foreground",
            "secondary",
            "secondary-foreground",
            "muted",
            "muted-foreground",
            "accent",
            "accent-foreground",
            "destructive",
            "destructive-foreground",
            "card",
            "card-foreground",
            "border",
            "input",
            "ring",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
