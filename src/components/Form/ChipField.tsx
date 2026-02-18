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
  InputProps,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormFieldProps } from "./types";
import { useForm } from "./Form";

const ChipsWrapper = styled("div")({
  marginBottom: "1rem",
});

const ErrorText = styled(FormHelperText)({
  color: "red",
});

const ChipField: FC<FormFieldProps<InputProps>> = ({
  name,
  label,
  fullWidth,
  ...rest
}) => {
  const { values, errors, onChange } = useForm();
  const [interimValue, setInterimValue] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);

  const error = touched && errors[name];

  const onChangeInterimValue = (event: ChangeEvent<HTMLInputElement>) => {
    setInterimValue(event.target.value);
  };

  const addChip = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key == "Enter" &&
      !values[name].includes(interimValue.trim()) &&
      interimValue.trim() !== ""
    ) {
      onChange(name, [interimValue.trim(), ...values[name]]);
      setInterimValue("");
    }
  };

  const handleDelete = (chipToDelete: string) => {
    onChange(
      name,
      values[name].filter((chip: string) => chip !== chipToDelete),
    );
  };

  const chipRenderer: ReactElement[] = values[name]?.map(
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
      <ChipsWrapper>{chipRenderer}</ChipsWrapper>
      <FormControl fullWidth={fullWidth}>
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <Input
          {...rest}
          onChange={onChangeInterimValue}
          name={name}
          onKeyDown={addChip}
          value={interimValue}
          onBlur={() => setTouched(true)}
        />
        <ErrorText>{error}</ErrorText>
      </FormControl>
    </Fragment>
  );
};

export default ChipField;
