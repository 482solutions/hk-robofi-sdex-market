import { Grid, Button, Box } from "@mui/material";
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
import PlatformsDataSection from "./components/PlatformsDataSection";
import ProjectsDataSection from "./components/ProjectsDataSection";
import TokensDataSection from "./components/TokensDataSection";
import TitleText from "../../components/texts/TitleText";
import { ToucanClient } from "toucan-sdk";
import { ethers, utils } from "ethers";
import { gql } from "@urql/core";

const BoxStyle = {
  padding: "0 30px",
  paddingTop: "30px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const CarbonMarket = () => {

  const [platforms, setPlatforms] = useState();
  const [projects, setProjects] = useState();
  const [tokens, setTokens] = useState();

  const [form, setForm] = useState({});
  const immutableData = useRef([]);
  const immutableBids = useRef([]);

  // const handleFormChange = useCallback(
  //   (e, labelName) => {
  //     if (labelName === "Location") {
  //       debugger;
  //       if (
  //         !e.target.value.length &&
  //         (!form["Device type"] || !form["Device type"].length)
  //       ) {
  //         setTraders(immutableData.current);
  //         setBids(immutableBids.current);
  //       } else if (!e.target.value.length && form["Device type"]) {
  //         const filtered = immutableData.current.filter((i) =>
  //           form["Device type"].includes(i.metadata["Device Type"])
  //         );
  //         const filteredBid = immutableBids.current.filter(
  //           (i) =>
  //             form["Device type"].some((r) =>
  //               i.metadata["Device Type"].includes(r)
  //             )
  //           // form["Device type"].includes(i.metadata["Device Type"])
  //         );
  //         setTraders(filtered);
  //         setBids(filteredBid);
  //       } else {
  //         const filtered = immutableData.current.filter((i) =>
  //           e.target.value.includes(i.metadata.Location)
  //         );
  //         const filteredBids = immutableBids.current.filter(
  //           (i) =>
  //             e.target.value.some(
  //               (r) =>
  //                 i.metadata["Location"] && i.metadata["Location"].includes(r)
  //             )
  //           // e.target.value.includes(i.metadata.Location)
  //         );
  //         setTraders(filtered);
  //         setBids(filteredBids);
  //       }
  //     }
  //     if (labelName === "Device type") {
  //       if (
  //         !e.target.value.length &&
  //         (!form["Location"] || !form["Location"].length)
  //       ) {
  //         setTraders(immutableData.current);
  //         setBids(immutableBids.current);
  //       } else if (!e.target.value.length && !form["Location"]) {
  //         const filtered = immutableData.current.filter((i) =>
  //           form["Location"].includes(i.metadata.Location)
  //         );
  //         const filteredBids = immutableBids.current.filter(
  //           (i) => form["Location"].some((r) => i.metadata.Location.includes(r))
  //           // form["Location"].includes(i.metadata.Location)
  //         );
  //         setBids(filteredBids);
  //         setTraders(filtered);
  //       } else {
  //         debugger;
  //         const filtered = immutableData.current.filter((i) =>
  //           e.target.value.includes(i.metadata["Device Type"])
  //         );
  //         const filteredBids = immutableBids.current.filter(
  //           (i) =>
  //             e.target.value.some(
  //               (r) =>
  //                 i.metadata["Device Type"] &&
  //                 i.metadata["Device Type"].includes(r)
  //             )

  //           // e.target.value.includes(i.metadata["Device Type"])
  //         );
  //         setBids(filteredBids);

  //         setTraders(filtered);
  //       }
  //     }
  //     setForm((prev) => ({ ...prev, [labelName]: e.target.value }));
  //   },
  //   [immutableData, form]
  // );

  useEffect(() => {
    (async () => {
      const provider = ethers.getDefaultProvider("https://polygon-rpc.com/");
      const toucan = new ToucanClient("polygon", provider);
      const poolAddressBCT = await toucan.getPoolAddress('BCT')
      const poolAddressNCT = await toucan.getPoolAddress('NCT')
      const poolQuery = gql`
                      query ($poolAddress: String, $first: Int, $skip: Int) {
                        pooledTCO2Tokens(
                          where: { poolAddress: $poolAddress }
                          first: $first
                          skip: $skip
                          orderBy: amount
                          orderDirection: desc
                        ) {
                          amount
                          token {
                            symbol
                            address
                            projectVintage {
                              name
                              startTime
                              endTime
                              project {
                                projectId
                                region
                                methodology
                                standard
                              }
                            }
                          }
                        }
                      }
                    `;
      const bctPoolTco2s = await toucan.fetchCustomQuery(poolQuery, {first: 1000, skip: 0, poolAddress: poolAddressBCT });
      const nctPoolTco2s = await toucan.fetchCustomQuery(poolQuery, {first: 1000, skip: 0, poolAddress: poolAddressNCT });
      setPlatforms([
        {
          name: 'ToucanProtocol',
          BCT: bctPoolTco2s.pooledTCO2Tokens.length,
          NCT: nctPoolTco2s.pooledTCO2Tokens.length,
          btn: (
                  <Button
                    sx={BtnStyle}
                    disabled={false}
                    onClick={() => {console.log('Select')}
                    }
                  >
                    Select
                  </Button>
                ),
        },
      ])
      const bctPool = bctPoolTco2s.pooledTCO2Tokens.map(item => {
        return {
              symbol: item.token.symbol,
              region: item.token.projectVintage.project.region??'-----',
              year: item.token.projectVintage.name,
              type: 'BCT',
              amount: parseFloat(utils.formatUnits(item.amount, 18)).toFixed(2),
              btn: (
                <Button
                  sx={BtnStyle}
                  disabled={false}
                  onClick={() => {console.log('Buy')}
                  }
                >
                  Buy
                </Button>
              )
        }
      })
      const nctPool = nctPoolTco2s.pooledTCO2Tokens.map(item => {
        return {
              symbol: item.token.symbol,
              region: item.token.projectVintage.project.region??'-',
              year: item.token.projectVintage.name,
              type: 'NCT',
              amount: parseFloat(utils.formatUnits(item.amount, 18)).toFixed(2),
              btn: (
                <Button
                  sx={BtnStyle}
                  disabled={false}
                  onClick={() => {console.log('Buy')}
                  }
                >
                  Buy
                </Button>
              )
        }
      })
      setTokens([...bctPool, ...nctPool])
      const projectsQuery = gql`
                    query ($first: Int, $skip: Int) {
                      projects(
                        first: $first
                        skip: $skip
                        projectId: $projectId
                      ) {
                        projectId
                        region
                        standard
                        methodology
                        vintages {
                          name
                        }
                      }
                    }
                  `
      const projectsPool = await toucan.fetchCustomQuery(projectsQuery, {first: 1000, skip: 0});
      const projects = projectsPool.projects.map(item => {
        return {
              projectId: item.projectId,
              region: item.region??'-',
              years: item.vintages.map(item => item.name.slice(0,4)).join(),
              methodology: item.methodology,
              btn: (
                <Button
                  sx={BtnStyle}
                  disabled={false}
                  onClick={() => {console.log('Select')}
                  }
                >
                  Select
                </Button>
              )
        }
      })
      setProjects(projects)

    })();
    // (async () => {
    //   const config = {
    //     networkId: "testnet",
    //     keyStore: {}, // optional if not signing transactions
    //     nodeUrl: "https://rpc.testnet.near.org",
    //     walletUrl: "https://wallet.testnet.near.org",
    //     helperUrl: "https://helper.testnet.near.org",
    //     explorerUrl: "https://explorer.testnet.near.org",
    //   };
    //   const near = await connect(config);
    //   const wallet = new WalletConnection(near);
    //   const contract = await new Contract(
    //     wallet.account(),
    //     `market.${process.env.REACT_APP_NFT_DEV_ACCOUNT_ID}`,
    //     {
    //       viewMethods: [
    //         "get_supply_bids",
    //         "get_bids",
    //         "get_asks",
    //         "get_asks_by_owner_id",
    //       ],
    //       changeMethods: [],
    //     }
    //   );
    //   const resAsks = await contract["get_asks"]({ from: 0, limit: 100 });
    //   const resBids = await contract["get_bids"]({ from: 0, limit: 100 });

    //   const nftContract = await new Contract(
    //     wallet.account(),
    //     `${process.env.REACT_APP_NFT_DEV_ACCOUNT_ID}`,
    //     {
    //       viewMethods: ["nft_token"],
    //       changeMethods: [],
    //     }
    //   );

    //   let NFTs = [];
    //   for await (let i of resAsks) {
    //     const resNFT = await nftContract["nft_token"]({
    //       token_id: i.ask.token_id,
    //     });
    //     if (resNFT) {
    //       NFTs.push({
    //         ...resNFT,
    //         sale_conditions: i.ask.sale_conditions,
    //         ask_id: i.id,
    //       });
    //     }
    //   }
    //   const deviceInfo = NFTs.map((i) => {
    //     const parsed = JSON.parse(i.metadata.extra);
    //     return { ...i, metadata: { ...i.metadata, extra: parsed } };
    //   });
    //   const askPayload = deviceInfo.map((i) => {
    //     return {
    //       metadata: {
    //         id: i.token_id,
    //         MWh: i.metadata.extra.generatedEnergy,
    //         "Device Type": i.metadata.extra.deviceType,
    //         Location: i.metadata.extra.location,
    //       },
    //       view: {
    //         type: i.metadata.extra.deviceType ?? "N/A",
    //         MWh: i.metadata.extra.generatedEnergy ?? "N/A",
    //         price: formatNearAmount(
    //           i.sale_conditions.toLocaleString("fullwide", {
    //             useGrouping: false,
    //           })
    //         ),
    //         btn: (
    //           <Button
    //             sx={BtnStyle}
    //             disabled={
    //               !window.walletConnection.isSignedIn() ||
    //               i.owner_id === window.accountId
    //             }
    //             onClick={() =>
    //               handlePurchase(
    //                 i.ask_id,
    //                 i.sale_conditions.toLocaleString("fullwide", {
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

    //   immutableData.current = askPayload;

    //   setTraders(askPayload);

    //   const parsedBids = resBids.map((i) => {
    //     const parsed = i.bid.extra ? JSON.parse(i.bid.extra) : {};
    //     return { ...i, bid: { ...i.bid, extra: parsed } };
    //   });

    //   const bidsPayload = parsedBids.map((i) => {
    //     return {
    //       metadata: {
    //         id: i.id,
    //         "Device Type": i.bid.extra["Device type"],
    //         Location: i.bid.extra.Location,
    //       },
    //       view: {
    //         price: formatNearAmount(
    //           i.bid.sale_conditions.toLocaleString("fullwide", {
    //             useGrouping: false,
    //           })
    //         ),
    //         MWh: i.bid.extra.Energy ?? "N/A",
    //         type: i.bid.extra["Device type"]?.[0] ?? "N/A",
    //       },
    //     };
    //   });
    //   immutableBids.current = bidsPayload;
    //   setBids(bidsPayload);
    // })();
  }, []);

  // async function handlePurchase(tokenId, deposit) {
  //   const contract = await new Contract(
  //     window.walletConnection.account(),
  //     `market.${process.env.REACT_APP_NFT_DEV_ACCOUNT_ID}`,
  //     {
  //       viewMethods: [],
  //       changeMethods: ["direct_ask_sell"],
  //     }
  //   );
  //   await contract["direct_ask_sell"](
  //     {
  //       id: tokenId,
  //     },
  //     "300000000000000",
  //     `${deposit.slice(0, -1)}2`
  //   );
  // }

  // const placeBid = async () => {
  //   if (
  //     !form["Energy*"] ||
  //     !form["Price*"] ||
  //     !form["Device type"] ||
  //     !form["Location"]
  //   )
  //     return;
  //   const contract = await new Contract(
  //     window.walletConnection.account(),
  //     `market.${process.env.REACT_APP_NFT_DEV_ACCOUNT_ID}`,
  //     {
  //       viewMethods: [],
  //       changeMethods: ["place_bid"],
  //     }
  //   );
  //   await contract["place_bid"](
  //     {
  //       amount: form["Energy*"],
  //       conditions: `${form["Price*"]}000000000000000000000000`,
  //       extra: JSON.stringify({
  //         "Device type": form["Device type"],
  //         Location: form["Location"],
  //         Energy: form["Energy*"],
  //       }),
  //     },
  //     "300000000000000",
  //     `${form["Price*"]}000000000000000000000000`
  //   );
  // };

  // const clearForm = useCallback(() => {
  //   setForm({});
  //   setTraders(immutableData.current);
  //   setBids(immutableBids.current);
  // }, []);

  return (
    <Box sx={BoxStyle}>
      <Grid>
        <TitleText title={"Carbon Market"} />
      </Grid>
      <PlatformsDataSection
        matchingData={'1'}
        bodyData={platforms}
      />
      <TokensDataSection
        matchingData={'1'}
        bodyData={tokens}
      />
      <ProjectsDataSection
        matchingData={'1'}
        bodyData={projects}
      />
    </Box>
  );
};

export default CarbonMarket;


// {SectionData.map((el, idx) => {
//   return (
//     <DataSection
//       title={el.title}
//       matchingData={
//         el.title === "Traders"
//           ? immutableData.current.length
//           : immutableBids.current.length
//       }
//       data={el.data}
//       bodyData={el.title === "Traders" ? traders : bids}
//       key={idx}
//     />
//   );
// })}
// <FormSection
//   traders={traders}
//   form={form}
//   clearForm={clearForm}
//   setForm={setForm}
//   placeBid={placeBid}
//   handleFormChange={handleFormChange}
// />
// <Grid
//   container
//   sx={{ width: "100%", height: "100%", maxWidth: "605px" }}
//   gap="27px"
//   flexDirection={"column"}
// > 
// </Grid>