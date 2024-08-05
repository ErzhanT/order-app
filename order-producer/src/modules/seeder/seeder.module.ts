import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmConfigService } from 'src/config/typeorm-config.service';
import { SeederService } from './seeder.service';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Seed } from './entities/seed.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Product, Seed]),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
