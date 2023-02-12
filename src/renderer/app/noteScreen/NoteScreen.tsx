import { sourceStore } from "renderer/store/sourceStore";
import { noteStore } from "renderer/store/noteStore";
import { svgStore } from "renderer/store/svgStore";
import { SvgEditor } from "renderer/svgEditor/SvgEditor";
import { SplitScreen } from "./SplitScreen";
import { SlateFullScreen } from "./SlateFullScreen";
import { SourceScreen } from "./SourceScreen";

export const NoteScreen = () => {
  const note = noteStore((s) => s.note);
  const source = sourceStore((s) => s.source);
  const svgSrc = svgStore((s) => s.svgSrc);

  if (svgSrc) return <SvgEditor svgSrc={svgSrc} />;
  if (note && !source) return <SlateFullScreen />;
  if (note && source) return <SplitScreen source={source} />;
  if (!note && source) return <SourceScreen source={source} />;

  throw Error("Should not render with no source and no screen");
};
