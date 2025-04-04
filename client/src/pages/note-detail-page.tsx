import { Header } from "@/components/layout/header.tsx";
import { NoteDetail } from "@/components/notes/note-detail.tsx";

export function NoteDetailPage() {
  return (
    <>
      <Header />
      <div class="container-xxl p-3">
        <NoteDetail />
      </div>
    </>
  );
}
