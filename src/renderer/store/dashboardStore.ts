import createStore from "zustand";

type DashboardStore = {
  showTutorial: boolean;
};

const iStore: DashboardStore = { showTutorial: false };

export const dashboardStore = createStore<DashboardStore>(() => iStore);

export const resetDashboardStore = () => dashboardStore.setState(iStore);
