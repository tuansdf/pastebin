import { A } from "@solidjs/router";
import { Show } from "solid-js";

type Props = {
  onNewNote?: () => void;
};

export const Header = (props: Props) => {
  return (
    <header class="border-bottom">
      <div class="d-flex justify-content-between align-items-center container-xxl py-0" style={{ height: "3rem" }}>
        <A href="/" class="text-decoration-none text-light" onClick={props.onNewNote}>
          <h1 class="fs-5 fw-semibold m-0">Pastebin</h1>
        </A>
        <Show when={props.onNewNote}>
          <button class="btn btn-dark" onClick={props.onNewNote}>
            New note
          </button>
        </Show>
      </div>
    </header>
  );
};
