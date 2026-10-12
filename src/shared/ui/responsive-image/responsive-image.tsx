import { getImageProps, type StaticImageData } from 'next/image';

export interface ResponsiveImageSources {
  desktop: StaticImageData;
  mobile: StaticImageData;
}

type ResponsiveImageProps = Readonly<{
  sources: ResponsiveImageSources;
  alt: string;
  desktopSizes: string;
  priority?: boolean;
  className?: string;
}>;

export function ResponsiveImage({ sources, alt, desktopSizes, priority = false, className }: ResponsiveImageProps) {
  const common = { alt, priority };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: sources.desktop, sizes: desktopSizes });
  const {
    props: { srcSet: mobileSrcSet, ...imageProps },
  } = getImageProps({ ...common, src: sources.mobile, sizes: '100vw' });

  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktopSrcSet} sizes={desktopSizes} />
      <img {...imageProps} srcSet={mobileSrcSet} alt={alt} className={className} />
    </picture>
  );
}
