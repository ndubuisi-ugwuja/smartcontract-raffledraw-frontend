"use client";
import {
    useWriteContract,
    useReadContract,
    useWatchContractEvent,
    useWaitForTransactionReceipt,
    useBlockNumber,
    useChainId,
    useAccount,
} from "wagmi";
import { abi, contractAddresses } from "../../../constants";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { ShortenAddress } from ".";

export default function LotteryEntrance() {
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const { writeContract, isPending, data: txHash } = useWriteContract();
    const raffleAddress = contractAddresses[chainId]?.[0];

    // Read RaffleState
    const { data: blockNumber } = useBlockNumber({ watch: true });
    const { data: rawRaffleState, refetch } = useReadContract({
        address: raffleAddress,
        abi,
        functionName: "getRaffleState",
        enabled: !!raffleAddress,
    });

    const [raffleState, setRaffleState] = useState(0); // default OPEN

    useEffect(() => {
        if (blockNumber) {
            refetch();
        }
    }, [blockNumber, refetch]);

    // Delay logic
    useEffect(() => {
        if (rawRaffleState === 1) {
            const timer = setTimeout(() => {
                setRaffleState(1);
            }, 30000); // 30 sec delay
            return () => clearTimeout(timer);
        } else {
            setRaffleState(rawRaffleState);
        }
    }, [rawRaffleState]);

    // Read entrance fee
    const { data: entranceFee, isLoading: loadingFee } = useReadContract({
        address: raffleAddress,
        abi,
        functionName: "getEntranceFee",
    });

    // Read current number of players
    const {
        data: numPlayers,
        refetch: refetchPlayers,
        isLoading: loadingPlayers,
    } = useReadContract({
        address: raffleAddress,
        abi,
        functionName: "getNumberOfPlayers",
        args: [],
        watch: true,
        enabled: !!raffleAddress,
    });

    // Listen to RaffleEnter
    useWatchContractEvent({
        address: raffleAddress,
        abi,
        eventName: "RaffleEnter",
        onLogs: async () => {
            await refetchPlayers();
        },
    });

    // Read most recent winner
    const {
        data: recentWinner,
        refetch: refetchWinner,
        isLoading: loadingWinner,
    } = useReadContract({
        address: raffleAddress,
        abi,
        functionName: "getRecentWinner",
    });

    // Listen for winner picked
    useWatchContractEvent({
        address: raffleAddress,
        abi,
        eventName: "WinnerPicked",
        onLogs: (logs) => {
            logs.forEach((log) => {
                const winner = log.args.winner;
                toast.success(`🎉 Winner picked: ${ShortenAddress(winner)}`, {
                    duration: 6000,
                });
                refetchWinner();
                refetchPlayers();
            });
        },
    });

    // wait for tx confirmation
    const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

    // notify when success
    useEffect(() => {
        if (isSuccess) {
            refetchPlayers();
            toast.success("You have successfully entered the raffle!", {
                duration: 6000,
            });
            const timer = setTimeout(() => {
                toast("⏱️ Please wait for winner to be picked!", {
                    duration: 6000,
                });
            }, 7000);

            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

    const handleEnter = () => {
        if (!isConnected) {
            toast.error("Please connect your wallet!");
            return;
        }

        try {
            writeContract({
                address: raffleAddress,
                abi,
                functionName: "enterRaffle",
                value: BigInt(20000000000000000), // 0.02 ETH entry fee
            });
        } catch (err) {
            console.error("Transaction failed:", err);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="text-sm text-gray-700 mt-2">
                {raffleState === 1 ? "⏳ Calculating winner..." : "🎟️ Raffle is open"}
            </div>
            <div className="text-lg">
                The previous winner:{" "}
                <span className="font-mono">
                    {loadingWinner
                        ? "Loading..."
                        : recentWinner && recentWinner !== "0x0000000000000000000000000000000000000000"
                        ? recentWinner
                        : "No winner yet"}
                </span>
            </div>
            <div className="text-lg">
                The current number of players:{" "}
                <span className="font-semibold">{loadingPlayers ? "Loading..." : numPlayers?.toString() || 0}</span>
            </div>
            <div className="text-lg">
                Entrance Fee:{" "}
                <span className="font-semibold">{loadingFee ? "Loading..." : `${Number(entranceFee) / 1e18} ETH`}</span>
            </div>
            <button
                onClick={handleEnter}
                disabled={isPending}
                className="rounded-lg px-6 py-3 font-medium bg-blue-500 text-white shadow-md transition hover:bg-blue-600 disabled:opacity-50"
            >
                {isPending ? "Entering..." : "Enter Raffle"}
            </button>
        </div>
    );
}
