import { Box, Grid } from "@mui/material";
import React from "react";
import CustomizedTable from "../../../components/table/CustomizedTable";
import RegularText from "../../../components/texts/RegularText";
import TitleText from "../../../components/texts/TitleText";
import MarketDataCell from "./MarketDataCell";

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

const TokensDataSection = ({ matchingData, data, bodyData }) => {
  const sort = false;
  return (
    <Box sx={SecondBoxStyle}>
      <TitleText title={'Tokens'} />
      {/* <RegularText
        content={`${bodyData ? bodyData.length : 0}/${matchingData} matching`}
      /> */}
      <Grid sx={TableContainerStyle}>
        <CustomizedTable
          headData={["ID", "Country", "Year", 'Type', 'Amount', "Action"]}
          bodyData={bodyData}
          paginationChunkSize={3}
          renderCell={(el, idx) => {
            return <MarketDataCell data={el} key={idx} keyWord={'Tokens'} />;
          }}
          sort={sort}
        />
      </Grid>
    </Box>
  );
};

export default TokensDataSection;
