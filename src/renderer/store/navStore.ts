import createStore from "zustand";
import { NavigateFunction } from "react-router-dom";

type NavStore = {
  nav: NavigateFunction;
};

const initialNavStore: NavStore = { nav: () => {} };

export const navStore = createStore<NavStore>(() => initialNavStore);
