
import React, { useState, useEffect } from 'react';

type Price = {
    currency: string;
    date: Date;
    price: number;
}

type Token = {
    symbol: string;
    price: Price;
}

const CurrencyConversion: React.FC = () => {
    const [listCurrency, setListCurrency] = useState<Token[]>([]);
    const [fromCurrency, setFromCurrency] = useState<string>('');
    const [toCurrency, setToCurrency] = useState<string>('');
    const [amount, setAmount] = useState<number>();
    const [error, setError] = useState<string>('');
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [convertedAmount, setConvertedAmount] = useState<number>();

    useEffect(() => {
        const fetchTokenData = async () => {
            try {
                const response = await fetch('https://interview.switcheo.com/prices.json');
                const data = await response.json();
                const listCurrency = Object.keys(data).map((key) => ({
                    symbol: key,
                    price: data[key],
                }));
                setListCurrency(listCurrency);
            } catch (error) {
                console.error('Error fetching token data:', error);
            }
        };
        fetchTokenData();
    }, []);

    const handleConvert = () => {
        if (!fromCurrency || !toCurrency || !amount) {
            setError('Please fill out all fields.');
            setConvertedAmount(undefined);
            return;
        }

        const fromToken = listCurrency.find(item => item.symbol === fromCurrency);
        const toToken = listCurrency.find(item => item.symbol === toCurrency);

        if (!fromToken || !toToken) {
            setError('Invalid currency selected.');
            return;
        }

        const rate = fromToken.price.price / toToken.price.price;
        setExchangeRate(rate);
        const convertedAmount = Number(amount) * rate;

        setIsLoading(true);
        setError('');

        setTimeout(() => {
            setIsLoading(false);
            setConvertedAmount(convertedAmount);
        }, 2000);
    };

    return (
        <div className="lg:w-1/3 w-1/2 h-[500px] p-5 border border-gray-100 shadow-lg rounded-2xl bg-white flex flex-col space-y-4 px-8">
            <h2 className='text-center text-3xl text-green-400 font-bold'>Currency Conversion</h2>
            <div className='flex flex-col space-y-4 mt-4'>
                <div className="from-currency flex flex-col text-start">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">From:</label>
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                        <option>Select currency</option>
                        {listCurrency.map(item => (
                            <option key={item.symbol} value={item.symbol}>
                                {item.price?.currency}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="to-currency flex flex-col text-start">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">To:</label>
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                        <option>Select currency</option>
                        {listCurrency.map(item => (
                            <option key={item.symbol} value={item.symbol}>
                                {item.price?.currency}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="amount flex flex-col text-start">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount:</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.valueAsNumber)}
                    />
                </div>
                {exchangeRate && (
                    <div className="exchange-rate block mb-2 text-md font-medium text-gray-900 dark:text-white">
                        Exchange Rate: {exchangeRate.toFixed(6)}
                    </div>
                )}
            </div>

            <div className="flex flex-col space-y-6">
                <button onClick={handleConvert} disabled={isLoading} className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    {isLoading ? 'Converting...' : 'Convert'}
                </button>
                {convertedAmount && <p className="success p-2 mb-2 text-sm text-green-800 rounded-lg bg-green-200 dark:bg-gray-800 dark:text-green-400">Convert completed! You will receive {convertedAmount.toFixed(6)}</p>}
                {error && <p className="error p-2 mb-2 text-sm text-red-800 rounded-lg bg-red-200 dark:bg-gray-800 dark:text-red-400">{error}</p>}
            </div>
        </div>
    );
};

export default CurrencyConversion;
