import {NFTCard} from "./components/NFTCard";
import {NFTModal} from "./components/NFTModal";
import styled from "styled-components";
import {useState} from 'react';

function App() {
    const [showModal, setShowModal] = useState(false);
    const [selectedNft, setSelectedNft] = useState();

    const nfts = [
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

    const toggleModal = (i) => {
        if (i >= 0) {
            setSelectedNft(nfts[i]);
        }
        setShowModal(!showModal);
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
export default App;
