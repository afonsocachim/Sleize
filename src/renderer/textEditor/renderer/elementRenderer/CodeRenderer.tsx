/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable no-eval */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { SlateAttributes } from "main/database/schemas/nodeSchema";
import { createPortal } from "react-dom";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage, langs } from "@uiw/codemirror-extensions-langs";
import { sublime } from "@uiw/codemirror-themes-all";

export const languageLabels = Object.keys(langs)
  .sort()
  .map((n) => ({ label: n, value: n }));

type IframeProps = {
  title: string;
};

const IFrame = ({ title }: IframeProps) => {
  const [text, setText] = React.useState("");
  const [result, setResult] = React.useState("");
  const [language, setLanguage] = React.useState<any>("javascript");
  const changeText = (s: string) => setResult(s);
  const [iframeBody, setIframeBody] = React.useState<HTMLElement | null>(null);
  const handleLoad = (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    setIframeBody(e.currentTarget.contentDocument?.body || null);
  };

  const CodeComponent = (
    <div>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        {languageLabels.map((n) => (
          <option value={n.value} key={n.value}>
            {n.label}
          </option>
        ))}
      </select>
      <style>{`.cm-content {background-color: #303841}`}</style>
      <div style={{ backgroundColor: "black" }}>
        <CodeMirror
          height="75px"
          extensions={[loadLanguage(language) as any, sublime]}
          onChange={(value: string) => {
            setText(value);
          }}
        />
      </div>
      {language === "javascript" && (
        <div>
          <button
            type="button"
            onClick={() => {
              try {
                changeText(JSON.stringify(eval(text)));
              } catch (error) {
                changeText((error as Error).message);
              }
            }}
          >
            Eval
          </button>
          <div>Result: {result}</div>
        </div>
      )}
    </div>
  );

  return (
    <iframe
      title={title}
      srcDoc="<div>"
      onLoad={(e) => handleLoad(e)}
      style={{ border: "none", width: "100%" }}
    >
      {iframeBody && createPortal(CodeComponent, iframeBody)}
    </iframe>
  );
};

export const CodeRenderer = ({
  children,
  attributes,
}: {
  children: React.ReactNode;
  attributes: SlateAttributes;
}) => {
  return (
    <div>
      <IFrame title={attributes.id} />
      <div>{children}</div>
    </div>
  );
};
