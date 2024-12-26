import React, { useEffect } from "react";
import { Ticket, Trophy, Coins } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSolana } from "../context/SolanaContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const containerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #4a1d96 0%, #1e3a8a 50%, #000000 100%)",
  color: "#ffffff",
  padding: "2rem",
  fontFamily: "'Roboto', sans-serif",
};

const mainWrapperStyle = {
  maxWidth: "1280px",
  margin: "0 auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "3rem",
};

const titleStyle = {
  fontSize: "2.5rem",
  fontWeight: "700",
  marginBottom: "0.5rem",
};

const subtitleStyle = {
  color: "#93c5fd",
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#2563eb",
  borderRadius: "0.5rem",
  fontWeight: "500",
  border: "none",
  color: "white",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const buttonHoverStyle = {
  backgroundColor: "#1d4ed8",
};

const gridContainerStyle = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "2rem",
  marginBottom: "2rem",
};

const cardStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(59, 130, 246, 0.2)",
  borderRadius: "0.75rem",
  overflow: "hidden",
};

const cardHeaderStyle = {
  padding: "1.5rem",
  borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
};

const cardTitleStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "white",
};

const cardContentStyle = {
  padding: "1.5rem",
};

const lotteryCardStyle = {
  padding: "1rem",
  borderRadius: "0.5rem",
  backgroundColor: "rgba(30, 58, 138, 0.3)",
  border: "1px solid rgba(59, 130, 246, 0.2)",
};

const statusBadgeStyle = {
  padding: "0.25rem 0.75rem",
  borderRadius: "9999px",
  backgroundColor: "rgba(37, 99, 235, 0.4)",
  fontSize: "0.875rem",
};

const actionButtonsStyle = {
  display: "flex",
  gap: "0.75rem",
  marginTop: "1rem",
};

const buyButtonStyle = {
  ...buttonStyle,
  flex: 1,
  backgroundColor: "#2563eb",
};

const pickWinnerButtonStyle = {
  ...buttonStyle,
  flex: 1,
  backgroundColor: "#7c3aed",
};

const winnerCardStyle = {
  padding: "0.75rem",
  borderRadius: "0.5rem",
  backgroundColor: "rgba(161, 98, 7, 0.2)",
  border: "1px solid rgba(234, 179, 8, 0.2)",
  marginBottom: "1rem",
};

const createLotteryButtonStyle = {
  ...buttonStyle,
  width: "100%",
  backgroundColor: "#059669",
};

const LotteryDapp = () => {
  const wallet = useWallet();
  const {
    currentLottery,
    tickets,
    createLottery,
    buyTicket,
    pickWinner,
    claimPrize,
    fetchTickets,
  } = useSolana();

  useEffect(() => {
    if (currentLottery) {
      fetchTickets(currentLottery.id);
    }
  }, [currentLottery]);

  const handleBuyTicket = async () => {
    if (!currentLottery) return;
    try {
      await buyTicket(currentLottery.id);
    } catch (error) {
      console.error("Error buying ticket:", error);
    }
  };

  const handlePickWinner = async () => {
    if (!currentLottery) return;
    try {
      await pickWinner(currentLottery.id);
    } catch (error) {
      console.error("Error picking winner:", error);
    }
  };

  const handleCreateLottery = async () => {
    try {
      console.log("Attempting to create a lottery...");
      await createLottery(1000000000); // 1 SOL in lamports
      console.log("Lottery created successfully");
    } catch (error) {
      console.error("Error creating lottery:", error);
    }
  };

  const ticketHistory = tickets
    ? tickets.reduce((acc, ticket, index) => {
        const hour = Math.floor(index / 10);
        if (!acc[hour]) {
          acc[hour] = { time: `${hour}:00`, tickets: 0 };
        }
        acc[hour].tickets++;
        return acc;
      }, {})
    : [];

  const lotteryHistory = () => {
    const { lotteryHistory } = useSolana();

    return (
      <div>
        {lotteryHistory.length > 0 ? (
          lotteryHistory.map((history, index) => (
            <div key={index}>
              <p>Lottery ID: {history.lotteryId}</p>
              <p>Winner Address: {history.winnerAddress}</p>
              <p>Prize: {history.prize} SOL</p>
            </div>
          ))
        ) : (
          <p>No lottery history available.</p>
        )}
      </div>
    );
  };

  const [loadingDots, setLoadingDots] = React.useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={mainWrapperStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>
              Soltery #{currentLottery?.id || `${loadingDots}`}
            </h1>
            <p style={subtitleStyle}>Your ticket to decentralized fortune</p>
          </div>
          <WalletMultiButton />
        </div>

        <div style={gridContainerStyle}>
          <div style={{ flex: 1 }}>
            <Card style={cardStyle}>
              <CardHeader style={cardHeaderStyle}>
                <CardTitle style={cardTitleStyle}>
                  <Ticket
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: "#60a5fa",
                    }}
                  />
                  Current Lottery
                </CardTitle>
              </CardHeader>
              <CardContent style={cardContentStyle}>
                <div style={lotteryCardStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
                      Pot:{" "}
                      {currentLottery
                        ? (
                            (currentLottery.ticketPrice *
                              currentLottery.lastTicketId) /
                            1000000000
                          ).toFixed(2)
                        : "0"}{" "}
                      SOL
                    </h3>
                    <span style={statusBadgeStyle}>
                      {currentLottery?.winnerId ? "Completed" : "Active"}
                    </span>
                  </div>

                  {wallet.connected &&
                    currentLottery &&
                    !currentLottery.winnerId && (
                      <div style={actionButtonsStyle}>
                        <button
                          style={buyButtonStyle}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#1d4ed8")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "#2563eb")
                          }
                          onClick={handleBuyTicket}
                        >
                          Buy Ticket (
                          {(currentLottery.ticketPrice / 1000000000).toFixed(2)}{" "}
                          SOL)
                        </button>
                        {currentLottery.authority.toString() ===
                          wallet.publicKey?.toString() && (
                          <button
                            style={pickWinnerButtonStyle}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#6d28d9")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "#7c3aed")
                            }
                            onClick={handlePickWinner}
                          >
                            Pick Winner
                          </button>
                        )}
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>

            <Card style={cardStyle}>
              <CardHeader style={cardHeaderStyle}>
                <CardTitle style={cardTitleStyle}>Other Lotteries</CardTitle>
              </CardHeader>
              <CardContent style={cardContentStyle}>
                <div style={lotteryCardStyle}>
                  <div style={{ margin: "0 1rem", overflow: "hidden" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 2fr 1fr 1fr",
                        padding: "0.75rem 0",
                        fontWeight: "600",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{ textAlign: "center", fontSize: "0.875rem" }}
                      >
                        💳 Lottery
                      </div>
                      <div
                        style={{ textAlign: "center", fontSize: "0.875rem" }}
                      >
                        💳 Address
                      </div>
                      <div
                        style={{ textAlign: "center", fontSize: "0.875rem" }}
                      >
                        💳 Ticket
                      </div>
                      <div
                        style={{ textAlign: "center", fontSize: "0.875rem" }}
                      >
                        💲 Amount
                      </div>
                    </div>

                    {/* List of lottery history */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {lotteryHistory && lotteryHistory.length > 0 ? (
                        lotteryHistory.map((h, i) => (
                          <div
                            key={i}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 2fr 1fr 1fr",
                              padding: "0.75rem 0",
                              textAlign: "center",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            <div>#{h.lotteryId}</div>
                            <div>
                              {shortenPk(
                                h.winnerAddress ||
                                  "4koeNJ39zejjuCyVQdZmzsx28CfJoarrv4vmsuHjFSB6" // fallback if winnerAddress is not available
                              )}
                            </div>
                            <div>#{h.winnerId}</div>
                            <div>+{h.prize} SOL</div>
                          </div>
                        ))
                      ) : (
                        <div style={{ textAlign: "center", padding: "1rem" }}>
                          No lottery history available.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Group: Ticket Sales and Your Tickets */}
          <div style={{ flex: 1 }}>
            <Card style={cardStyle}>
              <CardHeader style={cardHeaderStyle}>
                <CardTitle style={cardTitleStyle}>Ticket Sales</CardTitle>
                <CardDescription
                  style={{ color: "#93c5fd", marginTop: "0.25rem" }}
                >
                  Current Lottery
                </CardDescription>
              </CardHeader>
              <CardContent style={cardContentStyle}>
                <div style={{ height: "7.4rem" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={Object.values(ticketHistory)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                      <XAxis dataKey="time" stroke="#60a5fa" />
                      <YAxis stroke="#60a5fa" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e1b4b",
                          border: "none",
                          borderRadius: "0.5rem",
                          padding: "0.5rem",
                        }}
                        labelStyle={{ color: "#60a5fa" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="tickets"
                        stroke="#4f46e5"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card style={cardStyle}>
              <CardHeader style={cardHeaderStyle}>
                <CardTitle style={cardTitleStyle}>
                  <Trophy
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: "#fbbf24",
                    }}
                  />
                  Your Tickets
                </CardTitle>
              </CardHeader>
              <CardContent style={cardContentStyle}>
                <div style={{ height: "7.7rem" }}>
                  {tickets &&
                    tickets
                      .filter(
                        (ticket) =>
                          ticket.account.authority.toString() ===
                          wallet.publicKey?.toString()
                      )
                      .map((ticket, idx) => (
                        <div key={idx} style={winnerCardStyle}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <p
                                style={{
                                  color: "#fcd34d",
                                  fontSize: "0.875rem",
                                }}
                              >
                                Ticket #{ticket.account.id}
                              </p>
                              <p style={{ fontWeight: "500" }}>
                                {ticket.account.authority
                                  .toString()
                                  .slice(0, 4)}
                                ...
                                {ticket.account.authority.toString().slice(-4)}
                              </p>
                            </div>
                            {currentLottery?.winnerId === ticket.account.id &&
                              !currentLottery.claimed && (
                                <button
                                  style={{
                                    ...buyButtonStyle,
                                    padding: "0.5rem 1rem",
                                    fontSize: "0.875rem",
                                  }}
                                  onClick={() =>
                                    claimPrize(
                                      currentLottery.id,
                                      ticket.account.id
                                    )
                                  }
                                >
                                  Claim Prize
                                </button>
                              )}
                          </div>
                        </div>
                      ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create New Lottery */}
        {wallet.connected && (
          <Card style={{ ...cardStyle, marginTop: "2rem" }}>
            <CardHeader style={cardHeaderStyle}>
              <CardTitle style={cardTitleStyle}>
                <Coins
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    color: "#34d399",
                  }}
                />
                Create New Lottery
              </CardTitle>
            </CardHeader>
            <CardContent style={cardContentStyle}>
              <button
                style={createLotteryButtonStyle}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#047857")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#059669")
                }
                onClick={handleCreateLottery}
                disabled={currentLottery && !currentLottery.winnerId}
              >
                Create New Lottery
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LotteryDapp;
