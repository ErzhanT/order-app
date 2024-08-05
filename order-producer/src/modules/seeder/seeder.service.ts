import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Seed } from './entities/seed.entity';

enum SEED {
  'INITIAL' = 'initial',
}
const SEED_NAME = Object.freeze<{ [key in SEED]: string }>({
  [SEED.INITIAL]: 'initial seed',
});

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Seed) private seedRepository: Repository<Seed>,
    private readonly entityManager: EntityManager,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    await Promise.all([this[SEED.INITIAL]()]);
  }

  private async [SEED.INITIAL]() {
    const isDone = await this.seedRepository.findOne({
      where: { name: SEED_NAME[SEED.INITIAL] },
    });
    if (isDone) return;

    await this.entityManager.transaction(async (manager) => {
      const users: Partial<User>[] = [
        { id: uuidv4(), name: 'John Doe' },
        { id: uuidv4(), name: 'Jane Doe' },
      ];
      const products: Partial<Product>[] = [
        { id: uuidv4(), name: 'Product 1', price: 10 },
        { id: uuidv4(), name: 'Product 2', price: 20 },
      ];

      const savedUsers = await manager.save(User, users);
      const savedProducts = await manager.save(Product, products);
      const completeSeed = await manager.save(Seed, {
        name: SEED_NAME[SEED.INITIAL],
      });

      await Promise.all([savedUsers, savedProducts, completeSeed]);
    });
  }
}
