import React, { FC } from "react";
import { Fab, FabProps } from "@mui/material";
import { useForm } from "./Form";
import { isEmpty } from "lodash";
import { styled } from "@mui/material/styles";

interface Props {
  children: string;
  float?: "right" | "left";
}

const FloatingFab = styled(Fab, {
  shouldForwardProp: (prop) => prop !== "float",
})<{ float?: "right" | "left" }>(({ float }) => ({
  float: float || "none",
}));

const SubmitButton: FC<Props & FabProps> = ({
  float,
  children,
  onClick,
  ...rest
}) => {
  const { errors } = useForm();
  return (
    <FloatingFab
      color="primary"
      variant="extended"
      type="button"
      disabled={!isEmpty(errors)}
      float={float}
      onClick={onClick}
      {...rest}
    >
      {children}
    </FloatingFab>
  );
};

export default SubmitButton;
