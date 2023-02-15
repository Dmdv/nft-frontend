import {NftPhoto} from "./NFTCard";
import styled from "styled-components";

export const NFTModal = (props) => {
    const nft = props.nft;
    return (
        <Modal>
            <ModalContent>
                <ModalGrid>
                    <NftPhoto style={{backgroundImage: `url(${nft && nft.image})`, height: 400, width: 400}}/>
                    <div>
                        <ModalTitle>{nft && nft.name}</ModalTitle>
                        <Paragraph>{`You own ${nft.copies} copies`}</Paragraph>
                        <SectionText>Description</SectionText>
                        <Paragraph style={{width: 400}}>{nft && nft.description}</Paragraph>
                        <SectionText>Attributes</SectionText>
                        {
                            nft && nft.attributes.map((attribute, index) =>
                                <div key={index}>
                                    <Attribute>
                                        <AttributeText>{attribute.trait_type}</AttributeText>
                                        <AttributeText style={{float: "right"}}>{attribute.value}</AttributeText>
                                    </Attribute>
                                </div>
                            )
                        }
                    </div>
                </ModalGrid>
                <CloseButton onClick={() => props.toggleModal()}>
                    &times;
                </CloseButton>
            </ModalContent>
        </Modal>
    )
}

const CloseButton = styled.span`
  position: absolute;
  right: 0;
  top: 0;
  padding: 15px 20px 0 0;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
`
const ModalTitle = styled.h1`
  margin: 0;
`
const Paragraph = styled.p`
  margin: 0 0 15px 0;
`
const SectionText = styled.h3`
  margin: 5px 0 5px 0;
`
const Attribute = styled.div`
  margin: 10px 0px 5px 0px;
`
const AttributeText = styled.h4`
  color: gray;
  margin: 0;
  display: inline;
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