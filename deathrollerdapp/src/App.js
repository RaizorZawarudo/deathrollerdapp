import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, Theme} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygon, arbitrum, polygonMumbai, localhost } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import LandingPage from './Pages/LandingPage';
import Navbar from './Components/Navbar';
import Dashboard from './Pages/Dashboard';
import Docs from './Pages/Docs';
import './App.css';
import './colors.css';

const { chains, provider } = configureChains(
  [polygon, arbitrum, polygonMumbai, localhost],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'DeathRoller',
  chains
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const myCustomTheme = {
  blurs: {
    modalOverlay: 'medium',
  },
  colors: {
    accentColor: 'var(--tertiary-color)',
    accentColorForeground: '...',
    actionButtonBorder: 'var(--custom-black-color)',
    actionButtonBorderMobile: '...',
    actionButtonSecondaryBackground: 'var(--secondary-color)',
    closeButton: '...',
    closeButtonBackground: 'var(--secondary-color)',
    connectButtonBackground: 'var(--tertiary-color)',
    connectButtonBackgroundError: '...',
    connectButtonInnerBackground: '...',
    connectButtonText: 'var(--custom-black-color)',
    connectButtonTextError: '...',
    connectionIndicator: '...',
    downloadBottomCardBackground: '...',
    downloadTopCardBackground: '...',
    error: '...',
    generalBorder: 'var(--custom-black-color)',
    generalBorderDim: 'var(--custom-black-color)',
    menuItemBackground: 'var(--secondary-color)',
    modalBackdrop: '...',
    modalBackground: 'var(--primary-color)',
    modalBorder: 'var(--tertiary-color)',
    modalText: 'var(--primary--color)',
    modalTextDim: 'var(--primary-color)',
    modalTextSecondary: 'var(--tertiary-color)',
    profileAction: 'var(--secondary-color)',
    profileActionHover: 'var(--tertiary-color)',
    profileForeground: '...',
    selectedOptionBorder: 'var(--custom-black-color)',
    standby: '...',
  },
  fonts: {
    body: 'var(--main-font)',
  },
  radii: {
    actionButton: '10px',
    connectButton: '10px',
    menuButton: '10px',
    modal: '10px',
    modalMobile: '10px',
  },
  shadows: {
    connectButton: '...',
    dialog: '...',
    profileDetailsAction: '...',
    selectedOption: '...',
    selectedWallet: '...',
    walletLogo: '...',
  },
};


function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider theme={myCustomTheme} modalSize="compact" chains={chains}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard layout = {<Navbar/>} />} />
            <Route path="/docs" element={<Docs  layout = {<Navbar/>} />}  />
          </Routes>
        </Router>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;

