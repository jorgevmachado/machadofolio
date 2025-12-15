import type { UploadExpenseParams } from '@repo/business';
import type { ReplaceWordParam } from '@repo/services';

export type Form = {
  paid: boolean;
  file: string;
  month: string;
  fileName: string;
  replaceWords: Array<ReplaceWordParam>;
  repeatedWords: Array<string>;
}


export type UploadListItem = UploadExpenseParams & {
  index: number;
  fileName: string;
}