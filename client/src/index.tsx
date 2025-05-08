/* @refresh reload */
import "@/styles";
import App from "@/app.tsx";
import { AUTH_STORAGE_KEY } from "@/constants/common.constant.ts";
import { generatePassword } from "@/utils/crypto.util.ts";
import { render } from "solid-js/web";

const root = document.getElementById("root");

if (!localStorage.getItem(AUTH_STORAGE_KEY)) {
  localStorage.setItem(AUTH_STORAGE_KEY, generatePassword());
}

render(() => <App />, root!);
