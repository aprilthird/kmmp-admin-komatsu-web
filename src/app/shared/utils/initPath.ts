export function initPath(): string {
  const permissions = JSON.parse(localStorage.getItem("permissions"));
  let firstURL = "admin";
  if (permissions) {
    firstURL = Object.keys(permissions)[0] || "admin";
  }
  return firstURL;
}

export function initPathToRedirect(): string {
  const permissions = JSON.parse(localStorage.getItem("permissions"));
  let firstURL = "signed-in-redirect";
  if (permissions) {
    firstURL = Object.keys(permissions)[0] || "signed-in-redirect";
  }
  return firstURL;
}
