import Image, { type StaticImageData } from 'next/image';

import { Logo } from '@/shared/ui/logo';

import backdropSvg from './brand-backdrop.svg';

const backdrop = backdropSvg as StaticImageData;

export function BrandBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="absolute top-1/2 left-0 aspect-[720/853] w-[max(50%,calc(100dvh*720/853))] -translate-y-1/2"
    >
      <Image src={backdrop} alt="" priority className="absolute inset-y-0 left-0 h-full w-[200%] max-w-none" />
      <div className="absolute top-[23.447%] left-[0.0%] aspect-square w-[56.806%] rounded-full backdrop-blur-xl before:absolute before:inset-0 before:rounded-full before:bg-linear-to-b before:from-surface-card/95 before:to-surface-card/50 before:p-px before:[mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]" />
      <Logo
        variant="hero"
        className="absolute top-[42.028%] left-[10.104%] h-[10.785%] w-[36.528%] text-text-inverse"
      />
    </div>
  );
}
