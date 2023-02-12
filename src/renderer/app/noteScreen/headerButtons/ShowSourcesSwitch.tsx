import { Switch, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { noteStore } from "renderer/store/noteStore";
import { slateStore } from "renderer/store/slateStore";
import { editorContainer } from "renderer/store/slateUtils/editorContainer";

export const ShowSourcesSwitch = () => {
  const showSources = noteStore((s) => s.showSources);
  const toggleSwitch = () => {
    if (showSources) {
      noteStore.setState({ showSources: false });
      return;
    }
    const { value } = slateStore.getState();
    if (!value) throw Error("No value");
    let haveSource = false;
    for (let i = 0; i < value.length; i += 1) {
      haveSource = Boolean(value[i].source);
      if (haveSource) break;
    }
    if (!haveSource) {
      toast.warn("Add sources to note first");
      return;
    }
    noteStore.setState({ showSources: true });
  };

  return (
    <Tooltip title={showSources ? "Hide sources" : "Show sources"}>
      <Switch
        checked={showSources}
        onChange={toggleSwitch}
        inputProps={{ "aria-label": "controlled" }}
      />
    </Tooltip>
  );
};
