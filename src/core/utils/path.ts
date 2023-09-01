export const joinPath = (...paths: string[]) =>
  paths.length ? paths.join("/") : `/${paths[0]}`;
