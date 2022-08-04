import { Button, Grid, Box } from "@mui/material";
import { Contract, transactions } from "near-api-js";

import React, { useState } from "react";
import CreateButton from "../../../components/buttons/CreateButton";
import SecondaryButton from "../../../components/buttons/SecondaryButton";
import CustomizedReadInput from "../../../components/inputs/CustomizedReadInput";
import CustomizedModal from "../../../components/modal/CustomizedModal";
import CustomizedSelect from "../../../components/select/CustomizedSelect";
import TitleText from "../../../components/texts/TitleText";
import {
  createMeasurment,
  createNFT,
  createOrganisation,
  createStation,
  getMeasurments,
  getNFTs,
  getStation,
} from "../../../api/api.service";

const inputNames = ["Storage Key", "Owner Addr", "Start Date", "End Date", "Power Mw", "Stations"];

const EacModalSection = ({
  data,
  isModalOpen,
  setIsModalOpen,
  setIsExchange,
}) => {
  const [value, setValue] = useState("No");
  const [disabled, setDisabled] = useState(false);
  const payload = {
    EAC: {
      owner: window.walletConnection.getAccountId(),
      metadata: {
        title: "test",
        extra: JSON.stringify({
          startDate: new Date(data["Start Date"]),
          endDate: new Date(data["End Date"]),
          generatedEnergy: +data["Power Mw"],
          station: "WertherStation",
          organisation: localStorage.organisation,
          storage_key: data["Storage Key"],
          owner_addr: data["Owner Addr"],
          price_pvse: +data["Price"],
        }),
      },
    },
  };

  const handleSubmit = async (payload, ownerId, station) => {
    const finded = data.stationData.current.find((i) => i.name === station);
    if (finded) {
      payload.EAC.metadata.extra = JSON.stringify({
        startDate: new Date(data["Start Date"]),
        endDate: new Date(data["End Date"]),
        generatedEnergy: +data["Power Mw"],
        station: station,
        organisation: localStorage.organisation,
        location: finded.countryId,
        deviceType: finded.stationEnergyType,
        storage_key: data["Storage Key"],
        owner_addr: data["Owner Addr"],
        price_pvse: +data["Price"],
      });
    }
    const res = await getNFTs(window.accountId);
    console.log(res)
    const deviceInfo = res.map((i) => {
      const parsed = JSON.parse(i.metadata.extra);
      return { ...i, metadata: { ...i.metadata, extra: parsed } };
    });
    const filteredNFT = deviceInfo.filter((i) => {
      return i.metadata.extra.station === data["Stations"];
    });

    if (filteredNFT.length) {
      const isOverlap = filteredNFT.some((i) => {
        return (
          moment(data["Start date of creation"]).isBetween(
            i.metadata.extra.startDate.split("T")[0],
            i.metadata.extra.endDate.split("T")[0],
            null,
            []
          ) ||
          moment(data["End date of creation"]).isBetween(
            i.metadata.extra.startDate.split("T")[0],
            i.metadata.extra.endDate.split("T")[0],
            null,
            []
          ) ||
          moment(i.metadata.extra.startDate.split("T")[0]).isBetween(
            data["Start date of creation"],
            data["End date of creation"],
            null,
            []
          ) ||
          moment(i.metadata.extra.endDate.split("T")[0]).isBetween(
            data["Start date of creation"],
            data["End date of creation"],
            null,
            []
          )
        );
      });
      if (isOverlap) {
        setInfoType({
          type: "error",
          msg: "Dates are overalaped with already created EAC with this station",
        });
        handleClose();
        setInfoModalIsOpen(true);
        setLoading(false);
        return;
      }
    }
    console.log(payload.EAC)
    try {
        const res = await createNFT(
          payload["EAC"],
          data.client
        );
        if (res) {
          console.log("success")
          window.location.reload(false);
        }
      } catch (e) {
        let message = `Something went wrong during creation EAC`;
        if (e.data?.statusCode === 422) {
          message = `EAC with the name ${payload['EAC'].name} is already exist`;
        }
        console.log(message)
      }
  };

  return (
    <CustomizedModal
      open={isModalOpen}
      handleClose={() => setIsModalOpen(false)}
    >
      <TitleText title={`Create New EAC`} />
      <Grid container flexDirection={"column"} gap="19px">
        {inputNames.map((i, idx) => {
          if (i === "Stations") {
            return (
              <CustomizedSelect
                options={[{ value: "WertherStation", label: "WertherStation" }]}
                value={value}
                variant="standard"
                labelName={i}
                key={idx}
                fullWidth
                handleChange={(e) => {
                  setValue(e.target.value);
                }}
              />
            );
          }
          return (
            <Grid key={idx}>
              <CustomizedReadInput
                defaultValue={data[i]}
                disabled
                labelName={i}
              />
            </Grid>
          );
        })}
      </Grid>
      <Grid
        container
        sx={{ height: "36px", marginTop: "48px" }}
        justifyContent={"center"}
        gap="10px"
      >
        <SecondaryButton
          text={"Cancel"}
          onClick={() => setIsModalOpen(false)}
        />
        <Box
          sx={{
            maxWidth: "181px",
            height: "100%",
            button: { fontSize: "14px" },
          }}
        >
          <CreateButton
            text="Create EAC"
            onClick={() => handleSubmit(payload, window.walletConnection.getAccountId(), value)}
            disabled={disabled}
          />
        </Box>
      </Grid>
    </CustomizedModal>
  );
};

export default EacModalSection;
