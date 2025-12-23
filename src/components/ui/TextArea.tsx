import type { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  fullWidth?: boolean;
}

export function TextArea({
  fullWidth = false,
  className = "",
  ...props
}: TextAreaProps) {
  return (
    <textarea
      className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    />
  );
}
