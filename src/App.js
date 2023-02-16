import {NFTCard} from "./components/NFTCard";
import {NFTModal} from "./components/NFTModal";
import styled from "styled-components";
import {useState} from 'react';
import { ethers } from "ethers";

const axios = require('axios');

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

export const App = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedNft, setSelectedNft] = useState();
    const [nfts, setNfts] = useState(initialNfts);

    const toggleModal = (i) => {
        if (i >= 0) {
            setSelectedNft(nfts[i]);
        }
        setShowModal(!showModal);
    }

    async function getNFTs(address) {
        const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY;
        const rpc = `https://goerli.infura.io/v3/${INFURA_API_KEY}`;

        const ethersProvider = new ethers.JsonRpcProvider(rpc);

        const abi = [
            "function name() public view returns (string memory)",
            "function symbol() public view returns (string memory)",
            "function tokenURI(uint256 tokenId) view returns (string memory)",
            "function totalSupply() external view returns (uint256);",
        ];

        const nftCollection = new ethers.Contract(address, abi, ethersProvider);
        const numberOfNft = (await nftCollection.totalSupply()).to_number();
        const symbol = await nftCollection.symbol();
        const name = await nftCollection.name();
        // const accounts = Array(numberOfNft).fill(address);
        // const ids = Array.from({length: numberOfNft}, (_, i) => i + 1);

        let tempArray = [];
        let baseUrl = "";

        for (let i = 1; i <= numberOfNft; i++) {
            if (i === 1) {
                const uri = await nftCollection.tokenURI(i);
                baseUrl = uri.replace("/d+.json/", "");
                const response = await axios.get(uri);
                const nft = response.data;
                nft.symbol = symbol;
                nft.name = name;
                nft.copies = 1; // Our version allows only unique NFTs
                tempArray.push(nft);
            } else {
                const response = await axios.get(baseUrl + `${i}.json`);
                const nft = response.data;
                nft.symbol = symbol;
                nft.name = name;
                nft.copies = 1; // Our version allows only unique NFTs
                tempArray.push(nft);
            }
        }

        setNfts(tempArray);

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
}