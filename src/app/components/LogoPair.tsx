import { LogoIPNU } from './LogoIPNU';
import { LogoIPPNU } from './LogoIPPNU';

interface LogoPairProps {
  ipnuSize?: number;
  ippnuSize?: number;
  gap?: number;
  showLabels?: boolean;
  darkMode?: boolean;
  className?: string;
  variant?: 'default' | 'navbar' | 'hero';
}

export function LogoPair({
  ipnuSize = 40,
  ippnuSize = 40,
  gap = 8,
  showLabels = false,
  darkMode = false,
  className = '',
  variant = 'default',
}: LogoPairProps) {
  // Determine logo variants based on LogoPair variant
  const ipnuVariant = variant === 'hero' ? 'hero' : 'default';
  const ippnuVariant = variant === 'navbar' ? 'navbar' : variant === 'hero' ? 'hero' : 'default';

  // Label styling based on variant
  const labelClass = variant === 'hero'
    ? 'text-xs mt-3 text-white opacity-80'
    : `text-xs mt-2 ${darkMode ? 'text-white/70' : 'text-gray-600'}`;

  return (
    <div className={`flex items-center ${className}`} style={{ gap: `${gap}px` }}>
      <div className="flex flex-col items-center">
        <LogoIPNU
          size={ipnuSize}
          variant={ipnuVariant}
          className={darkMode && variant !== 'hero' ? 'shadow-lg shadow-white/20' : ''}
        />
        {showLabels && (
          <span className={labelClass}>
            IPNU
          </span>
        )}
      </div>
      <div className="flex flex-col items-center">
        <LogoIPPNU
          size={ippnuSize}
          variant={ippnuVariant}
          className={darkMode && variant !== 'hero' ? 'shadow-lg shadow-white/20' : ''}
        />
        {showLabels && (
          <span className={labelClass}>
            IPPNU
          </span>
        )}
      </div>
    </div>
  );
}
