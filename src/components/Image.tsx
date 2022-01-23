import showPreviewImageDialog from './PreviewImageDialog';
import '../less/image.less';
import React from 'react';

interface Props {
  imgUrl: string;
  className?: string;
  alt: string;
  referrerPolicy?: string;
  filepath?: string;
}

const Image: React.FC<Props> = (props: Props) => {
  const {className, imgUrl, alt, referrerPolicy, filepath} = props;

  const handleImageClick = () => {
    if (filepath) {
      showPreviewImageDialog(imgUrl, filepath);
    } else {
      showPreviewImageDialog(imgUrl);
    }
  };

  return (
    <div className={'image-container ' + className} onClick={handleImageClick} referrerPolicy={referrerPolicy}>
      <img src={imgUrl} alt={alt} decoding="async" loading="lazy" />
    </div>
  );
};

export default Image;
