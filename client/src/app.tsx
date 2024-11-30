import { Header } from "@/components/layout/header.tsx";
import { CreateNoteForm } from "@/components/notes/create-note-form.tsx";

export default function App() {
  return (
    <>
      <Header />
      <div class="container-xl p-3">
        <CreateNoteForm />
      </div>
    </>
  );
}
