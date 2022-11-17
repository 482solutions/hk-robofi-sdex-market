import { Box, Grid } from "@mui/material";
import React from "react";
import CustomizedTable from "../../../components/table/CustomizedTable";
import TitleText from "../../../components/texts/TitleText";
import TokensMarketDataCell from "./TokensMarketDataCell";

const SecondBoxStyle = {
  // maxWidth: "605px",
  width: "100%",
  height: "100%",
  backgroundColor: "#fff",
  padding: "20px 40px 20px",
};

const TableContainerStyle = {
  "> div": {
    padding: "15px 0px 0px",
    boxShadow: "unset",
    "thead > tr": {
      backgroundColor: "#fff",
    },
  },
};

const TokensDataSection = ({ bodyData }) => {
  const sort = false;
  return (
    <Box sx={SecondBoxStyle}>
      <TitleText title={'Tokens'} />
      <Grid sx={TableContainerStyle}>
        <CustomizedTable
          headData={["Platform", "Name", "ID", "Country", "Year", 'Type', 'Amount', "Action"]}
          bodyData={bodyData}
          paginationChunkSize={3}
          renderCell={(el, idx) => {
            return <TokensMarketDataCell data={el} key={idx} cellCount={7} />;
          }}
          sort={sort}
        />
      </Grid>
    </Box>
  );
};

export default TokensDataSection;
