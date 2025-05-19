import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { transformObjectDateAndNulls } from '@repo/services/object/object';

import BillCategoryConstructor from '@repo/business/finance/bill-category/bill-category';

import { Service } from '../../../shared';

import { BillCategory } from '../../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService extends Service<BillCategory> {
  constructor(
      @InjectRepository(BillCategory)
      protected repository: Repository<BillCategory>,
  ) {
    super('bill_categories', [], repository);
  }

    async create({ name }: CreateCategoryDto) {
        const billCategory = new BillCategoryConstructor({ name });
        return await this.save(billCategory);
    }

    async update(param: string, { name }: UpdateCategoryDto) {
        const result = await this.findOne({ value: param, withDeleted: true });
        const billCategory = new BillCategoryConstructor({ ...result, name });
        return await this.save(billCategory);
    }

    async remove(param: string) {
        const result = await this.findOne({
            value: param,
            relations: ['bills'],
            withDeleted: true,
        }) as BillCategory;

        if (result?.bills?.length) {
            throw this.error(
                new ConflictException(
                    'You cannot delete the bill category because it is already in use.',
                ),
            );
        }
        await this.repository.softRemove(result);
        return { message: 'Successfully removed' };
    }

    async seeds(listJson: Array<unknown>, withReturnSeed: boolean = true) {
        const categoriesSeeds = listJson.map((category) =>
                transformObjectDateAndNulls<BillCategory, unknown>(category)
        )
        return this.seeder.entities({
            by: 'name',
            key: 'all',
            label: 'Bill Category',
            seeds: categoriesSeeds,
            withReturnSeed,
            createdEntityFn: async (item) => item,
        });
    }
}
