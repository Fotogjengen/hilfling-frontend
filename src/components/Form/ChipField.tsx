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
import { WithStyles, createStyles, withStyles } from "@mui/styles";
import { FormFieldProps } from "./types";
import { useForm } from "./Form";

const styles = () =>
  createStyles({
    helperText: {
      color: "red",
    },
    chips: {
      marginBottom: "1rem",
    },
  });

const ChipField: FC<FormFieldProps<InputProps> & WithStyles<typeof styles>> = ({
  name,
  label,
  fullWidth,
  classes,
  ...rest
}) => {
  const { values, errors, onChange } = useForm();
  const [interimValue, setInterimValue] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);
  const error = touched && errors[name];

  const onChangeInterimValue = (event: ChangeEvent) => {
    setInterimValue((event.target as HTMLTextAreaElement).value);
  };

  const addChip = (event: KeyboardEvent) => {
    if (
      event.key == "Enter" &&
      !values[name].includes(interimValue.trim()) &&
      interimValue.trim() !== ""
    ) {
      onChange(name, [interimValue.trim(), ...values[name]]);
      setInterimValue("");
    } else if (interimValue.trim() === "") {
      setInterimValue("");
    }
  };

  const handleDelete = (chipToDelete: string) => {
    onChange(
      name,
      values[name].filter((chip: string) => chip !== chipToDelete),
    );
  };

  const chipRenderer: ReactElement[] = values[name].map(
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
      <div className={classes.chips}>{values[name] && chipRenderer}</div>
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
        <FormHelperText className={classes.helperText}>{error}</FormHelperText>
      </FormControl>
    </Fragment>
  );
};

export default withStyles(styles)(ChipField);
