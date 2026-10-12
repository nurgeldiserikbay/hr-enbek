import type { CSSProperties, ReactElement, ReactNode, SVGProps } from 'react';

import { cn } from '@/shared/lib/styles';

export type IconProps = Readonly<SVGProps<SVGSVGElement>>;

export type IconComponent = ((props: IconProps) => ReactElement) & { displayName: string };

type IconDefinition = Readonly<{
  name: string;
  size: number;
  content: ReactNode;
  strokeWidth?: number;
  filled?: boolean;
}>;

export function createIcon({ name, size, content, strokeWidth = 1, filled = false }: IconDefinition): IconComponent {
  function Icon({ className, style, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={`0 0 ${String(size)} ${String(size)}`}
        fill="none"
        stroke={filled ? 'none' : 'currentColor'}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className={cn('ui-icon', className)}
        style={{ '--icon-stroke': strokeWidth, ...style } as CSSProperties}
        {...props}
      >
        {content}
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}
