import { Button, TableCell, TableRow } from "@mui/material";
import { Contract } from "near-api-js";
import React, { useRef } from "react";
import { BtnStyle } from "../../my-eacs/components/EacsTableCell";

const MarketDataCell = ({ data, keyWord }) => {
  return (
    <TableRow>
      {data &&
        Object.values(data).map((i, idx) => {
          return <TableCell key={idx}>{i}</TableCell>;
        })}
    </TableRow>
  );
};

export default MarketDataCell;
