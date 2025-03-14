"use client";

import React from "react";
import Image from "next/image";

interface SvgImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
}

const SvgImage: React.FC<SvgImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      fill={fill}
    />
  );
};

export default SvgImage;
