import ReactPlayer from "react-player";
import createStore from "zustand";

type VideoStore = {
  currentTime: number;
  currentPlayer: null | ReactPlayer;
  playing: boolean;
};

const initialVideoStore: VideoStore = {
  currentTime: 0,
  currentPlayer: null,
  playing: true,
};

export const videoStore = createStore<VideoStore>(() => initialVideoStore);

export const resetVideoStore = () => videoStore.setState(initialVideoStore);
