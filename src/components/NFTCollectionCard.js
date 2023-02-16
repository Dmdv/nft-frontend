import styled from "styled-components";

const NFTCollectionCard = (props) => {
    let coll = props.collection;
    return (
        <NftCollectionCard>
            <div style={{margin: 6}}>
                <NftSymbol>{coll && coll.symbol}</NftSymbol>
                <NftName>{coll && coll.name}</NftName>
                <NftAddress>{coll && coll.address}</NftAddress>
            </div>
        </NftCollectionCard>
    )
}

const NftSymbol = styled.div`
  font-size: 12px;
  color: gray;
`
const NftName = styled.div`
  font-size: 12px;
  font-weight: bold;
  display: flow;
  margin-bottom: 4px;
`

const NftAddress = styled.div`
  font-size: 12px;
  font-weight: bold;
  display: flow;
  color: gray;
  margin-bottom: 4px;
`
const NftCollectionCard = styled.div`
  width: 400px;
  height: 60px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 5px 0;
  box-shadow: 8px 8px 16px #d9d9d9,
    -8px -8px 16px #ffffff;
`

export {NFTCollectionCard};