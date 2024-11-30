        let cryptos = [];
        let ComonColor = "#4CAF50";
        let selectedCryptos = JSON.parse(localStorage.getItem('selectedCryptos')) || [];

        async function fetchCryptoData() {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
            const data = await response.json();
            cryptos = data;
            displayCryptos(data);
            updateComparison();
        }

        function displayCryptos(cryptos) {
            const cryptoList = document.getElementById('crypto-list');
            cryptoList.innerHTML = '';  // Clear any existing data

            cryptos.forEach(crypto => {
                const card = document.createElement('div');
                card.classList.add('crypto-card');
                card.innerHTML = `
                    <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
                    <p>Price: $${crypto.current_price}</p>
                    <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
                    <p>24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
                    <button style=" background-color : ${ComonColor};" onclick="addToComparison('${crypto.id}')">Add to Compare</button>
                `;
                cryptoList.appendChild(card);
            });
        }

        function applyFilterSort() {
            const filterValue = document.getElementById('filter-sort').value;
            let sortedCryptos;

            if (filterValue === 'price-asc') {
                sortedCryptos = [...cryptos].sort((a, b) => a.current_price - b.current_price);
            } else if (filterValue === 'price-desc') {
                sortedCryptos = [...cryptos].sort((a, b) => b.current_price - a.current_price);
            } else if (filterValue === 'market-cap-asc') {
                sortedCryptos = [...cryptos].sort((a, b) => a.market_cap - b.market_cap);
            } else if (filterValue === 'market-cap-desc') {
                sortedCryptos = [...cryptos].sort((a, b) => b.market_cap - a.market_cap);
            }

            displayCryptos(sortedCryptos);
        }

        function addToComparison(cryptoId) {
            if (selectedCryptos.length < 5 && !selectedCryptos.includes(cryptoId)) {
                selectedCryptos.push(cryptoId);
                localStorage.setItem('selectedCryptos', JSON.stringify(selectedCryptos));
                updateComparison();
            }
        }

        function removeFromComparison(cryptoId) {
            selectedCryptos = selectedCryptos.filter(id => id !== cryptoId);
            localStorage.setItem('selectedCryptos', JSON.stringify(selectedCryptos));
            updateComparison();
        }

        function updateComparison() {
            const comparisonSection = document.getElementById('comparison');
            comparisonSection.innerHTML = '<h2>Compare Cryptocurrencies</h2>';

            selectedCryptos.forEach(id => {
                const crypto = cryptos.find(c => c.id === id);
                if (crypto) {
                    comparisonSection.innerHTML += `
                        <div>
                            <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
                            <p>Price: $${crypto.current_price}</p>
                            <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
                            <p>24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
                            <button onclick="removeFromComparison('${crypto.id}')">Remove</button>
                        </div>
                    `;
                }
            });
        }

        function changeThemeColor() {
            const themeColor = document.getElementById('theme-color').value;
            ComonColor = themeColor;
            document.querySelector('header').style.backgroundColor = themeColor;  // Change header color
            document.querySelector('header h1').style.color = contrastColor(themeColor);  // Adjust text color for contrast
            document.querySelectorAll('.crypto-card button').forEach(button => {
                button.style.backgroundColor = themeColor;  // Change button color
                button.style.color = contrastColor(themeColor);  // Adjust button text color for contrast
            });
        }

        // Simple function to determine a contrasting color (white or black) for better visibility
        function contrastColor(hex) {
            let r = parseInt(hex.slice(1, 3), 16);
            let g = parseInt(hex.slice(3, 5), 16);
            let b = parseInt(hex.slice(5, 7), 16);
            let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            return luminance < 128 ? 'white' : 'black';
        }

        window.onload = () => fetchCryptoData();  // Fetch data on page load
    