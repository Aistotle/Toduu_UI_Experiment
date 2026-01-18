interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Button({ children, onClick, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-accent text-white font-sans font-medium
        px-8 py-3.5 rounded-md
        transition-all duration-fast ease-ds
        hover:shadow-2 hover:-translate-y-0.5
        active:translate-y-0 active:shadow-1
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg
        ${className}
      `}
    >
      {children}
    </button>
  );
}
