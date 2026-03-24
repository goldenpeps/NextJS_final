"use client";

type ButtonType = {
  onClick?: () => void;
  children: React.ReactNode;
};

export function Button({ onClick, children }: ButtonType) {
  return (
    <button
      onClick={onClick}
      className="bg-dark text-white rounded-lg px-4 py-3 font-bold flex items-center cursor-pointer"
    >
      {children}
    </button>
  );
}
