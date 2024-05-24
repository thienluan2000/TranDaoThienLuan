import React from 'react';
import { BoxProps } from '@material-ui/core';
import useWalletBalances from './hooks/useWalletBalances';
import usePrices from './hooks/usePrices';
import WalletRow from './components/WalletRow';
import classes from './styles.module.css';

// Define interfaces for WalletBalance and FormattedWalletBalance
interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

interface Props extends BoxProps { }

// Function to determine the priority of a blockchain
const getPriority = (blockchain: string): number => {
    switch (blockchain) {
        case 'Osmosis':
            return 100;
        case 'Ethereum':
            return 50;
        case 'Arbitrum':
            return 30;
        case 'Zilliqa':
            return 20;
        case 'Neo':
            return 20;
        default:
            return -99;
    }
};

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    // Combined the filter, sort, and map operations in a single useMemo call to improve readability and efficiency. Directly used the correct condition in the filter method.
    const sortedAndFormattedBalances = React.useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                // Filter balances based on priority and amount
                const priority = getPriority(balance.blockchain);
                return priority > -99 && balance.amount > 0;
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                // Sort balances based on priority
                const leftPriority = getPriority(lhs.blockchain);
                const rightPriority = getPriority(rhs.blockchain);
                return rightPriority - leftPriority;
            })
            .map((balance: WalletBalance): FormattedWalletBalance => ({
                // Integrated the formatting logic into the map within the same useMemo block, eliminating the need for a separate mapping step.
                ...balance,
                formatted: balance.amount.toFixed(2)
            }));
    }, [balances]); // Removed prices from the dependency array of useMemo as it is not required for sorting and filtering.


    // Create WalletRow items from sortedAndFormattedBalances
    const rows = sortedAndFormattedBalances.map((balance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow
                className={classes.row}
                key={balance.currency} // Used balance.currency as the key for WalletRow items, assuming currency is unique for each balance to ensure stable key usage.
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted} //Corrected the type usage to ensure balance is correctly typed as FormattedWalletBalance within the rows map.
            />
        );
    });

    return (
        <div {...rest}>
            {rows}
        </div>
    );
};

export default WalletPage;
