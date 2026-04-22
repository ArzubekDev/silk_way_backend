import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';


@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    const url = config.get<string>('DATABASE_URL');

    const pool = new pg.Pool({
      connectionString: url,
    });

    const adapter = new PrismaPg(pool);

    super({
      adapter,
    });
  }
}


