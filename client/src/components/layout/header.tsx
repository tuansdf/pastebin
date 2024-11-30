import { A, useNavigate } from "@solidjs/router";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header class="border-bottom">
      <div class="d-flex justify-content-between align-items-center container-xxl py-2">
        <A href="/" class="text-decoration-none text-light">
          <h1 class="fs-5 fw-semibold m-0">Pastebin</h1>
        </A>
        <button class="btn btn-dark" onClick={() => navigate("/")}>
          New note
        </button>
      </div>
    </header>
  );
};
