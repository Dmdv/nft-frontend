import {NFTCard} from "./components/NFTCard";
import {NFTModal} from "./components/NFTModal";
import styled from "styled-components";
import {useState, useEffect} from 'react';
import {ethers} from "ethers";
import {getWalletAddress} from "./helpers";
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

    const [showModal, setShowModal] = useState(false);
    const [selectedNft, setSelectedNft] = useState();
    const [nfts, setNfts] = useState(initialNfts);

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

    const toggleModal = (i) => {
        if (i >= 0) {
            setSelectedNft(nfts[i]);
        }
        setShowModal(!showModal);
    }

    // TODO:
    // Warning:(57, 5) ESLint: The 'getNFTs' function makes the dependencies of useEffect Hook (at line 48) change on every render.
    // Move it inside the useEffect callback. Alternatively, wrap the definition of 'getNFTs' in its own useCallback() Hook.
    // (react-hooks/exhaustive-deps)
    async function getNFTs(address) {
        console.log("Loading NFTs for address: " + address);
        console.log("loading NFT for contract: " + process.env.REACT_APP_ADDRESS);
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
                <Title>Faraway NFT collection</Title>
                <SubTitle>The rarest and best</SubTitle>
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
