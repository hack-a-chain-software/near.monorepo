import React from "react";
import { Spinner } from "../assets/animations";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export function Button({ loading = false, children, ...props }: ButtonProps) {
  return loading ? (
    <button
      className={
        "inline-flex items-center gap-3 justify-center px-5 py-2 border border-transparent text-base font-medium rounded-xl text-black bg-[#00FFAD]"
      }
      {...props}
    >
      <Spinner />
      {children}
    </button>
  ) : (
    <button
      className={
        "inline-flex items-center gap-3 justify-center px-5 py-2 border border-transparent text-base font-medium rounded-xl text-black bg-[#00FFAD]"
      }
      {...props}
    >
      {children}
    </button>
  );
}
