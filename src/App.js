import {NFTCard, NftPhoto} from "./components/NFTCard";
import styled from "styled-components";

function App() {
    const nfts = [
        {name: "Faraway1", symbol: "FTK", copies: 1, image: "https://via.placeholder.com/600x400.jpg"},
        {name: "Faraway2", symbol: "FTK", copies: 1, image: "https://via.placeholder.com/600x400.jpg"},
        {name: "Faraway3", symbol: "FTK", copies: 1, image: "https://via.placeholder.com/600x400.jpg"},
    ];

    return (
        <div className="App">
            <Container>
                <Title>Faraway NFT collection</Title>
                <SubTitle>The rarest and best</SubTitle>
                <Grid>
                    {
                        nfts.map((nft, index) =>
                            <NFTCard key={index} nft={nft}/>)
                    }
                </Grid>
            </Container>
            <NFTModal nft={nfts[0]}/>
        </div>
    );
}

const NFTModal = (props) => {
    const nft = props.nft;
    return (
        <Modal>
            <ModalContent>
                <ModalGrid>
                    <NftPhoto style={{backgroundImage: `url(${nft && nft.image})`, height: 400, width: 400}}/>
                    <div>
                        <ModalTitle>{nft && nft.name}</ModalTitle>
                        <Paragraph>{`You own ${nft.copies} copies`}</Paragraph>
                        <SectionTest>Description</SectionTest>
                        <Paragraph style={{width: 400}}>{nft && nft.description}</Paragraph>
                        <SectionTest>Attributes</SectionTest>
                    </div>
                </ModalGrid>
            </ModalContent>
        </Modal>
    )
}

const ModalTitle = styled.h1`
  margin: 0;
`

const Paragraph = styled.p`
  margin: 0 0 15px 0;
`

const SectionTest = styled.h3`
  margin: 5px 0 5px 0;
`

const ModalGrid = styled.div`
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 40px;
`

const Modal = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto; // scroll if needed
  background-color: rgba(0, 0, 0, 0.5);
`

const ModalContent = styled.div`
  position: relative;
  width: 900px;
  margin: auto;
  background-color: white;
  border-radius: 20px;
  padding: 20px;
`

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
