import { vaultService } from "@/.server/features/vault/vault.service";
import { exceptionUtils } from "@/shared/exceptions/exception.util";
import { json } from "@remix-run/node";

export const loader = async () => {
  try {
    const result = await vaultService.deleteExpiredVaults();
    return json({ message: result });
  } catch (e) {
    const [status, response] = exceptionUtils.getResponse(e as Error);
    return json(response, { status });
  }
};
