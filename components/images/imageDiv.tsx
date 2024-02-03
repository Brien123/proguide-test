import React from "react";

import Image, { StaticImageData } from 'next/image';

type imgprops = {
  url: string | StaticImageData,
  classes: string
  h ?: number
  w ?: number
}
const MyImage = ({url, classes, h, w}:imgprops) => {
  return (
    <Image
      src={url}
      alt="Picture of the author"
      className={classes}
      height={h}
      width={w}
     
     
  />
  );
}

export default MyImage;