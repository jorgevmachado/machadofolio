import { CreateSupplierDto } from './create-supplier.dto';

import { PartialType } from '@nestjs/mapped-types';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
