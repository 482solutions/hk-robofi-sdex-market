import { Grid, Button, Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { BtnStyle } from "../my-eacs/components/EacsTableCell";
import PlatformsDataSection from "./components/PlatformsDataSection";
import ProjectsDataSection from "./components/ProjectsDataSection";
import TokensDataSection from "./components/TokensDataSection";
import TitleText from "../../components/texts/TitleText";
import { ToucanClient } from "toucan-sdk";
import { ethers, utils } from "ethers";
import { gql } from "@urql/core";
import { verraProject } from './components/verraProject';

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
  
  const selectToken = (projectId) => {
    console.log(projectId)
  }

  useEffect(() => {
    (async () => {
      const provider = ethers.getDefaultProvider(process.env.TOUCAN_RPC);
      const toucan = new ToucanClient(process.env.TOUCAN_NETWORK, provider);
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
          // btn: (
          //         <Button
          //           sx={BtnStyle}
          //           disabled={false}
          //           onClick={() => {console.log('Select')}
          //           }
          //         >
          //           Select
          //         </Button>
          //       ),
        },
      ])
      const bctPool = bctPoolTco2s.pooledTCO2Tokens.map(item => {
        return {
              platform: 'ToucanProtocol',
              projectName: verraProject[item.token.symbol.split('-')[2]].name,
              symbol: item.token.symbol,
              region: item.token.projectVintage.project.region??verraProject[item.token.symbol.split('-')[2]].region,
              year: item.token.projectVintage.name,
              type: 'BCT',
              amount: parseFloat(utils.formatUnits(item.amount, 18)).toFixed(2),
              address: item.token.address,
              startTime: item.token.projectVintage.startTime,
              endTime: item.token.projectVintage.endTime
        }
      })
      const nctPool = nctPoolTco2s.pooledTCO2Tokens.map(item => {
        return {
              platform: 'ToucanProtocol',
              projectName: verraProject[item.token.symbol.split('-')[2]].name,
              symbol: item.token.symbol,
              region: item.token.projectVintage.project.region??verraProject[item.token.symbol.split('-')[2]].region,
              year: item.token.projectVintage.name,
              type: 'NCT',
              amount: parseFloat(utils.formatUnits(item.amount, 18)).toFixed(2),
              address: item.token.address,
              startTime: item.token.projectVintage.startTime,
              endTime: item.token.projectVintage.endTime
        }
      })
      setTokens([...nctPool, ...bctPool])
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
              platform: 'ToucanProtocol',
              projectName: verraProject[item.projectId.substr(4)].name,
              projectId: item.projectId,
              region: item.region??verraProject[item.projectId.substr(4)].region,
              years: item.vintages.map(item => item.name.slice(0,4)).join(),
              methodology: item.methodology,
              btn: (
                <Button
                  sx={BtnStyle}
                  disabled={false}
                  onClick={() => {selectToken(item.projectId)}
                  }
                >
                  Select
                </Button>
              )
        }
      })
      setProjects(projects)
    })();
  }, []);

  return (
    <Box sx={BoxStyle}>
      <Grid>
        <TitleText title={"Carbon Market"} />
      </Grid>
      <PlatformsDataSection
        bodyData={platforms}
      />
      <TokensDataSection
        bodyData={tokens}
      />
      <ProjectsDataSection
        bodyData={projects}
      />
    </Box>
  );
};

export default CarbonMarket;