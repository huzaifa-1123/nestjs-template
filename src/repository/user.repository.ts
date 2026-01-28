import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import * as schema from '../database/schema';
import { DATABASE_CONNECTION } from 'src/common/config/constant';
import type { Database } from '../database/database.module';

type UserInsert = typeof schema.users.$inferInsert;
type UserSelect = typeof schema.users.$inferSelect;

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}
  async create(user: UserInsert): Promise<UserSelect> {
    const [newUser] = await this.db.insert(schema.users).values(user).returning();

    return newUser;
  }

  async findAll(): Promise<UserSelect[]> {
    return this.db.select().from(schema.users);
  }

  async findById(id: string | number): Promise<UserSelect | null> {
    if (typeof id === 'string') {
      id = parseInt(id);
    }
    const [user] = await this.db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);

    return user ?? null;
  }

  async findByEmail(email: string): Promise<UserSelect | null> {
    const [user] = await this.db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);

    return user ?? null;
  }

  async update(id: string | number, user: Partial<UserInsert>): Promise<UserSelect | null> {
    if (typeof id === 'string') {
      id = parseInt(id);
    }
    const [updatedUser] = await this.db.update(schema.users).set(user).where(eq(schema.users.id, id)).returning();

    return updatedUser ?? null;
  }

  async delete(id: string | number): Promise<UserSelect | null> {
    if (typeof id === 'string') {
      id = parseInt(id);
    }
    const [deletedUser] = await this.db.delete(schema.users).where(eq(schema.users.id, id)).returning();

    return deletedUser ?? null;
  }
}
