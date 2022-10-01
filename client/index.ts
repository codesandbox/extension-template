import { extensionHost } from "../packages/extension-client";

document.body.innerHTML = `
<button id="open-package-json">Open Package Json</button>
    <button id="uppercase-name">Make package.json name uppercase</button>
    
`;

document.querySelector("#open-package-json")?.addEventListener("click", () => {
  extensionHost.sendMessage({
    type: "FOCUS_FILE",
    path: "package.json",
  });
});

document.querySelector("#uppercase-name")?.addEventListener("click", () => {
  fetch("/uppercase-name");
});
