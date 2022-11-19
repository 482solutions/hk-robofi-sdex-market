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
  padding: "20px 43px 31px",
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

const PlatformsDataSection = ({ matchingData, bodyData }) => {
  const sort = false;
  return (
    <Box sx={SecondBoxStyle}>
      <TitleText title={'Platforms'} />
      <Grid sx={TableContainerStyle}>
        <CustomizedTable
          // headData={["Name", "BCT", "NCT", "Action"]}
          headData={["Name", "BCT", "NCT"]}
          bodyData={bodyData}
          paginationChunkSize={3}
          renderCell={(el, idx) => {
            return <MarketDataCell data={el} key={idx} keyWord={'Platforms'} />;
          }}
          sort={sort}
        />
      </Grid>
    </Box>
  );
};

export default PlatformsDataSection;
