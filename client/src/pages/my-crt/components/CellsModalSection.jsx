import { Grid, Box } from "@mui/material";
import React, { useState } from "react";
import CreateButton from "../../../components/buttons/CreateButton";
import SecondaryButton from "../../../components/buttons/SecondaryButton";
import CustomizedReadInput from "../../../components/inputs/CustomizedReadInput";
import CustomizedModal from "../../../components/modal/CustomizedModal";
import TitleText from "../../../components/texts/TitleText";
import {
  retireCRT,
} from "../../../api/api.service";

const CellsModalSection = ({
  data,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [amount, setAmount] = useState(0);
  const [buttonText, setbuttonText] = useState('Retire to offset');
  const [retirementEntityName, setRetirementEntityName] = useState('');
  const [beneficiaryAddress, setBeneficiaryAddress] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [retirementMessage, setRetirementMessage] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data, amount, retirementEntityName, beneficiaryAddress, beneficiaryName, retirementMessage) => {

    setLoading(true)
    const res = await retireCRT(
      {
        retirementEntityName,
        beneficiaryAddress,
        beneficiaryName,
        retirementMessage,
        amount,
        tco2Address: data.address,
        nftCrtId: data['Certificate ID'],
        owner: window.accountId,
      }
    );
    console.log(res)
    if (res.status == 'ok') {
      setLoading(false);
      setDisabled(true);
      setbuttonText('TCO2 retired')
      setTimeout(() => {
        setIsModalOpen(false)
        setDisabled(false);
        setbuttonText('Retire to offset')
      }
      , 3000)
    }
  };

  return (
    <CustomizedModal
      open={isModalOpen}
      handleClose={() => setIsModalOpen(false)}
    >
      <TitleText title={`Retire carbon credits from tokent ${data['Symbol']}`} />
      <Grid container flexDirection={"column"} gap="19px">
        <Grid>
          <CustomizedReadInput
            controlled
            type="text"
            labelName={'Retirement entity name'}
            value={retirementEntityName}
            onChange={(e) => {
              setRetirementEntityName(e.target.value);
            }}
          />
        </Grid>
        {/* <Grid>
          <CustomizedReadInput
            controlled
            type="text"
            labelName={'Beneficiary Address'}
            value={beneficiaryAddress}
            onChange={(e) => {
              setBeneficiaryAddress(e.target.value);
            }}
          />
        </Grid> */}
        <Grid>
          <CustomizedReadInput
            controlled
            type="text"
            labelName={'Beneficiary name'}
            value={beneficiaryName}
            onChange={(e) => {
              setBeneficiaryName(e.target.value);
            }}
          />
        </Grid>
        <Grid>
          <CustomizedReadInput
            controlled
            type="text"
            labelName={'Retirement message'}
            value={retirementMessage}
            onChange={(e) => {
              setRetirementMessage(e.target.value);
            }}
          />
        </Grid>
        <Grid>
          <CustomizedReadInput
            controlled
            type="number"
            labelName={'Amount'}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </Grid>
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
            onClick={() => handleSubmit(data, amount, retirementEntityName, beneficiaryAddress, beneficiaryName, retirementMessage)}
            disabled={disabled}
            loading={loading}
          />
        </Box>
    </Grid>
    </CustomizedModal>
  );
};

export default CellsModalSection;
