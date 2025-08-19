import React, { FC } from "react";
import { GuiCard, GuiCardTitle } from "../../../gui-components";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  description: string;
  link?: string;
}

const CardInformationFotogjengen: FC<Props> = ({
  title,
  description,
  link,
}) => {
  return (
    <div>
      <GuiCard>
        <GuiCardTitle title={title} capitalized={true} />
        <p style={{ whiteSpace: "pre-line" }}>{description}</p>
        {link && (
          <p>
            <Link
              style={{ color: "#ad2f33" }}
              to={link}
              onClick={() => window.scrollTo(0, 0)}
            >
              Les mer her.
            </Link>
          </p>
        )}
      </GuiCard>
    </div>
  );
};

export default CardInformationFotogjengen;
