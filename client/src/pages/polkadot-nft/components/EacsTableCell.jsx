import {
  Box,
  Button,
  Collapse,
  IconButton,
  TableRow,
  TableCell,
  Grid,
} from "@mui/material";
import React, { useEffect } from "react";
import ArrowIcon from "../assets/arrow-icon.svg";
import SolarImg from "../assets/solar-station.svg";
import WindImg from "../assets/wind-station.svg";
import ThermoImg from "../assets/thermo-station.svg";
import GaseousImg from "../assets/gaseous-station.svg";
import LiquidImg from "../assets/liquid-station.svg";
import HydroImg from "../../dashboard/components/assets/hydroStationImg.svg";

import { TableCellStyle } from "../PolkadotNFT";
import useIpfs from "../../../hooks/useIpfs.hook";
import CellsModalSection from "./CellsModalSection";
import EacModalSection from "./EacModalSection";
import CustomizedReadInput from "../../../components/inputs/CustomizedReadInput";
import { Contract } from "near-api-js";
import { useLocation } from "react-router-dom";

const mapStations = {
  Solar: SolarImg,
  Wind: WindImg,
  Thermo: ThermoImg,
  Hydro: HydroImg,
  Gaseous: GaseousImg,
  Liquid: LiquidImg,
};

const deviceData = [
  "Device owner",
  "Certificate ID",
  "Certified",
  "Facility name",
  "Certified Energy (MWh)",
  "Generation Start Date",
  "Device Type",
  "Certified by registry",
  "Generation Date",
  "Generation End Date",
];

export const BtnStyle = {
  backgroundColor: "#14D9C1",
  borderRadius: "4px",
  fontSize: "12px",
  maxWidth: "60px",
  maxHeight: "30px",
  width: "100%",
  height: "100%",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#0FCCCE",
  },
};

const DotStyle = {
  height: "8px",
  width: "8px",
  backgroundColor: "#14D9C1",
  borderRadius: "50%",
  display: "inline-block",
};

const EacsTableCell = ({ data, idx }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isModalOpenEac, setIsModalOpenEac] = React.useState(false);
  const [isExchange, setIsExchange] = React.useState();
  const [isExchangeEac, setIsExchangeEac] = React.useState();
  const stationData = {
    "current": [
        {
            "name": "WertherStation",
            "organisationRegistryNumber": "456123",
            "stationEnergyType": "Solar",
            "plantPerformance": "30",
            "governmentAid": "UA",
            "investmentAid": "100",
            "exploitationStart": "2021-10-02T23:00:00.000Z",
            "manufactureDate": "2021-10-01T23:00:00.000Z",
            "countryId": 232,
            "regionId": 14,
            "manufacturerCountryId": 232
        }
    ]
  }
  const { client } = useIpfs();
  const status = data.Status?.token_id ? true : false
  const onsale = data.OnSale?.token_id ? true : false
  console.log(data)

  return (
    <>
      <TableRow>
        <TableCell>{data["Storage Key"].slice(0,10)}...{data["Storage Key"].slice(-10)}</TableCell>
        <TableCell>{data["Owner Addr"].slice(0,10)}...</TableCell>
        <TableCell>{data["Power Mw"]}</TableCell>
        <TableCell>{data["Price"]}</TableCell>
        <TableCell>{data["Start Date"]}</TableCell>
        <TableCell>{data["End Date"]}</TableCell>
        <TableCell>{ status ? `ID ${data.Status?.token_id}` : 'NoEAC'}</TableCell>
        <TableCell>
          { !status && <Button onClick={() => setIsModalOpenEac(true)} sx={BtnStyle}>
            + EAC
          </Button>}
          { status && !onsale && <Button onClick={() => setIsModalOpen(true)} sx={BtnStyle}>
            + Sale
          </Button>}
        </TableCell>
      </TableRow>
      { status && <CellsModalSection
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsExchange={setIsExchange}
        data={{
          Facility: "Polkadot",
          "Storage Key": data["Storage Key"],
          accountId: data.Status.owner_id,
          "Power Mw": data["Power Mw"],
          Price: data["Price"],
          id: data.Status.token_id,
        }}
      /> }
      <EacModalSection
        isModalOpen={isModalOpenEac}
        setIsModalOpen={setIsModalOpenEac}
        setIsExchange={setIsExchangeEac}
        data={{
          "Storage Key": data["Storage Key"],
          "Owner Addr": data["Owner Addr"],
          "Start Date": data["Start Date"],
          "End Date": data["End Date"],
          "Power Mw": +data["Power Mw"],
          "Price": +data["Price"],
          stationData,
          client
        }}
      />
    </>
  );
};

export default EacsTableCell;
