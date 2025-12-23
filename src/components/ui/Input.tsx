import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export function Input({
  fullWidth = false,
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    />
  );
}
