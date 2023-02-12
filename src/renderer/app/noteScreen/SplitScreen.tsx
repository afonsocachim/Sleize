import { Source } from "main/database/schemas/sourceSchema";
import SplitPane from "react-split-pane";
import { pdfToolbarStore } from "renderer/pdfViewer/pdfToolbarStore";
import { slateStore } from "renderer/store/slateStore";
import { SlateFullScreen } from "./SlateFullScreen";
import { SplitSourceScreen } from "./SplitSourceScreen";

export const SplitScreen = ({ source }: { source: Source }) => {
  return (
    <div style={{ minWidth: 801 }}>
      <SplitPane
        split="vertical"
        onChange={(newSize) => {
          const splitSize = newSize as unknown as string[];
          const n0 = parseInt(splitSize[0], 10);
          const n1 = parseInt(splitSize[1], 10);
          slateStore.setState({ mainWrapperRatio: n0 / (n0 + n1) });
          pdfToolbarStore.setState({ containerWidth: n1 * 0.01 });
        }}
      >
        <SplitPane minSize="400px" defaultSize="50%">
          <SlateFullScreen />
        </SplitPane>
        <SplitPane minSize="400px" defaultSize="50%">
          <SplitSourceScreen source={source} />
        </SplitPane>
      </SplitPane>
    </div>
  );
};
