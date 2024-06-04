import { YT } from "youtube";

/// <reference types="vite-plugin-pages/client" />
declare global {
  interface Window {
    YT: YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export {};
