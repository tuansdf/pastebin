import { NotFound } from "@/client/components/shared/not-found";
import { NoteDetail } from "@/client/components/notes/note-detail";
import { vaultService } from "@/.server/vault.service";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const vaultId = String(params.id);
  const guestPassword = Array.from(url.searchParams.keys())[0] || "";
  return json(await vaultService.getTopByPublicId(vaultId, guestPassword));
};

export default function Page() {
  const item = useLoaderData<typeof loader>();

  return <>{!!item ? <NoteDetail item={item} /> : <NotFound />}</>;
}
