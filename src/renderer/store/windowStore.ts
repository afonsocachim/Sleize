import createStore from "zustand";

type WindowStore = {
  windowHeight: number;
  windowWidth: number;
};

const initialWindowStore: WindowStore = {
  windowHeight: window.innerWidth,
  windowWidth: window.innerHeight,
};

export const windowStore = createStore<WindowStore>(() => initialWindowStore);

export const resetWindowStore = () => windowStore.setState(initialWindowStore);
