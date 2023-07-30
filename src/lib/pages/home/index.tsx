import {
  Stack,
  CardBody,
  Card,
  Select,
  Heading,
  Box,
  Text,
  VStack,
  Grid,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Logo } from "./components/Logo";
import { usePioneer } from "lib/context/Pioneer";
import Web3 from "web3";


const ALL_CHAINS = [
  { name: "ethereum", chain_id: 1, symbol: "ETH" },
  { name: "polygon", chain_id: 137, symbol: "MATIC" },
  { name: "pulsechain", chain_id: 369, symbol: "PLS" },
  { name: "optimism", chain_id: 10, symbol: "ETH" },
  { name: "gnosis", chain_id: 100, symbol: "xDAI" },
  { name: "binance-smart-chain", chain_id: 56, symbol: "BNB" },
  { name: "smart-bitcoin-cash", chain_id: 10000, symbol: "BCH" },
  { name: "arbitrum", chain_id: 42161, symbol: "ARB" },
  { name: "fuse", chain_id: 122, symbol: "FUSE" },
  { name: "bittorrent", chain_id: 199, symbol: "BTT" },
  { name: "pulsechain", chain_id: 369, symbol: "PLS" },
  { name: "celo", chain_id: 42220, symbol: "CELO" },
  { name: "avalanche-c-chain", chain_id: 43114, symbol: "AVAX" },
  { name: "görli", chain_id: 5, symbol: "GOR" },
  { name: "eos", chain_id: 59, symbol: "EOS" },
  { name: "ethereum-classic", chain_id: 61, symbol: "ETC" },
  { name: "evmos", chain_id: 9001, symbol: "EVMOS" },
  { name: "poa-core", chain_id: 99, symbol: "POA" },
];

const Home = () => {
  const { state } = usePioneer();
  const { api, wallet, app } = state;
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0.000");
  const [tokenBalance, setTokenBalance] = useState("0.000");
  const [amount, setAmount] = useState("0.00000000");
  const [contract, setContract] = useState("");
  const [block, setBlock] = useState("");
  const [icon, setIcon] = useState("https://pioneers.dev/coins/ethereum.png");
  const [service, setService] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [prescision, setPrescision] = useState("");
  const [token, setToken] = useState("");
  const [assets, setAssets] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [chainId, setChainId] = useState(1);
  const [web3, setWeb3] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [txid, setTxid] = useState(null);
  const [signedTx, setSignedTx] = useState(null);
  const [loading, setLoading] = useState(null);
  const [isTokenSelected, setIsTokenSelected] = useState(null);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState(() => []);
  const [query, setQuery] = useState("bitcoin...");
  const [timeOut, setTimeOut] = useState(null);

  const onSend = async function () {
    try {
      console.log("onSend");
    } catch (e) {
      console.error("Error on send!", e);
    }
  };

  const onBroadcast = async function () {
    const tag = " | onBroadcast | ";
    try {
      // console.log("onBroadcast: ",signedTx)
      // @ts-ignore
      setLoading(true);
      // const txHash = await web3.eth.sendSignedTransaction(signedTx);
      // // console.log(tag,"txHash: ",txHash)
      // setTxid(txHash.transactionHash);
      // setBlock(txHash.blockNumber);
      // setLoading(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(tag, e);
    }
  };

  const handleInputChangeAmount = (e: { target: { value: any } }) => {
    const inputValue = e.target.value;
    setAmount(inputValue);
  };

  const onStart = async function () {
    try {
      const addressInfo = {
        addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
        coin: "Ethereum",
        scriptType: "ethereum",
        showDisplay: false,
      };
      console.log(wallet);
      const address = await wallet.ethGetAddress(addressInfo);
      console.log("address: ", address);
      setAddress(address);

      const info = await api.SearchByNetworkId({ chainId: 1 });
      console.log("onStart: info: ", info.data[0]);
      if (!info.data[0]) {
        console.error("No network found!");
      }
      setIcon(info.data[0].image);
      setService(info.data[0].service);
      setChainId(info.data[0].chainId);
      setBlockchain(info.data[0].name);
      // @ts-ignore
      const web3 = new Web3(
        // @ts-ignore
        new Web3.providers.HttpProvider(info.data[0].service)
      );
      setWeb3(web3);

      web3.eth.getBalance(address, function (err: any, result: any) {
        if (err) {
          // @ts-ignore
          console.error(err);
        } else {
          //console.log(web3.utils.fromWei(result, "ether") + " ETH")
          // @ts-ignore
          setBalance(
            web3.utils.fromWei(result, "ether") + " " + info.data[0].symbol
          );
        }
      });

      //TODO get tokens for chain
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    onStart();
  }, [api]);

  const handleClose = async function () {
    try {
      // @ts-ignore
      setLoading(false);
      setTxid(null);
      setSignedTx(null);
      // @ts-ignore
      setToken(null);
      // @ts-ignore
      setBlock(null);
      // @ts-ignore
      setContract(null);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClickTabs = async function (event: any) {
    try {
      console.log("Tab Clicked!");
      //get tokens for chain

      let assets = await api.SearchAssetsListByChainId({
        chainId,
        limit: 100,
        skip: 0,
      });
      assets = assets.data;
      //console.log("assets: ",assets.length)
      const assetsFormated = [];
      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        asset.value = asset.name;
        asset.label = asset.name;
        assetsFormated.push(asset);
      }
      console.log("handleSelect: assetsFormated: ", assetsFormated.length);
      // @ts-ignore
      setAssets(assetsFormated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInputChangeAddress = (e: any) => {
    const inputValue = e.target.value;
    setToAddress(inputValue);
  };

  const handleInputChangeContract = async function (input: any) {
    try {
      const inputValue = input.target.value;
      console.log("handleInputChangeContract: ", inputValue);
      setContract(inputValue);
      if (inputValue.length > 16 && inputValue.indexOf("0x") >= 0) {
        const minABI = [
          // balanceOf
          {
            constant: true,
            inputs: [{ name: "_owner", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "balance", type: "uint256" }],
            type: "function",
          },
          // decimals
          {
            constant: true,
            inputs: [],
            name: "decimals",
            outputs: [{ name: "", type: "uint8" }],
            type: "function",
          },
        ];
        // @ts-ignore
        const newContract = new web3.eth.Contract(minABI, inputValue);
        const decimals = await newContract.methods.decimals().call();
        setPrescision(decimals);
        const balanceBN = await newContract.methods.balanceOf(address).call();
        //console.log("input: balanceBN: ",balanceBN)
        // @ts-ignore
        const tokenBalance = parseInt(balanceBN / Math.pow(10, decimals));
        if (tokenBalance > 0) {
          setError(null);
          console.log("input: tokenBalance: ", tokenBalance);

          // @ts-ignore
          setTokenBalance(tokenBalance);
        } else {
          // @ts-ignore
          setError(
            `no balance on this token! chainId: ${chainId} contract: ${contract}`
          );
        }
      } else {
        // @ts-ignore
        setError("Invalid contract! must start with 0x");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelect = async function (input: any) {
    try {
      console.log("handleSelect input: ", input.target.value);

      //get provider info
      const info = await api.SearchByNetworkName(input.target.value);
      console.log("handleSelect: ", info.data[0]);
      console.log("handleSelect: chainId: ", info.data[0].chainId);
      setIcon(info.data[0].image);
      setService(info.data[0].service);
      setChainId(info.data[0].chainId);
      setBlockchain(info.data[0].name);
      // @ts-ignore
      const web3 = new Web3(
        new Web3.providers.HttpProvider(info.data[0].service)
      );
      // @ts-ignore
      setWeb3(web3);

      //if balance > 0 show send modal
      web3.eth.getBalance(address, function (err: any, result: any) {
        if (err) {
          //console.log(err)
        } else {
          //console.log(web3.utils.fromWei(result, "ether") + " ETH")
          setBalance(
            web3.utils.fromWei(result, "ether") + " " + info.data[0].symbol
          );
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={() => handleClose()} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Broadcasting to {blockchain}</ModalHeader>
          <ModalCloseButton />
          {loading ? (
            <div>
              <div>
                <h2>Broadcasted! waiting on confirmation!</h2>
              </div>
              <Spinner size="xl" color="green.500" />
            </div>
          ) : (
            <div>
              <ModalBody>
                <Tabs>
                  <TabList>
                    <Tab>Native</Tab>
                    <Tab onClick={handleClickTabs}>Token</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <div>
                        amount:{" "}
                        <input
                          type="text"
                          name="amount"
                          value={amount}
                          onChange={handleInputChangeAmount}
                        />
                      </div>
                      <br />
                      <div>
                        address:{" "}
                        <input
                          type="text"
                          name="address"
                          value={toAddress}
                          placeholder="0x651982e85D5E43db682cD6153488083e1b810798"
                          onChange={handleInputChangeAddress}
                        />
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div>
                        contract:{" "}
                        <input
                          type="text"
                          name="contract"
                          value={contract}
                          onChange={handleInputChangeContract}
                        />
                      </div>
                      {tokenBalance ? (
                        <div>tokenBalance: {tokenBalance}</div>
                      ) : (
                        <div>no token balance</div>
                      )}
                      {prescision ? (
                        <div>prescision: {prescision}</div>
                      ) : (
                        <div />
                      )}
                      <Text color="red.500">{error}</Text>
                      <br />

                      <div>
                        amount:{" "}
                        <input
                          type="text"
                          name="amount"
                          value={amount}
                          onChange={handleInputChangeAmount}
                        />
                      </div>
                      <br />
                      <div>
                        address:{" "}
                        <input
                          type="text"
                          name="address"
                          value={toAddress}
                          placeholder="0x651982e85D5E43db682cD6153488083e1b810798"
                          onChange={handleInputChangeAddress}
                        />
                      </div>
                    </TabPanel>
                  </TabPanels>
                  <br />
                  {error ? <div>error: {error}</div> : <div />}
                  {txid ? <div>txid: {txid}</div> : <div />}
                  {block ? <div>confirmed in block: {block}</div> : <div />}
                  {txid ? (
                    <div />
                  ) : (
                    <div>
                      {signedTx ? <div>signedTx: {signedTx}</div> : <div />}
                    </div>
                  )}
                </Tabs>
              </ModalBody>

              <ModalFooter>
                {!signedTx ? (
                  <div>
                    <Button colorScheme="green" mr={3} onClick={onSend}>
                      Send
                    </Button>
                  </div>
                ) : (
                  <div />
                )}
                {!txid ? (
                  <div>
                    {signedTx ? (
                      <div>
                        <Button
                          colorScheme="green"
                          mr={3}
                          onClick={onBroadcast}
                        >
                          broadcast
                        </Button>
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                ) : (
                  <div />
                )}
                <Button colorScheme="blue" mr={3} onClick={handleClose}>
                  exit
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <VStack spacing={8}>
            <Logo h="40vmin" pointerEvents="none" logo={icon} />
            <Grid templateRows="1fr 1fr 1fr" gap="1rem" alignItems="center">
              <Box p="1rem" border="1px" borderColor="gray.300">
                <Text fontSize="xl" fontWeight="bold">
                  Selected: {blockchain} (chainId{chainId})
                </Text>
                <Select
                  placeholder={`selected: ${blockchain}`}
                  defaultValue="ethereum"
                  onChange={handleSelect}
                >
                  {ALL_CHAINS.map((blockchain) => (
                    <option value={blockchain.name}>{blockchain.symbol}</option>
                  ))}
                </Select>
              </Box>
              <Box p="1rem" border="1px" borderColor="gray.300">
                <Text>address: {address}</Text>
              </Box>
              <Box p="1rem" border="1px" borderColor="gray.300">
                <Text>balance: {balance}</Text>
              </Box>
              <Box p="1rem" border="1px" borderColor="gray.300">
                <Button colorScheme="green" onClick={onOpen}>
                  Send
                </Button>
              </Box>
            </Grid>
          </VStack>
        </Grid>
      </Box>
    </div>
  );
};

export default Home;
