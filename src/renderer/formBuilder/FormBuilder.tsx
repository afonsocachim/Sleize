import { cloneDeep } from "lodash";
import React from "react";
import { RxJsonSchema } from "rxdb";

const validInputArray: ValidInput[] = [
  "checkbox",
  "color",
  "date",
  "datetime-local",
  "email",
  "file",
  "number",
  "text",
  "time",
  "url",
  "week",
];

type ValidInput =
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "number"
  | "text"
  | "time"
  | "url"
  | "week";

type FieldType = [ValidInput, string][];

type FieldComponentProps = {
  inputType: ValidInput;
  setInputType: (t: ValidInput) => void;
  value: string;
  setValue: (s: string) => void;
};

const FieldComponent = ({
  inputType,
  setInputType,
  value,
  setValue,
}: FieldComponentProps) => {
  return (
    <div>
      <label htmlFor="cars">
        Choose a car:
        <select
          name="cars"
          id="cars"
          onChange={(e) => setInputType(e.target.value as ValidInput)}
        >
          {validInputArray.map((n) => (
            <option value={n}>{n}</option>
          ))}
        </select>
      </label>
      <input
        type={inputType}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      ;
    </div>
  );
};

export const FormBuilder = () => {
  const [fields, setFields] = React.useState<FieldType>([]);
  const [title, setTitle] = React.useState("");
  const setInputType = (inputType: ValidInput, i: number) => {
    const clonedFields = cloneDeep(fields);
    clonedFields[i][0] = inputType;
    setFields(clonedFields);
  };
  const setValue = (value: string, i: number) => {
    const clonedFields = cloneDeep(fields);
    clonedFields[i][1] = value;
    setFields(clonedFields);
  };
  const addField = () => {
    setFields([...fields, ["text", ""]]);
  };

  return (
    <div className="text-3xl font-bold underline">
      <label htmlFor="Title">
        Title
        <input
          id="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      {fields.map(([inputType, value], i) => (
        <FieldComponent
          inputType={inputType}
          value={value}
          setInputType={(t) => setInputType(t, i)}
          setValue={(v) => setValue(v, i)}
        />
      ))}
      <button type="button" onClick={addField}>
        +
      </button>
    </div>
  );
};

const createSchema = () => {
  const flashcardSchema: RxJsonSchema<any> = {
    type: "object",
    primaryKey: "id",
    properties: {
      interval: { type: "number" },
      repetition: { type: "number" },
      efactor: { type: "number" },
      id: { type: "string" },
      owner: { type: "string" },
      dueDate: { type: "string" },
      clozeNumber: { type: "number" },
      nodeId: { type: "string" },
      noteId: { type: "string" },
    },
    version: 0,
    indexes: ["id"],
    required: [],
  };
};
