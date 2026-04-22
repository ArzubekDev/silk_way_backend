import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<any> {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

async findSearch(query: string) {
  if (!query?.trim()) return [];

  return this.prisma.$queryRaw`
    SELECT *,
      similarity(name, ${query}) as score
    FROM "Product"
    WHERE name ILIKE '%' || ${query} || '%'
       OR tags ILIKE '%' || ${query} || '%'
    ORDER BY score DESC
  `;
}

  async update(id: number, updateProductDto: UpdateProductDto): Promise<any> {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number): Promise<any> {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}

