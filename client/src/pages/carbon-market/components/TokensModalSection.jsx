import { Button, Grid, Box, ownerDocument } from "@mui/material";
import { Contract, transactions } from "near-api-js";

import React, { useState } from "react";
import CreateButton from "../../../components/buttons/CreateButton";
import SecondaryButton from "../../../components/buttons/SecondaryButton";
import CustomizedReadInput from "../../../components/inputs/CustomizedReadInput";
import CustomizedModal from "../../../components/modal/CustomizedModal";
import CustomizedSelect from "../../../components/select/CustomizedSelect";
import TitleText from "../../../components/texts/TitleText";
import {
  createCRT,
} from "../../../api/api.service";

const inputNames = ["symbol", "region", "year", "type", "amount"];
const labelName = { "symbol": "Symbol", "region": "Region", "year": "Rear", "type": "Type", "amount": "Max amount" };

const TokensModalSection = ({
  data,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [value, setValue] = useState("No");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonText, setbuttonText] = useState('Offset');

  const handleSubmit = async (data, value) => {
    setLoading(true)
    const res = await createCRT(
      {
        tco2: data,
        amount: value,
        owner: window.accountId,
      }
    );
    if (res.status == 'ok') {
      setLoading(false);
      setDisabled(true);
      setbuttonText('TCO2 created')
      setTimeout(() => {
        setIsModalOpen(false)
        setDisabled(false);
        setbuttonText('Offset')
      }
      , 3000)
    }
  };

  return (
    <CustomizedModal
      open={isModalOpen}
      handleClose={() => setIsModalOpen(false)}
    >
      <TitleText title={`Offset CO2`} />
      <Grid container flexDirection={"column"} gap="19px">
        {inputNames.map((i, idx) => {
          return (
            <Grid key={idx}>
              <CustomizedReadInput
                defaultValue={data[i]}
                disabled
                labelName={labelName[i]}
              />
            </Grid>
          );
        })}
        <CustomizedReadInput
          controlled
          type="number"
          labelName={'Amount'}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
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
            text={buttonText}
            onClick={() => handleSubmit(data, value)}
            disabled={disabled}
            loading={loading}
          />
        </Box>
      </Grid>
    </CustomizedModal>
  );
};

export default TokensModalSection;
