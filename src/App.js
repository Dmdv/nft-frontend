
function App() {

  let nft = {name: "Faraway", symbol: "FTK", copies: 1, image: "https://via.placeholder.com/600x400.jpg" };

  return (
    <div className="App">
      <NFTCard nft={nft} />
    </div>
  );
}

export default App;
