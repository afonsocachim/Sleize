import React from "react";
import { styled } from "@mui/system";
import { Grid, List, Typography } from "@mui/material";
import { FileSource } from "main/database/schemas/sourceSchema";
import { userStore } from "renderer/store/userStore";
import { sourceStore } from "renderer/store/sourceStore";
import { OnlineArticleBtn } from "renderer/app/noteDrawer/drawerFooter/OnlineArticleBtn";
import { OnlineVideoBtn } from "renderer/app/noteDrawer/drawerFooter/OnlineVideoBtn";
import { AddPdfBtn } from "renderer/app/noteDrawer/drawerFooter/AddPdfBtn";
import { AddVideoBtn } from "renderer/app/noteDrawer/drawerFooter/AddVideoBtn";
import { SourceItem } from "./SourceItem";

const MyTypography = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(80vw - 100px);
`;

const MySpan = styled("span")`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100px;
`;

const MyDiv = styled("div")(`
  height: 100%;
  & ul {
    height: 100%;
  }
  overflow: scroll;
  ::-webkit-scrollbar {
    width: 14px;
  }

  ::-webkit-scrollbar-thumb {
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: #aaaaaa;
  }
  ::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0);
  }
`);

const CleanInput = styled("input")`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 4px;
  width: calc(80vw - 100px);
  max-width: calc(80vw - 100px);
  height: calc(50px);
  max-height: calc(50px);
  &:focus {
    outline: none;
  }
  border: 0px;

  font-weight: 400;
  font-size: 1.5rem;
  line-height: 1.3;
  letter-spacing: -0.01562em;
`;

const headingText = `Looks like you deleted the reference. Choose a new one :)`;

export const SourceNotFoundContent = () => {
  const [searchString, setSearchString] = React.useState("");
  const userSourceList = userStore((s) => s.userSourceList);
  const nodeToChangeSource = sourceStore((s) => s.nodeToChangeSource);
  const [sourcesFilteredByType, setSourcesFilteredByType] = React.useState<
    FileSource[]
  >([]);
  const [filteredSources, setFilteredSources] = React.useState<FileSource[]>(
    []
  );
  if (!nodeToChangeSource) throw Error("No nodeToChangeSource1");
  React.useEffect(() => {
    const { element } = nodeToChangeSource;
    const filtered = userSourceList.filter(
      (s) => element.source?.type === s.type
    ) as FileSource[];
    setSourcesFilteredByType(filtered);
  }, [userSourceList, nodeToChangeSource]);

  React.useEffect(() => {
    const lower = searchString.toLowerCase();
    const filtered = sourcesFilteredByType.filter((s) =>
      s.name.toLowerCase().includes(lower)
    );
    setFilteredSources(filtered);
  }, [searchString, sourcesFilteredByType]);

  const Icon = () => {
    const { source } = nodeToChangeSource.element;
    if (!source) throw Error("No source in node");
    if (source.type === "ONLINE_ARTICLE") return <OnlineArticleBtn />;
    if (source.type === "ONLINE_VIDEO") return <OnlineVideoBtn />;
    if (source.type === "LOCAL_PDF") return <AddPdfBtn />;
    if (source.type === "LOCAL_VIDEO") return <AddVideoBtn />;
    throw Error("Unexpected source type");
  };

  return (
    <div style={{ height: "100%" }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <CleanInput
          placeholder="Search ..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <Icon />
      </Grid>
      <List style={{ height: "calc(100% - 80px)" }}>
        <MyDiv>
          {filteredSources.map((s) => (
            <SourceItem source={s} />
          ))}
        </MyDiv>
      </List>
      <Grid container alignItems="flex-end" justifyContent="space-between">
        <MyTypography variant="h2">
          <MySpan>{headingText}</MySpan>
        </MyTypography>
      </Grid>
    </div>
  );
};
