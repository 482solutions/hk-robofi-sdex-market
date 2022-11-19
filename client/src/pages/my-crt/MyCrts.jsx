import { Box, Grid, Link } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import {
  getCRTs,
} from "../../api/api.service";
import CustomizedTable from "../../components/table/CustomizedTable";
import RegularText from "../../components/texts/RegularText";
import TitleText from "../../components/texts/TitleText";
import CrtsTableCell from "./components/CrtsTableCell";
import { allCountries } from "country-region-data";

const BoxStyle = {
  padding: "0 56px",
  paddingTop: "43px",
  display: "flex",
  flexDirection: "column",
  gap: "49px",
};

export const TableCellStyle = {
  fontWeight: 400,
  fontSize: "14px",
  color: "#3F4246",
};

const MyCrts = () => {
  const [body, setBody] = useState();

  useEffect(() => {
    let mounted = true;
    (async function () {
      const res = await getCRTs(window.accountId);
      console.log('test', res)
      if (res && !res.kind) {
        mounted &&
          setBody(
            res.map((i) => {
              let link = <Link href={`https://polygonscan.com/tx/${i.metadata.externalHash}`} target="_blank">{i.metadata.platform}</Link>
              return {
                "Platform": i.metadata.platform,
                "Mint time": new Date(i.metadata.mintTime * 1000),
                "Quantity": `${i.metadata.amount} TCO2`,
                "External link": link,
                "Owner": i.owner_id,
                "Certificate ID": i.token_id,
                "Symbol": i.metadata.symbol,
                "Project name": i.metadata.projectName,
                "Region": i.metadata.region,
                "Year": i.metadata.year,
                "Start time": new Date(i.metadata.startTime * 1000),
                "End time": new Date(i.metadata.endTime * 1000),
                "Price": 100,
                "address": i.metadata.address,
                "retireStatus": i.retireStatus,
              };
            })
          );
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box sx={BoxStyle}>
      <Grid>
        <TitleText title={"CRTs"} />
        <RegularText content={"Manage your CRTs"} />
      </Grid>
      <CustomizedTable
        headData={[
          "Platform",
          "Info",
          "Mint time",
          "Quantity",
          "External link",
          "Action",
        ]}
        bodyData={body}
        renderCell={(el, idx) => (
          <CrtsTableCell data={el} idx={idx} key={idx} />
        )}
      />
    </Box>
  );
};

export default MyCrts;
