import React from "react";
import { Icon } from "@iconify/react";
import { Grid, Typography } from "@mui/material";

const SimpleCard = ({
  data,
  handleClick,
  selectedCategory,
  isEdit = false,
}) => {
  const isSelected = selectedCategory === data.name;
  return (
    <Grid
      onClick={() => handleClick(data?.name)}
      style={{
        padding: "10px",
        borderRadius: "8px",
        width: "100px",
        height: "100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: !isSelected
          ? "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
          : "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px inset, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px inset",
        transition: "box-shadow .2s ease-out",
        cursor: isEdit
          ? data.name === selectedCategory
            ? "pointer"
            : "not-allowed"
          : "pointer",
      }}
      className="card"
    >
      <Icon
        icon={data?.icon}
        width={"40px"}
        height={"40px"}
        style={{ color: data?.color }}
      />
      <Typography>{data?.name}</Typography>
    </Grid>
  );
};

export default SimpleCard;
