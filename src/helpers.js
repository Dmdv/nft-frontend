export async function getWalletAddress() {
    try {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        return await handleAccountChanged(accounts);
    } catch (e) {
        if (e.code === 4001) {
            console.log('Please connect to MetaMask.');
            alert('Please connect to MetaMask.');
            return null;
        }

        console.error(e);
        return null;
    }
}

export async function handleAccountChanged(accounts) {
    if (accounts.length === 0) {
        console.error('Please connect to MetaMask.');
        alert('Please connect to MetaMask.');
    } else {
        window.ethereum.on('accountsChanged', () => {
            window.location.reload()
        });

        return accounts[0];
    }
}
