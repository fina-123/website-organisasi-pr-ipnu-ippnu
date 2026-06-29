interface LogoIPPNUProps {
  size?: number;
  className?: string;
  variant?: 'default' | 'navbar' | 'hero';
}

export function LogoIPPNU({ size = 40, className = '', variant = 'default' }: LogoIPPNUProps) {
  const dimension = size;

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <img
        src="/src/imports/LOGO_IPPNU_NEW.png"
        alt="Logo IPPNU"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
