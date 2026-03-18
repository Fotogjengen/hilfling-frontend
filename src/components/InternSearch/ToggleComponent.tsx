import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
interface ToggleComponentProps {
  value: string;
  onChange: (nextView: React.MouseEvent<HTMLElement>) => void;
}

const ToggleComponent = ({ value, onChange }: ToggleComponentProps) => {
  return (
    <div>
      <ToggleButtonGroup value={value} exclusive onChange={onChange}>
        <ToggleButton value="Grid" aria-label="Grid">
          <GridViewIcon />
        </ToggleButton>
        <ToggleButton value="List" aria-label="List">
          <ViewListRoundedIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default ToggleComponent;
