import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink/60 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-pink text-white shadow-[0_0_18px_rgba(209,74,139,0.35)] hover:-translate-y-0.5",
        outline: "border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]",
        ghost: "text-fog hover:bg-white/[0.06] hover:text-white"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-[11px] uppercase tracking-[0.18em]",
        lg: "h-12 px-6"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={twMerge(buttonVariants({ variant, size }), className)} {...props} />;
}
