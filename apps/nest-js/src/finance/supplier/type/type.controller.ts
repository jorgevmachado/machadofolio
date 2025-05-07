import { Controller } from '@nestjs/common';
import { SupplierTypeService } from './type.service';

@Controller('type')
export class TypeController {
  constructor(private readonly supplierTypeService: SupplierTypeService) {}
}
