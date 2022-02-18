import { Grid, Button } from "@mui/material";
import { connect, Contract, WalletConnection } from "near-api-js";
import { formatNearAmount } from "near-api-js/lib/utils/format";
import React, { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import {
  getNFTById,
  getNFTs,
  getStation,
  getStationByOrgAndStationName,
} from "../../api/api.service";
import { BtnStyle } from "../my-eacs/components/EacsTableCell";
import DataSection from "./components/DataSection";
import FormSection from "./components/FormSection";

const MainWrapperStyle = {
  padding: " 36px 53px",
  width: "100%",
  minHeight: "inherit",
};

const SectionData = [
  {
    title: "Asks",
    matchingData: "3/3",
    data: ["Type", "MWh", "Price", "Buy directly"],
  },
  {
    title: "Bids",
    matchingData: "0/3",
    data: ["Price", "MWh", "Type"],
  },
];

const EnergyMarket = () => {
  const [asks, setAsks] = useState();
  const [bids, setBids] = useState();
  const [form, setForm] = useState({});
  const immutableData = useRef([]);

  const handleFormChange = useCallback(
    (e, labelName) => {
      if (labelName === "Location") {
        debugger;
        if (
          !e.target.value.length &&
          (!form["Device type"] || !form["Device type"].length)
        ) {
          setAsks(immutableData.current);
        } else if (!e.target.value.length && form["Device type"]) {
          const filtered = immutableData.current.filter((i) =>
            form["Device type"].includes(i.metadata["Device Type"])
          );
          setAsks(filtered);
        } else {
          const filtered = immutableData.current.filter((i) =>
            e.target.value.includes(i.metadata.Location)
          );
          setAsks(filtered);
        }
      }
      if (labelName === "Device type") {
        if (
          !e.target.value.length &&
          (!form["Location"] || !form["Location"].length)
        ) {
          setAsks(immutableData.current);
        } else if (!e.target.value.length && !form["Location"]) {
          const filtered = immutableData.current.filter((i) =>
            form["Location"].includes(i.metadata.Location)
          );
          setAsks(filtered);
        } else {
          const filtered = immutableData.current.filter((i) =>
            e.target.value.includes(i.metadata["Device Type"])
          );
          setAsks(filtered);
        }
      }
      setForm((prev) => ({ ...prev, [labelName]: e.target.value }));
    },
    [immutableData, form]
  );

  useEffect(() => {
    console.log(form);
  }, [form]);

  useEffect(() => {
    (async () => {
      const config = {
        networkId: "testnet",
        keyStore: {}, // optional if not signing transactions
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
      const near = await connect(config);
      const wallet = new WalletConnection(near);
      const contract = await new Contract(
        wallet.account(),
        `market.${process.env.REACT_APP_NFT_DEV_ACCOUNT_ID}`,
        {
          viewMethods: [
            "get_supply_bids",
            "get_bids",
            "get_asks",
            "get_asks_by_owner_id",
          ],
          changeMethods: [],
        }
      );
      const resAsks = await contract["get_asks"]({ from: 0, limit: 100 });
      const resBids = await contract["get_bids"]({ from: 0, limit: 100 });

      const nftContract = await new Contract(
        wallet.account(),
        `${process.env.REACT_APP_NFT_DEV_ACCOUNT_ID}`,
        {
          viewMethods: ["nft_token"],
          changeMethods: [],
        }
      );

      let NFTs = [];
      for await (let i of resAsks) {
        const resNFT = await nftContract["nft_token"]({
          token_id: i.ask.token_id,
        });
        if (resNFT) {
          NFTs.push({ ...resNFT, sale_conditions: i.ask.sale_conditions });
        }
      }
      console.log(resAsks, resBids, NFTs);
      const deviceInfo = NFTs.map((i) => {
        const parsed = JSON.parse(i.metadata.extra);
        return { ...i, metadata: { ...i.metadata, extra: parsed } };
      });
      const askPayload = deviceInfo.map((i) => {
        return {
          metadata: {
            id: i.token_id,
            MWh: i.metadata.extra.generatedEnergy,
            "Device Type": i.metadata.extra.deviceType,
            Location: i.metadata.extra.location,
          },
          view: {
            type: i.metadata.extra.deviceType ?? "N/A",
            MWh: i.metadata.extra.generatedEnergy ?? "N/A",
            price: formatNearAmount(
              i.sale_conditions.toLocaleString("fullwide", {
                useGrouping: false,
              })
            ),
            btn: (
              <Button
                sx={BtnStyle}
                disabled={!window.walletConnection.isSignedIn()}
                onClick={() =>
                  handlePurchase(
                    i.token_id,
                    i.sale_conditions.toLocaleString("fullwide", {
                      useGrouping: false,
                    })
                  )
                }
              >
                Buy
              </Button>
            ),
          },
        };
      });

      immutableData.current = askPayload;

      setAsks(askPayload);
      setBids(
        resBids.map((i) => {
          return {
            metadata: { id: i.id },
            view: {
              price: formatNearAmount(
                i.bid.sale_conditions.toLocaleString("fullwide", {
                  useGrouping: false,
                })
              ),
              MWh: "N/A",
              type: "N/A",
            },
          };
        })
      );
    })();
  }, []);

  async function handlePurchase(tokenId, deposit) {
    const contract = await new Contract(
      window.walletConnection.account(),
      `market.${process.env.REACT_APP_NFT_DEV_ACCOUNT_ID}`,
      {
        viewMethods: [],
        changeMethods: ["direct_ask_sell"],
      }
    );
    await contract["direct_ask_sell"](
      {
        id: tokenId,
      },
      undefined,
      deposit
    );
  }
  // const getAsksFromContract = useCallback(async () => {
  //   const contract = await new Contract(
  //     window.walletConnection.account(),
  //     `market.${process.env.REACT_APP_NFT_DEV_ACCOUNT_ID}`,
  //     {
  //       viewMethods: [
  //         "get_supply_bids",
  //         "get_bids",
  //         "get_asks",
  //         "get_asks_by_owner_id",
  //       ],
  //       changeMethods: ["direct_ask_sell"],
  //     }
  //   );
  //   const resAsks = await contract["get_asks"]({ from: 0, limit: 100 });
  //   const resBids = await contract["get_bids"]({ from: 0, limit: 100 });

  //   const a = resAsks.map((i) => {
  //     return {
  //       metadata: {
  //         id: i.id,
  //       },
  //       view: {
  //         type: "N/A",
  //         MWh: "N/A",
  //         price: formatNearAmount(
  //           i.ask.sale_conditions.toLocaleString("fullwide", {
  //             useGrouping: false,
  //           })
  //         ),
  //         btn: (
  //           <Button
  //             sx={BtnStyle}
  //             onClick={() =>
  //               handlePurchase(
  //                 i.id,
  //                 i.ask.sale_conditions.toLocaleString("fullwide", {
  //                   useGrouping: false,
  //                 })
  //               )
  //             }
  //           >
  //             Buy
  //           </Button>
  //         ),
  //       },
  //     };
  //   });
  //   (async () => {
  //     const res = await getNFTs();
  //     if (res) {
  //       const deviceInfo = res.map((i) => {
  //         const parsed = JSON.parse(i.metadata.extra);
  //         return { ...i, metadata: { ...i.metadata, extra: parsed } };
  //       });

  //       console.log(deviceInfo);

  //       let result = [];
  //       for await (let data of deviceInfo) {
  //         if (data.metadata.extra.organisation && data.metadata.extra.station) {
  //           const station = await getStation();
  //           try {
  //             const resStation = await getStationByOrgAndStationName(
  //               data.metadata.extra.organisation,
  //               data.metadata.extra.station
  //             );
  //             result.push({ ...data, stationInfo: resStation });
  //           } catch (e) {
  //             console.log(e);
  //           }
  //         }
  //       }

  //       debugger;

  //       const transRes = result.map((i) => ({
  //         id: i.token_id,
  //         "Device Type": i.stationInfo.stationEnergyType,
  //         Location: i.stationInfo.countryId,
  //       }));

  //       const newArr = a
  //         .map((i) => {
  //           const idx = transRes.findIndex((el) => el.id === i.metadata.id);
  //           if (idx !== -1) {
  //             return {
  //               ...i,
  //               metadata: transRes[idx],
  //             };
  //           }
  //         })
  //         .filter((i) => i);

  //       setAsks(newArr);
  //       immutableData.current = newArr;
  //     }
  //   })();
  //   setBids(
  //     resBids.map((i) => {
  //       return {
  //         metadata: { id: i.id },
  //         view: {
  //           price: formatNearAmount(
  //             i.bid.sale_conditions.toLocaleString("fullwide", {
  //               useGrouping: false,
  //             })
  //           ),
  //           MWh: "N/A",
  //           type: "N/A",
  //         },
  //       };
  //     })
  //   );
  // }, []);

  // useEffect(() => {
  //   if (
  //     window.walletConnection.isSignedIn() &&
  //     document.cookie.includes("userId")
  //   ) {
  //     getAsksFromContract();
  //   }
  // }, [getAsksFromContract]);

  const placeBid = async () => {
    if (!form["Energy*"] || !form["Price*"]) return;
    const contract = await new Contract(
      window.walletConnection.account(),
      `market.${process.env.REACT_APP_NFT_DEV_ACCOUNT_ID}`,
      {
        viewMethods: [],
        changeMethods: ["place_bid"],
      }
    );
    await contract["place_bid"](
      {
        amount: form["Energy*"],
        conditions: `${form["Price*"]}000000000000000000000003`,
      },
      "300000000000000",
      `${form["Price*"]}000000000000000000000003`
    );
  };

  return (
    <Grid container sx={MainWrapperStyle} gap="27px" justifyContent={"center"}>
      <FormSection
        asks={asks}
        form={form}
        setForm={setForm}
        placeBid={placeBid}
        handleFormChange={handleFormChange}
      />
      <Grid
        container
        sx={{ width: "100%", height: "100%", maxWidth: "605px" }}
        gap="27px"
        flexDirection={"column"}
      >
        {SectionData.map((el, idx) => {
          return (
            <DataSection
              title={el.title}
              matchingData={el.matchingData}
              data={el.data}
              bodyData={el.title === "Asks" ? asks : bids}
              key={idx}
            />
          );
        })}
      </Grid>
    </Grid>
  );
};

export default EnergyMarket;
