import App from "../App";
import CarbonMarket from "../pages/carbon-market/CarbonMarket";
import ComingSoon from "../pages/coming-soon/ComingSoon";
import Dashboard from "../pages/dashboard/Dashboard";
import EnergyMarket from "../pages/energy-market/EnergyMarket";
import MyCrts from "../pages/my-crt/MyCrts";
import MyEacs from "../pages/my-eacs/MyEacs";
import PolkadotNFT from "../pages/polkadot-nft/PolkadotNFT";

export const routes = [
  {
    path: "/dashboard",
    exact: true,
    component: Dashboard,
    fallback: null,
    private: true,
  },
  {
    path: "/my-eacs",
    exact: true,
    component: MyEacs,
    fallback: null,
    private: true,
  },
  {
    path: "/",
    exact: true,
    component: EnergyMarket,
    fallback: null,
    private: true,
  },
  {
    path: "/carbon-market",
    exact: true,
    component: CarbonMarket,
    fallback: null,
    private: true,
  },
  {
    path: "/my-crts",
    exact: true,
    component: MyCrts,
    fallback: null,
    private: true,
  },
  {
    path: "/coming-soon",
    exact: true,
    component: ComingSoon,
    fallback: null,
    private: true,
  },
  {
    path: "/polkadot-nft",
    exact: true,
    component: PolkadotNFT,
    fallback: null,
    private: true,
  },
];
