import React from 'react';

const LOGO_URL = 'https://media.base44.com/images/public/6a3441804aa0668349e68ad9/1f3ae24a6_LOGOCIUDADACTIVA.png';

/**
 * sizes: 'xs'=32px | 'sm'=48px | 'md'=72px | 'lg'=96px | 'xl'=128px | 'hero'=160px
 * variant: 'default' (logo on any bg) | 'onDark' (white bg pill) | 'bare' (no container)
 */
const SIZES = { xs: 32, sm: 48, md: 72, lg: 96, xl: 128, hero: 160 };

export default function Logo({ size = 'md', variant = 'default', className = '' }) {
  const px = SIZES[size] || SIZES.md;

  if (variant === 'bare') {
    return (
      <img
        src={LOGO_URL}
        alt="Ciudad Activa"
        width={px}
        height={px}
        className={`object-contain select-none ${className}`}
        style={{ width: px, height: px }}
        draggable={false}
      />
    );
  }

  if (variant === 'onDark') {
    // White rounded container — logo has white bg, looks clean on dark surfaces
    const pad = Math.round(px * 0.12);
    return (
      <div
        className={`rounded-2xl bg-white flex items-center justify-center shadow-lg flex-shrink-0 ${className}`}
        style={{ width: px + pad * 2, height: px + pad * 2, padding: pad }}
      >
        <img src={LOGO_URL} alt="Ciudad Activa" width={px} height={px} className="object-contain" draggable={false} />
      </div>
    );
  }

  // default: transparent container (works on light backgrounds)
  return (
    <img
      src={LOGO_URL}
      alt="Ciudad Activa"
      width={px}
      height={px}
      className={`object-contain select-none ${className}`}
      style={{ width: px, height: px }}
      draggable={false}
    />
  );
}