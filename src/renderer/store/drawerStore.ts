import createStore from "zustand";

type DrawerStore = {
  isDrawerOpen: boolean;
};
export const drawerWidth = 300;

const initialDrawerStore: DrawerStore = {
  isDrawerOpen: true,
};

export const drawerStore = createStore<DrawerStore>(() => initialDrawerStore);

export const closeDrawer = () => {
  drawerStore.setState({ isDrawerOpen: false });
};

export const openDrawer = () => {
  drawerStore.setState({ isDrawerOpen: true });
};

export const resetDrawerStore = () => drawerStore.setState(initialDrawerStore);
