import {
  Button,
  Collapse,
  IconButton,
  TableRow,
  TableCell,
  Grid,
  Link,
} from "@mui/material";
import React from "react";
import ArrowIcon from "../assets/arrow-icon.svg";
import { TableCellStyle } from "../MyCrts";
import CellsModalSection from "./CellsModalSection";
import CustomizedReadInput from "../../../components/inputs/CustomizedReadInput";

const deviceData = [
  "Owner",
  "Certificate ID",
  "Quantity",
  "Platform",
  "Symbol",
  "Project name",
  "Region",
  "Year",
  "Start time",
  "End time",
  "Mint time",
  // "Price",
];

const retireData = [
  'retirementEntityName',
  // 'beneficiaryAddress',
  'beneficiaryName',
  'retirementMessage',
  'retirementTime'
]
const retireDataLabel = {
  'retirementEntityName': 'Retirement entity name',
  // 'beneficiaryAddress': 'Beneficiary Address',
  'beneficiaryName': 'Beneficiary name',
  'retirementMessage': 'Retirement message',
  'retirementTime': 'Retirement time'
}

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

const CrtsTableCell = ({ data }) => {
  const retireMetadata = data.retireStatus?.retireMetadata;
  const [isOpen, setIsOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
    <>
      <TableRow>
        <TableCell>{data["Platform"]}</TableCell>
        <TableCell>
          <IconButton size="small" onClick={() => setIsOpen((prev) => !prev)}>
            <img
              src={ArrowIcon}
              alt="open-close control"
              style={isOpen ? { transform: "rotate(180deg)" } : undefined}
            />
          </IconButton>
        </TableCell>
        {Object.values(data)
          .slice(1, 4)
          .map((i, index) => {
            return (
              <TableCell key={index} sx={TableCellStyle}>
                {i instanceof Date ? i.toDateString() : i}
              </TableCell>
            );
          })}
        {!data.retireStatus &&
          <TableCell>
            <Button onClick={() => setIsModalOpen(true)} sx={BtnStyle}>
              RETIRE
            </Button>
          </TableCell>}
        {data.retireStatus &&
          <TableCell sx={TableCellStyle}>
            <Link href={`https://polygonscan.com/tx/${data.retireStatus.retireHash}`} target="_blank">Retired</Link>
          </TableCell>
        }
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse
            in={isOpen}
            timeout="auto"
            unmountOnExit
            collapsedSize={"300px 0px"}
            sx={{
              paddingTop: "58px",
              paddingBottom: "32px",
            }}
          >
            <Grid>
              {deviceData.map((i, idx) => {
                return (
                  <Grid
                    sx={{
                      maxWidth: "198px",
                      display: "inline-flex",
                      marginRight: "27px",
                      marginBottom: "41px",
                    }}
                    key={idx}
                  >
                    <CustomizedReadInput
                      labelName={i}
                      disabled
                      defaultValue={
                        data[i] instanceof Date ? data[i].toDateString() : data[i]
                      }
                    />
                  </Grid>
                );
              })}
            </Grid>
            {data.retireStatus && <Grid>
              <Grid sx={{ fontSize: "16px;" }} >Retirement info</Grid>
              {retireData.map((i, idx) => {
                return (
                  <Grid
                    sx={{
                      maxWidth: "198px",
                      display: "inline-flex",
                      marginRight: "27px",
                      marginBottom: "41px",
                    }}
                    key={idx}
                  >
                    <CustomizedReadInput
                      labelName={retireDataLabel[i]}
                      disabled
                      defaultValue={
                        i == 'retirementTime' ? new Date(retireMetadata[i] * 1000).toDateString() : retireMetadata[i]
                      }
                    />
                  </Grid>
                );
              })}
            </Grid>}
          </Collapse>
        </TableCell>
      </TableRow>
      <CellsModalSection
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={data}
      />
    </>
  );
};

export default CrtsTableCell;
