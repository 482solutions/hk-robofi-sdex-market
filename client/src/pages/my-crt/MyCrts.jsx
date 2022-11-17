import { Box, Grid } from "@mui/material";
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

//   [
//     {
//         "metadata": {
//             "platform": "ToucanProtocol",
//             "projectName": "50 MW Sipansihaporas Hydro Power Plant, North Sumatra",
//             "symbol": "TCO2-VCS-191-2009",
//             "region": "China",
//             "year": "2009",
//             "type": "BCT",
//             "address": "0xccacc6099debd9654c6814fcb800431ef7549b10",
//             "startTime": "1230768000",
//             "endTime": "1262217600",
//             "externalHash": "0x5c108e72079e948304d5867956201ae3bd71be075023b7eb0e8f5b047b2ac18d",
//             "externalHash": 1668695128
//         },
//         "approved_account_ids": {}
//     }
// ]

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
              return {
                "Source": i.metadata.platform,
                "Issuance date": i.metadata.mintTime,
                "Quantity": `${i.metadata.amount} t/CO2e`,
                "Price": 100,
                "Device owner": i.owner_id,
                "Certificate ID": i.token_id,
                "Certified": `${i.metadata.amount} t/CO2e`,
                "Platform": i.metadata.platform,
                "Symbol": i.metadata.symbol,
                "Project name": i.metadata.projectName,
                "Region": i.metadata.region,
                "Year": i.metadata.year,
                "Start time": i.metadata.startTime,
                "End time": i.metadata.endTime,
                "External link": i.metadata.externalHash,
                "Mint time": i.metadata.mintTime,
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
          "Source",
          "Info",
          "Issuance date",
          "Quantity",
          "Price",
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
