import { Button, TableCell, TableRow } from "@mui/material";
import React from "react";
import { BtnStyle } from "../../my-eacs/components/EacsTableCell";
import TokensModalSection from './TokensModalSection';

const TokensMarketDataCell = ({ data, cellCount}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <TableRow>
        {data &&
          Object.values(data).map((i, idx) => {
            if (idx < cellCount) return <TableCell key={idx}>{i}</TableCell>;
          })}
          <TableCell>
            <Button
                  sx={BtnStyle}
                  disabled={false}
                  onClick={() => setIsModalOpen(true)}
            >
              Offset
            </Button>
          </TableCell>
      </TableRow>
      <TokensModalSection
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={data}
      />
    </>
  );
};

export default TokensMarketDataCell;

