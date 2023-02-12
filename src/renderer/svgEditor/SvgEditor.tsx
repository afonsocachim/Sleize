import React from "react";
import { cloneDeep } from "lodash";
import { v4 } from "uuid";
import {
  IconButton,
  Grid,
  ToggleButton,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { styled } from "@mui/system";
import { SlateImage } from "main/database/schemas/nodeSchema";
import { OpenDrawerBtn } from "renderer/app/layout/OpenDrawerBtn";
import { drawerStore, drawerWidth } from "renderer/store/drawerStore";
import { svgStore, resetSvgStore } from "renderer/store/svgStore";
import { lightTheme } from "renderer/styles/lightTheme";
import { slateStore } from "renderer/store/slateStore";
import { noteStore } from "renderer/store/noteStore";
import { slateUpdate } from "renderer/store/slateUtils/slateOnChange";
import { RenderShape } from "./RenderShape";
import {
  Tools,
  SvgObject,
  ShapeMoveId,
  DragStart,
  CardSelected,
} from "./types";

export const CleanInput = styled("input")`
  &:focus {
    outline: none;
  }
  border: 0px;
`;

const toolArray: Array<Tools> = ["Rectangle", "Circle", "Select"];

const initialWidthAndHeight = {
  width: 0,
  height: 0,
};

const leftColumnWidth = 200;

export const SvgEditor = ({ svgSrc }: { svgSrc: string }) => {
  // store
  const isDrawerOpen = drawerStore((s) => s.isDrawerOpen);
  const initialSvgObjects = svgStore((s) => s.initialSvgObjects);
  const slateImage = svgStore((s) => s.slateImage);
  // ref
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  // state
  const [tool, setTool] = React.useState<Tools>();
  const [svgObjects, setSvgObjects] = React.useState<SvgObject[]>([]);
  const [shapeMoveId, setShapeMoveId] = React.useState<ShapeMoveId>();
  const [dragStart, setDragStart] = React.useState<DragStart>();
  const [cardNumber, setCardNumber] = React.useState(1);
  const [widthAndHeight, setWidthAndHeight] = React.useState(
    initialWidthAndHeight
  );
  const [cardSelected, setCardSelected] = React.useState<CardSelected>();
  const [newSvgObject, setNewSvgObject] = React.useState<
    SvgObject | undefined
  >();
  const [zoom, setZoom] = React.useState(1);

  const mainContainerWidth = isDrawerOpen
    ? window.innerWidth - leftColumnWidth - drawerWidth - 40
    : window.innerWidth - leftColumnWidth - 40;

  React.useEffect(() => {
    setSvgObjects(initialSvgObjects);
  }, [initialSvgObjects]);

  React.useEffect(() => {
    if (!cardSelected) return;
    setCardNumber(cardSelected.obj.cardNumber);
  }, [cardSelected]);

  const handleSaveBtn = async () => {
    const { value } = slateStore.getState();
    if (!value) throw Error("No value");
    const cloneValue = cloneDeep(value);
    const { note } = noteStore.getState();
    if (!note) throw Error("no note");
    if (!slateImage) throw Error("No slate image");
    const elIndex = cloneValue.findIndex((n) => n.id === slateImage.id);
    const oldElement = cloneValue[elIndex] as SlateImage;
    const newEl: SlateImage = {
      ...oldElement,
      image: { ...oldElement.image, svgObjects },
    };
    cloneValue[elIndex] = newEl;
    slateUpdate(cloneValue, note);
    resetSvgStore();
  };

  const getCoords = ({
    clientX,
    clientY,
  }: {
    clientX: number;
    clientY: number;
  }) => {
    if (!svgRef.current) return;
    const { top, left } = svgRef.current.getBoundingClientRect();
    return { x: clientX - left, y: clientY - top };
  };

  const handleMouseDownObj = (obj: SvgObject, e: React.MouseEvent) => {
    if (tool === "Select") {
      setShapeMoveId(obj.id);
      setDragStart({
        x: e.clientX / zoom,
        y: e.clientY / zoom,
      });
    }
  };

  const handleMouseUpObj = () => {
    setDragStart(undefined);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!e.defaultPrevented) {
      setCardSelected(undefined);
    }
    if (tool !== "Rectangle" && tool !== "Circle") return;
    const coords = getCoords(e);
    if (!coords) return;
    const { x, y } = coords;
    const xStart = x / zoom;
    const yStart = y / zoom;

    const obj: SvgObject = {
      id: v4(),
      shape: tool === "Rectangle" ? "Rectangle" : "Circle",
      xStart,
      yStart,
      xEnd: xStart,
      yEnd: yStart,
      cardNumber,
    };
    setNewSvgObject(obj);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (newSvgObject) {
      const coords = getCoords(e);
      if (!coords) return;
      const { x, y } = coords;
      const xEnd = x / zoom;
      const yEnd = y / zoom;
      const obj = {
        ...newSvgObject,
        xEnd,
        yEnd,
      };
      setNewSvgObject(obj);
    }

    if (shapeMoveId && dragStart) {
      const moveObjIndex = svgObjects.findIndex((o) => o.id === shapeMoveId);
      const moveObj = svgObjects[moveObjIndex];
      if (!moveObj) throw Error("no moveObj");
      const { x: xDragStart, y: yDragStart } = dragStart;
      const { clientX, clientY } = e;
      const xDragEnd = clientX / zoom;
      const yDragEnd = clientY / zoom;
      const xDelta = xDragEnd - xDragStart;
      const yDelta = yDragEnd - yDragStart;
      const newObj = {
        ...moveObj,
        xStart: moveObj.xStart + xDelta,
        xEnd: moveObj.xEnd + xDelta,
        yStart: moveObj.yStart + yDelta,
        yEnd: moveObj.yEnd + yDelta,
      };
      const clonedObjects = [...svgObjects];
      clonedObjects[moveObjIndex] = newObj;
      setDragStart({
        x: xDragEnd,
        y: yDragEnd,
      });

      setSvgObjects(clonedObjects);
    }
  };

  const handleMouseUp = () => {
    if (newSvgObject) {
      const obj = newSvgObject;
      const width = Math.abs(obj.xStart - obj.xEnd) / zoom;
      const height = Math.abs(obj.yStart - obj.yEnd) / zoom;
      setNewSvgObject(undefined);
      if (width > 28 && height > 20) {
        setSvgObjects([...svgObjects, obj]);
      }
    }
    if (shapeMoveId && dragStart) {
      setDragStart(undefined);
      setShapeMoveId(undefined);
    }
  };

  const editCardNumber = () => {
    if (!cardSelected) return;
    const svgObjectsList = [...svgObjects];
    const oldObj = svgObjectsList[cardSelected.position];
    const newObj = { ...oldObj, cardNumber };
    svgObjectsList[cardSelected.position] = newObj;
    setCardNumber(1);
    setSvgObjects(svgObjectsList);
    setCardSelected(undefined);
  };

  const mySetCardSelected = (c: CardSelected) => {
    if (tool === "Select") setCardSelected(c);
  };
  React.useEffect(() => {
    const i = new Image();

    i.onload = () => {
      const ratio = i.height / i.width;
      const width = i.width > mainContainerWidth ? mainContainerWidth : i.width;
      const finalHeight =
        width * ratio > window.innerHeight ? window.innerHeight : width * ratio;
      const finalWidth = finalHeight / ratio;
      const newZoom = finalWidth / i.width;
      setWidthAndHeight({ width: i.width, height: i.height });
      setZoom(newZoom);
    };

    i.src = svgSrc;
  }, [mainContainerWidth, svgSrc]);

  React.useEffect(() => {
    const { width, height } = widthAndHeight;
    if (!width || !height) return;
    const prevWidth = width * zoom;
    const newWidth =
      prevWidth > mainContainerWidth ? mainContainerWidth : prevWidth;
    const newHeight = (newWidth * height) / width;
    const finalHeight =
      newHeight > window.innerHeight ? window.innerHeight : newHeight;
    const newZoom = finalHeight / height;
    setZoom(newZoom);
  }, [isDrawerOpen, mainContainerWidth, widthAndHeight, zoom]);

  const handleRemove = () => {
    if (!cardSelected) return;
    const preSlice = svgObjects.slice(0, cardSelected.position);
    const postSlice = svgObjects.slice(cardSelected.position + 1);
    const newObjectsList = [...preSlice, ...postSlice];
    setCardSelected(undefined);
    setSvgObjects(newObjectsList);
  };

  const handleZoomChange = (n: number) => {
    if (!imageRef.current) return;
    const newZoom = zoom + n;
    const { width, height } = widthAndHeight;
    const newWidth = width * newZoom;
    const newHeight = height * newZoom;
    if (newWidth > mainContainerWidth) return;
    if (newHeight > window.innerHeight) return;
    if (newHeight < 200 || newWidth < 200) return;
    imageRef.current.width = newWidth;
    imageRef.current.height = newHeight;
    setZoom(newZoom);
  };

  return (
    <Grid
      style={{
        height: "100vh",
        backgroundColor: "lightGray",
      }}
      container
      direction="row"
      alignItems="stretch"
    >
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        item
        style={{
          width: leftColumnWidth,
          maxWidth: leftColumnWidth,
          overflow: "hidden",
          backgroundColor: "white",
          height: "100vh",
        }}
      >
        <Grid container style={{ padding: 8 }}>
          <OpenDrawerBtn />
        </Grid>
        <Grid container direction="column">
          <Grid container justifyContent="center">
            <IconButton onClick={() => handleZoomChange(-0.1)}>
              <ZoomOutIcon />
            </IconButton>
            <IconButton onClick={() => handleZoomChange(0.1)}>
              <ZoomInIcon />
            </IconButton>
          </Grid>
          {toolArray.map((t) => (
            <ToggleButton
              size="small"
              value="check"
              key={t}
              onClick={() => setTool(t)}
              selected={tool === t}
              style={{ margin: 8 }}
            >
              {t}
            </ToggleButton>
          ))}
          <Button
            size="small"
            onClick={handleRemove}
            style={{ margin: 8 }}
            disabled={!cardSelected}
          >
            Remove
          </Button>
          <div style={{ padding: 8 }}>
            <Grid
              container
              style={{
                border: "1px solid rgba(0, 0, 0, 0.12)",
                borderRadius: 4,
                padding: "0px 8px",
              }}
              alignItems="center"
            >
              <Typography>Card:</Typography>
              <CleanInput
                type="number"
                min={1}
                max={99}
                value={cardNumber}
                onChange={(e) => setCardNumber(parseInt(e.target.value, 10))}
                style={{ ...lightTheme.typography.body1 }}
              />
              <IconButton
                size="small"
                onClick={editCardNumber}
                disabled={!cardSelected}
                color="primary"
              >
                <CheckBoxIcon />
              </IconButton>
            </Grid>
          </div>
        </Grid>
        <Grid container justifyContent="space-between">
          <Tooltip title="Cancel">
            <IconButton onClick={resetSvgStore}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save">
            <IconButton onClick={handleSaveBtn}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <div style={{ width: 20 }} />
      <Grid
        item
        justifyContent="center"
        alignItems="center"
        container
        style={{
          height: "100vh",
          width: mainContainerWidth,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative" }}>
          <svg
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            ref={svgRef}
            style={{
              height: widthAndHeight.height * zoom,
              width: widthAndHeight.width * zoom,
              position: "absolute",
              left: 0,
              top: 0,
            }}
          >
            {svgObjects.map((o, index) => (
              <RenderShape
                key={o.id}
                obj={o}
                handleMouseDownObj={handleMouseDownObj}
                handleMouseUpObj={handleMouseUpObj}
                arrayPosition={index}
                cardSelected={cardSelected}
                setCardSelected={mySetCardSelected}
                zoom={zoom}
              />
            ))}
            {newSvgObject && (
              <RenderShape
                obj={newSvgObject}
                handleMouseDownObj={handleMouseDownObj}
                handleMouseUpObj={handleMouseUpObj}
                arrayPosition={-1}
                cardSelected={cardSelected}
                setCardSelected={mySetCardSelected}
                zoom={zoom}
              />
            )}
          </svg>
          <img
            ref={imageRef}
            src={svgSrc}
            alt=""
            style={{
              height: widthAndHeight.height * zoom,
              width: widthAndHeight.width * zoom,
              border: "1px solid gray",
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
};
