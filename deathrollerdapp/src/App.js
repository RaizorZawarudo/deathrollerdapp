import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, bsc } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import LandingPage from './Pages/LandingPage';
import Navbar from './Components/Navbar';
import Dashboard from './Pages/Dashboard';
import Docs from './Pages/Docs';
import './App.css';



const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum, bsc],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})


function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Navbar><Dashboard /></Navbar>} />
            <Route path="/docs" element={<Navbar><Docs /></Navbar>} />
          </Routes>
        </Router>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;

