import type { UploadExpenseParams } from '@repo/business';

export type UploadListItem = UploadExpenseParams & {
    index: number;
    fileName: string;
}