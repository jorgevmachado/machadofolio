import { IsString } from 'class-validator';

import { ReplaceWordParam } from '@repo/services';

export class ReplaceWordItemDTO implements ReplaceWordParam {
  @IsString()
  after!: string;

  @IsString()
  before!: string;
}