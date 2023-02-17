import {NFTCard} from "./components/NFTCard";
import {NFTModal} from "./components/NFTModal";
import {NFTCollectionCard} from "./components/NFTCollectionCard";
import {useState, useEffect, useRef} from 'react';
import {getWalletAddress} from "./helpers";
import styled from "styled-components";
import {ethers} from "ethers";
import axios from 'axios';

export const App = () => {
    const initialNfts = [
        {
            name: "Faraway1", symbol: "FTK", copies: 1, image: "https://via.placeholder.com/600x400.jpg",
            attributes: [
                {trait_type: "Background", value: "Red"},
                {trait_type: "Background", value: "Red"}],
            description: "This is a description"
        },
        {
            name: "Faraway2", symbol: "FTK", copies: 1, image: "https://via.placeholder.com/600x400.jpg",
            attributes: [
                {trait_type: "Background", value: "Red"},
                {trait_type: "Background", value: "Red"}],
            description: "This is a description"
        },
        {
            name: "Faraway3", symbol: "FTK", copies: 1, image: "https://via.placeholder.com/600x400.jpg",
            attributes: [
                {trait_type: "Background", value: "Red"},
                {trait_type: "Background", value: "Red"}],
            description: "This is a description"
        },
    ];

    const initialCollections = [
        {name: "Faraway 1", symbol: "FTK3", address: "0xfeDB19A138fdF3432A88eB3dB9AD36f7aed073B0", totalSupply: 1},
        {name: "Faraway 2", symbol: "FTK4", address: "0xfeDB19A138fdF3432A88eB3dB9AD36f7aed073B0", totalSupply: 2},
    ];

    // States
    const [showModal, setShowModal] = useState(false);
    const [selectedNft, setSelectedNft] = useState();
    const [nfts, setNfts] = useState(initialNfts);
    const [collections, setCollections] = useState(initialCollections);
    const [tokenSymbolToCreate, setTokenSymbolToCreate] = useState("");
    const [tokenNameToCreate, setTokenNameToCreate] = useState("");
    const [tokenUriToCreate, setTokenUriToCreate] = useState("");
    // Refs
    const inputNameRef = useRef(null);
    const inputSymbolRef = useRef(null);
    const currentCollectionAddress = useRef(null);
    const inputTokenUriRef = useRef(null);

    useEffect(() => {
        (
            async () => {
                const address = await getWalletAddress();
                console.log("Connected to address: " + address);
                if (address) {
                    await getNFTs(address);
                }
            }
        )()

    }, []);

    useEffect(() => {
        (
            async () => {
                await getCollections();
            }
        )()
    }, []);

    const toggleModal = (i) => {
        if (i >= 0) {
            setSelectedNft(nfts[i]);
        }
        setShowModal(!showModal);
    }

    async function mintNft() {
        console.log("Started minting token");
        if (currentCollectionAddress.current.value === "") {
            console.error("Collection address is empty");
            return;
        }

        let signer;
        let provider;
        if (window.ethereum == null) {
            // If MetaMask is not installed, we use the default provider,
            // which is backed by a variety of third-party services (such
            // as INFURA). They do not have private keys installed so are
            // only have read-only access
            console.log("MetaMask not installed; using read-only defaults")
            provider = ethers.getDefaultProvider();
        } else {
            // Connect to the MetaMask EIP-1193 object. This is a standard
            // protocol that allows Ethers access to make all read-only
            // requests through MetaMask.
            provider = new ethers.BrowserProvider(window.ethereum)
        }

        const abi = [
            "function mint(address token, address to, string calldata uri)"
        ];

        signer = await provider.getSigner()

        let nft = new ethers.Contract(
            process.env.REACT_APP_FACTORY_ADDRESS,
            abi,
            signer
        )

        console.log("Minting token with uri: " + tokenUriToCreate + " to address: " + signer.address)
        const tx = await nft.mint(currentCollectionAddress.current.value, signer.address, tokenUriToCreate);
        await tx.wait();
        console.log("Token has been created");
        await getNFTs(signer.address);
    }

    async function createCollection() {
        console.log("Started creating collection with name: " + tokenNameToCreate + " and symbol: " + tokenSymbolToCreate);
        if (tokenNameToCreate === "" || tokenSymbolToCreate === "") {
            console.error("Name or symbol is empty");
            return;
        }

        let signer;
        let provider;
        if (window.ethereum == null) {
            // If MetaMask is not installed, we use the default provider,
            // which is backed by a variety of third-party services (such
            // as INFURA). They do not have private keys installed so are
            // only have read-only access
            console.log("MetaMask not installed; using read-only defaults")
            provider = ethers.getDefaultProvider();
        } else {
            // Connect to the MetaMask EIP-1193 object. This is a standard
            // protocol that allows Ethers access to make all read-only
            // requests through MetaMask.
            provider = new ethers.BrowserProvider(window.ethereum)
        }

        const abi = [
            "function create(string calldata name, string calldata symbol) external returns (address)",
        ];

        // const rpc = "https://goerli.blockpi.network/v1/rpc/public";
        // const provider = new ethers.JsonRpcProvider(rpc);

        signer = await provider.getSigner()

        let factory = new ethers.Contract(
            process.env.REACT_APP_FACTORY_ADDRESS,
            abi,
            signer
        )

        const tx = await factory.create(tokenNameToCreate, tokenSymbolToCreate, signer);
        await tx.wait();
        console.log("Created collection with name: " + tokenNameToCreate + " and symbol: " + tokenSymbolToCreate);
        await getCollections();
    }

    async function getCollections() {
        console.log("Loading NFT Factory: " + process.env.REACT_APP_FACTORY_ADDRESS);
        const rpc = "https://goerli.blockpi.network/v1/rpc/public";
        const ethersProvider = new ethers.JsonRpcProvider(rpc);

        const abi = [
            "function count() public view returns (uint256)",
            "function tokenName(address address_) public view returns (string memory)",
            "function tokenSymbol(address address_) public view returns (string memory)",
            "function tokenUri(address address_, uint256 tokenId_) public view returns (string memory)",
            "function tokenTotalSupply(address address_) public view returns (uint256)",
            "function tokenList(uint256 i) public view returns (address)",
        ]

        let factory = new ethers.Contract(
            process.env.REACT_APP_FACTORY_ADDRESS,
            abi,
            ethersProvider
        )

        let collectionNumber = Number(await factory.count());
        console.log("Number of collections created by Factory: " + collectionNumber);
        let tempArray = [];
        for (let i = 0; i < collectionNumber; i++) {
            const address = await factory.tokenList(i);
            const name = await factory.tokenName(address)
            const symbol = await factory.tokenSymbol(address);
            const totalSupply = await factory.tokenTotalSupply(address);
            console.log("Loading nft collection for address: " + address);
            console.log("Collection name: " + name);

            let collection = {
                name: name,
                symbol: symbol,
                address: address,
                totalSupply: totalSupply,
            };

            tempArray.push(collection);
        }

        if (tempArray.length === 0) {
            tempArray = initialCollections;
        }

        setCollections(tempArray);
    }

    const handleSymbolChange = () => {
        setTokenSymbolToCreate(inputSymbolRef.current.value);
    }

    const handleNameChange = () => {
        setTokenNameToCreate(inputNameRef.current.value);
    }

    const handleTokenUriChange = () => {
        setTokenUriToCreate(inputTokenUriRef.current.value);
    }

    const handleCreateCollection = async () => {
        await createCollection()
    }

    const handleMintNFT = async () => {
        await mintNft();
    }

    const handleSelectedCollection = async (i) => {
        console.log("Selected collection address: " + collections[i].address);
        currentCollectionAddress.current.value = collections[i].address;
    }

    // TODO:
    // Warning:(57, 5) ESLint: The 'getNFTs' function makes the dependencies of useEffect Hook (at line 48) change on every render.
    // Move it inside the useEffect callback. Alternatively, wrap the definition of 'getNFTs' in its own useCallback() Hook.
    // (react-hooks/exhaustive-deps)
    async function getNFTs(address) {
        console.log("Loading NFTs for address: " + address);
        console.log("Loading NFTs for contract: " + process.env.REACT_APP_ADDRESS);
        const rpc = "https://goerli.blockpi.network/v1/rpc/public";

        const ethersProvider = new ethers.JsonRpcProvider(rpc);

        let abi = [
            "function symbol() public view returns(string memory)",
            "function name() public view returns(string memory)",
            "function totalSupply() external view returns (uint256)",
            "function tokenURI(uint256 tokenId) public view returns (string memory)",
        ]

        let nftCollection = new ethers.Contract(
            process.env.REACT_APP_ADDRESS,
            abi,
            ethersProvider
        )

        let collectionSymbol = await nftCollection.symbol()
        const name = await nftCollection.name();
        const numberOfNft = Number(await nftCollection.totalSupply());

        // To Check users NFTs
        // const accounts = Array(numberOfNft).fill(address);
        // const ids = Array.from({length: numberOfNft}, (_, i) => i + 1);

        let tempArray = [];

        for (let i = 0; i < numberOfNft; i++) {
            let nft = initialNfts[0];
            const uri = await nftCollection.tokenURI(i);
            if (uri.includes("example")) {
                continue;
            }

            try {
                const response = await axios.get(uri);
                if (response.status === 200) {
                    nft = response.data;
                    nft.symbol = collectionSymbol;
                    nft.name = name;
                    nft.copies = 1; // Our version allows only unique NFTs
                }
            } catch (e) {
                console.log("Error fetching NFT: " + i, " from address: " + uri);
            }

            tempArray.push(nft);
        }

        if (tempArray.length === 0) {
            tempArray = initialNfts;
        }

        setNfts(tempArray);
    }

    return (
        <div className="App">
            <Container>
                <Title>NFT collections factory</Title>
                <SubTitle>The rarest and best</SubTitle>
                <fieldset style={{border: "1px solid #ccc", marginBottom: 30}}>
                    <legend>Create a new collection</legend>
                    <ContractCreator>
                        <Input placeholder="Token Symbol" ref={inputSymbolRef} onInput={handleSymbolChange}/>
                        <Input placeholder="Token Name" ref={inputNameRef} onInput={handleNameChange}/>
                        <ConfirmationButton onClick={handleCreateCollection}>
                            Create Collection
                        </ConfirmationButton>
                    </ContractCreator>
                </fieldset>
                <fieldset style={{border: "1px solid #ccc"}}>
                    <legend>Created collections</legend>
                    <CollectionList>
                        {
                            collections.map((collection, index) =>
                                <NFTCollectionCard key={index} collection={collection}
                                                   onClick={() => handleSelectedCollection(index)}/>)
                        }
                    </CollectionList>
                </fieldset>

                <fieldset style={{border: "1px solid #ccc", marginTop: 30}}>
                    <legend>Mint new token for selected collection</legend>
                    <Input style={{width: 400, marginTop: 40}} placeholder="Contract Address" ref={currentCollectionAddress}/>
                    <ContractEditor>
                        <Input ref={inputTokenUriRef} placeholder="Token URI" onInput={handleTokenUriChange}/>
                        <ConfirmationButton onClick={handleMintNFT}>
                            Mint
                        </ConfirmationButton>
                    </ContractEditor>
                </fieldset>

                <Grid>
                    {
                        nfts.map((nft, index) =>
                            <NFTCard key={index} nft={nft} toggleModal={() => toggleModal(index)}/>)
                    }
                </Grid>
            </Container>
            {
                showModal &&
                <NFTModal nft={selectedNft} toggleModal={() => toggleModal()}/>
            }
        </div>
    );
}

const Title = styled.h1`
  margin: 0;
  text-align: center
`
const SubTitle = styled.h4`
  color: gray;
  margin-top: 0;
  text-align: center
`
const Container = styled.div`
  width: 70%;
  max-width: 1200px;
  margin: 100px auto auto;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  row-gap: 40px;
`
const ContractEditor = styled.div`
  grid-column: 1 / 3;
  grid-row: 2 / 3;
  row-gap: 40px;
`
const ConfirmationButton = styled.button`
  margin-top: 6px;
  width: 200px;
  height: 40px;
  font-size: 14px;
  margin-right: 10px;
`
const ContractCreator = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 20px 0;
`
const CollectionList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 20px 0;
`
const Input = styled.input`
  width: 200px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 6px;
  margin-bottom: 16px;
  margin-right: 10px;
  resize: vertical;

  ::placeholder {
    color: orange;
  }
`
