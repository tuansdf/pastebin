import { db } from "@/db/db.js";
import { VaultTable } from "@/db/entities/vault.entity.js";
import { VaultCreate } from "@/modules/vaults/vault.type.js";
import { count, eq, lte } from "drizzle-orm";

class VaultRepository {
  public countByPublicId = async (publicId: string) => {
    const result = await db.select({ value: count() }).from(VaultTable).where(eq(VaultTable.publicId, publicId));
    return result?.[0]?.value || 0;
  };

  public existsByPublicId = async (publicId: string) => {
    const result = await this.countByPublicId(publicId);
    return result > 0;
  };

  public deleteById = async (id: number) => {
    await db.delete(VaultTable).where(eq(VaultTable.id, id));
  };

  public deleteByPublicId = async (id: string) => {
    await db.delete(VaultTable).where(eq(VaultTable.publicId, id));
  };

  public findTopByPublicId = async (publicId: string) => {
    const result = await db.select().from(VaultTable).where(eq(VaultTable.publicId, publicId)).limit(1);
    return result?.[0];
  };

  public deleteAllExpiresAtBefore = async (date: number) => {
    await db.delete(VaultTable).where(lte(VaultTable.expiresAt, date));
  };

  public create = async (data: VaultCreate): Promise<{ publicId: string | null } | undefined> => {
    const result = await db.insert(VaultTable).values(data).returning({ publicId: VaultTable.publicId });
    return result?.[0];
  };
}

export const vaultRepository = new VaultRepository();
