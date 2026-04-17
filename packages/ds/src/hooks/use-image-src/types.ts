export type TImageSource = 'law' | 'finance' | 'geek' | 'standard';
export type TImage = 'brand' | 'standard' | 'notfound';

export type TUseImageSrcProps = {
  type: TImage;
  source?: TImageSource;
  nameQueryUrl?: string;
}