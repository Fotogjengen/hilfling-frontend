import React, {
  FC,
  Fragment,
  useState,
  ReactElement,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import {
  Chip,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from "@material-ui/core";
import { FormHelperTextWrapperProps } from "./types";

const ChipField: FC<FormHelperTextWrapperProps<typeof Input>> = ({
  input: { name, onChange, restInput, value },
  meta,
  formControlProps,
  label,
  ...rest
}) => {
  const [chips, setChips] = useState<string[]>(["caro", "schmaro"]);
  const [interimValue, setInterimValue] = useState<string>("");

  const onChangeInterimValue = (event: ChangeEvent) => {
    setInterimValue((event.target as HTMLTextAreaElement).value);
  };

  const addChip = (event: KeyboardEvent) => {
    console.log(value);
    console.log(onChange);
    if (event.key === "Enter" && !chips.includes(value.toString())) {
      setChips([value.toString(), ...chips]);
      setInterimValue("");
    }
  };

  const handleDelete = (chipToDelete: string) => {
    const newChips = chips.filter((chip) => chip !== chipToDelete);
    setChips(newChips);
  };

  const chipRenderer: ReactElement[] = chips.map(
    (chip: string, index: number) => {
      return (
        <Chip
          key={`chip-${index}`}
          label={chip}
          onDelete={() => handleDelete(chip)}
          size="small"
        />
      );
    },
  );

  return (
    <Fragment>
      {chips && chipRenderer}
      <FormControl {...formControlProps}>
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <Input
          {...rest}
          onChange={onChangeInterimValue}
          name={name}
          inputProps={restInput}
          onKeyDown={addChip}
          value={interimValue}
        />
        {meta.error && <FormHelperText>{meta.error}</FormHelperText>}
      </FormControl>
    </Fragment>
  );
};

export default ChipField;
