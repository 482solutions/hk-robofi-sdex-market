import { Box, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import {
  getPolkadotToken,
  getNFTs,
  getOrganisations,
  getStation,
  getStationByOrgAndStationName,
} from "../../api/api.service";
import CustomizedTable from "../../components/table/CustomizedTable";
import RegularText from "../../components/texts/RegularText";
import TitleText from "../../components/texts/TitleText";
import EacsTableCell from "./components/EacsTableCell";
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

const bodyData = [
  {
    "Device Type": "Hydro",
    Date: "01/02/2022",
    "Grid Operator": "Germany",
    MWh: "400",
    Status: "Exchange",
  },
  {
    "Device Type": "Thermo",
    Date: "01/02/2022",
    "Grid Operator": "Germany",
    MWh: "400",
    Status: "Exchange",
  },
  {
    "Device Type": "Wind",
    Date: "01/02/2022",
    "Grid Operator": "Germany",
    MWh: "400",
    Status: "Exchange",
  },
  {
    "Device Type": "Solar",
    Date: "01/02/2022",
    "Grid Operator": "Germany",
    MWh: "400",
    Status: "Archivated",
  },
];

const PolkadotNFT = () => {
  const [body, setBody] = useState();
  const sort = false
  
  useEffect(() => {
    let mounted = true;
    (async function () {
      const res = await getNFTs(window.accountId)
      console.log('getNFTs', res)

      const deviceInfo = await getPolkadotToken()
      console.log('getPolkadotToken', deviceInfo)

      let filteredPolkadotEac = {}
      if (res && !res.kind) {
        const resEAC = res.map((i) => {
          const parsed = JSON.parse(i.metadata.extra);
          return { ...i, metadata: { ...i.metadata, extra: parsed } };
        });
        console.log('getNFTs - parse', resEAC)
        filteredPolkadotEac = resEAC.filter((i) =>(i.metadata.extra.hasOwnProperty('storage_key')))
      }
      console.log('getNFTs - filtered', filteredPolkadotEac)

      if (deviceInfo && !deviceInfo.kind) {
        mounted &&
          setBody(
            deviceInfo.map((i) => {
              return {
                "Storage Key": i.storage_key,
                "Owner Addr": i.metadata.owner_addr,
                "Power Mw": i.metadata.power_mw,
                "Price": i.metadata.price_pvse,
                "Start Date": new Date((i.metadata.creation_start_date - +i.metadata.power_mw * 10 * 24 * 60 * 60) * 1000).toDateString(),
                "End Date": new Date((i.metadata.creation_end_date - +i.metadata.power_mw * 9 * 24 * 60 * 60) * 1000).toDateString(),
                "Status": filteredPolkadotEac.find(y => y.metadata.extra.storage_key == i.storage_key),
                "OnSale": filteredPolkadotEac.find(y => y.metadata.extra.storage_key == i.storage_key && Object.keys(y.approved_account_ids).length)
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
        <TitleText title={"Polkadot NFT"} />
        <RegularText content={"Manage your Polkadot NFT"} />
      </Grid>
      <CustomizedTable
        headData={[
          "Storage Key",
          "Owner Addr",
          "Power Mw",
          "Price",
          "Start Date",
          "End Date",
          "Status",
          "Actions",
        ]}
        bodyData={body}
        renderCell={(el, idx) => (
          <EacsTableCell data={el} idx={idx} key={idx} />
        )}
        sort={sort}
      />
    </Box>
  );
};

export default PolkadotNFT;
