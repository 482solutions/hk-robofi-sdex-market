import { Box, Grid } from "@mui/material";
import React from "react";
import CustomizedTable from "../../../components/table/CustomizedTable";
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

const ProjectsDataSection = ({ bodyData }) => {
  const sort = false;
  return (
    <Box sx={SecondBoxStyle}>
      <TitleText title={'Projects'} />
      <Grid sx={TableContainerStyle}>
        <CustomizedTable
          headData={["Platform", "Name", "ID", "Country", "Years", 'Methodology', "Action"]}
          bodyData={bodyData}
          paginationChunkSize={3}
          renderCell={(el, idx) => {
            return <MarketDataCell data={el} key={idx} keyWord={'Projects'} />;
          }}
          sort={sort}
        />
      </Grid>
    </Box>
  );
};

export default ProjectsDataSection;
