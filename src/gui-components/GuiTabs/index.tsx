import React, { FC, useState } from "react";
import { DefaultProps, EventType } from "../../types";
import GuiTab from "../GuiTab";

interface Props extends DefaultProps {
  /** Primary button styling */
  type?: EventType;
  /** Called when a button is clicked */
  onClick?: () => void;
  /** Not clickable button */
  disabled?: boolean;
  /** Is it a submit button? */
  submit?: boolean;
  /** Which tab is active? */
  activeTab: string;
}

const GuiTabs: FC<Props> = ({ activeTab = "isfit" }: Props) => {
  const [current, setCurrent] = useState<string>(activeTab);
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <GuiTab
        onClick={setCurrent}
        type={"samfundet"}
        active={current == "samfundet"}
      >
        SAMFUNDET
      </GuiTab>
      <GuiTab onClick={setCurrent} type={"uka"} active={current == "uka"}>
        UKA
      </GuiTab>
      <GuiTab onClick={setCurrent} type={"isfit"} active={current == "isfit"}>
        ISFIT
      </GuiTab>
      <GuiTab onClick={setCurrent} type={"annet"} active={current == "annet"}>
        ANNET
      </GuiTab>
    </div>
  );
};

export default GuiTabs;
