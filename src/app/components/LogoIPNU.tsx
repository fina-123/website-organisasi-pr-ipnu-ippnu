interface LogoIPNUProps {
  size?: number;
  className?: string;
  variant?: 'default' | 'hero';
}

export function LogoIPNU({ size = 40, className = '', variant = 'default' }: LogoIPNUProps) {
  return (
    <div
      className={`rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/src/imports/LOGO_IPNU_NEW.png"
        alt="Logo IPNU"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
