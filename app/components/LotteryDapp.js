import React, { useEffect } from "react";
import { Ticket, Trophy, Coins } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAppContext } from "../context/context";
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

// ... (keep all your existing styles)

const LotteryDapp = () => {
  const wallet = useWallet();
  const {
    lottery,
    tickets,
    lotteryId,
    lotteryHistory,
    canClaim,
    isLotteryAuthority,
    createLottery,
    buyTicket,
    pickWinner,
    claimPrize,
    userTicketHistory,
  } = useAppContext();

  const [loadingDots, setLoadingDots] = React.useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleCreateLottery = async () => {
    try {
      await createLottery(1000000000); // 1 SOL in lamports
    } catch (error) {
      console.error("Error creating lottery:", error);
    }
  };

  const handleBuyTicket = async () => {
    try {
      await buyTicket();
    } catch (error) {
      console.error("Error buying ticket:", error);
    }
  };

  const handlePickWinner = async () => {
    try {
      await pickWinner();
    } catch (error) {
      console.error("Error picking winner:", error);
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

  const shortenPk = (pk) => {
    if (!pk) return "";
    const pkString = pk.toString();
    return `${pkString.slice(0, 4)}...${pkString.slice(-4)}`;
  };

  return (
    <div style={containerStyle}>
      <div style={mainWrapperStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>
              Soltery #{lottery?.id || `${loadingDots}`}
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
                      {lottery
                        ? (
                            (lottery.ticketPrice * lottery.lastTicketId) /
                            1000000000
                          ).toFixed(2)
                        : "0"}{" "}
                      SOL
                    </h3>
                    <span style={statusBadgeStyle}>
                      {lottery?.winnerId ? "Completed" : "Active"}
                    </span>
                  </div>

                  {wallet.connected && lottery && !lottery.winnerId && (
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
                        {(lottery.ticketPrice / 1000000000).toFixed(2)} SOL)
                      </button>
                      {isLotteryAuthority && (
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
                <CardTitle style={cardTitleStyle}>Lottery History</CardTitle>
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
                        textAlign: "center", // Added to center the headings
                      }}
                    >
                      <div>Lottery ID</div>
                      <div>Winner</div>
                      <div>Winning Ticket</div>
                      <div>Prize</div>
                      {/* Empty div to keep the grid structure aligned */}
                      <div></div>
                      <div></div>
                    </div>

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
                              borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
                            }}
                          >
                            <div>#{h.lotteryId}</div>
                            <div>{shortenPk(h.winnerAddress)}</div>
                            <div>#{h.winnerId}</div>
                            <div>{h.prize} SOL</div>
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

          <div style={{ flex: 1 }}>
            {wallet.connected && (
              <Card style={{ ...cardStyle }}>
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
                    disabled={lottery && !lottery.winnerId}
                  >
                    Create New Lottery
                  </button>
                </CardContent>
              </Card>
            )}
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
                  Performance & Analytics
                </CardTitle>
                <CardDescription
                  style={{ color: "#93c5fd", marginTop: "0.25rem" }}
                >
                  Your ticket win/loss history and performance analytics
                </CardDescription>
              </CardHeader>

              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    marginBottom: "1rem",
                  }}
                >
                  {wallet.connected ? (
                    <>
                      <div className="bg-indigo-900/30 p-2 rounded-lg border border-indigo-500/20 mb-3 mt-3">
                        <div className="text-indigo-300 text-sm">
                          Total Tickets
                        </div>
                        <div className="text-xl font-bold text-white">
                          {(() => {
                            // Get tickets from ticket history
                            const historicalTickets =
                              userTicketHistory?.length || 0;

                            // Get current active tickets (if any)
                            const currentTickets =
                              tickets?.filter(
                                (ticket) =>
                                  ticket.account.authority.toString() ===
                                  wallet.publicKey?.toString()
                              ).length || 0;

                            // Return total participation count
                            return historicalTickets + currentTickets;
                          })()}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-indigo-900/30 p-2 rounded-lg border border-indigo-500/20">
                          <div className="text-indigo-300 text-sm">
                            Tickets Won
                          </div>
                          <div className="text-xl font-bold text-white">
                            {(() => {
                              const currentTickets =
                                tickets?.filter(
                                  (ticket) =>
                                    ticket.account.authority.toString() ===
                                    wallet.publicKey?.toString()
                                ).length || 0;

                              const historicalTickets =
                                lotteryHistory?.filter(
                                  (h) =>
                                    h.winnerAddress.toString() ===
                                    wallet.publicKey?.toString()
                                ).length || 0;

                              return currentTickets + historicalTickets;
                            })()}
                          </div>
                        </div>
                        <div className="bg-purple-900/30 p-2 rounded-lg border border-purple-500/20">
                          <div className="text-purple-300 text-sm">
                            Win Rate
                          </div>
                          <div className="text-xl font-bold text-white">
                            {(() => {
                              const totalTickets =
                                userTicketHistory?.length || 0;

                              const winningTickets =
                                lotteryHistory?.filter(
                                  (h) =>
                                    h.winnerAddress.toString() ===
                                    wallet.publicKey?.toString()
                                ).length || 0;

                              return totalTickets > 0
                                ? `${(
                                    (winningTickets / totalTickets) *
                                    100
                                  ).toFixed(1)}%`
                                : "0%";
                            })()}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {(() => {
                          const allTickets = [
                            ...(tickets?.filter(
                              (ticket) =>
                                ticket.account.authority.toString() ===
                                wallet.publicKey?.toString()
                            ) || []),
                            ...(lotteryHistory
                              ?.filter(
                                (h) =>
                                  h.winnerAddress.toString() ===
                                  wallet.publicKey?.toString()
                              )
                              .map((h) => ({
                                account: {
                                  id: h.winnerId,
                                  lotteryId: h.lotteryId,
                                  authority: wallet.publicKey,
                                },
                                historical: true,
                                prize: h.prize,
                              })) || []),
                          ];

                          return allTickets
                            .sort(
                              (a, b) =>
                                b.account.lotteryId - a.account.lotteryId ||
                                b.account.id - a.account.id
                            )
                            .map((ticket, idx) => {
                              const isWinningTicket =
                                lottery?.winnerId === ticket.account.id ||
                                (ticket.historical && ticket.prize);
                              const potentialPrize = ticket.historical
                                ? ticket.prize
                                : (lottery?.ticketPrice *
                                    lottery?.lastTicketId) /
                                  1000000000;

                              return (
                                <div
                                  key={idx}
                                  className={`${
                                    isWinningTicket
                                      ? "bg-amber-900/30"
                                      : "bg-slate-800/30"
                                  } p-2 rounded-lg border ${
                                    isWinningTicket
                                      ? "border-amber-500/20"
                                      : "border-slate-700"
                                  } transition-all hover:border-blue-500/30`}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p
                                          className={`${
                                            isWinningTicket
                                              ? "text-amber-400"
                                              : "text-blue-400"
                                          } text-sm font-medium`}
                                        >
                                          Lottery #{ticket.account.lotteryId} -
                                          Ticket #{ticket.account.id}
                                          {ticket.historical ? " (Past)" : ""}
                                        </p>
                                        {isWinningTicket && (
                                          <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full">
                                            Winner!
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-slate-400 text-sm mt-1">
                                        {ticket.historical
                                          ? `Won: ${ticket.prize} SOL`
                                          : `Potential Prize: ${potentialPrize?.toFixed(
                                              2
                                            )} SOL`}
                                      </p>
                                    </div>
                                    {isWinningTicket &&
                                      !ticket.historical &&
                                      !lottery.claimed && (
                                        <button
                                          style={{
                                            ...buyButtonStyle,
                                            padding: "0.5rem 1rem",
                                            fontSize: "0.875rem",
                                          }}
                                          onClick={() =>
                                            claimPrize(
                                              lottery.id,
                                              ticket.account.id
                                            )
                                          }
                                        >
                                          Claim Prize
                                        </button>
                                      )}
                                  </div>
                                </div>
                              );
                            });
                        })()}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-slate-400 py-4">
                      Connect your wallet to view ticket stats
                    </div>
                  )}
                </div>

                <div style={{ flexShrink: 0, height: "7.4rem" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={lotteryHistory?.map((h) => ({
                        time: `#${h.lotteryId}`,
                        netGain:
                          h.winnerAddress.toString() ===
                          wallet.publicKey?.toString()
                            ? parseFloat(h.prize)
                            : -1 * (lottery?.ticketPrice / 1000000000),
                        isWin:
                          h.winnerAddress.toString() ===
                          wallet.publicKey?.toString(),
                        prize: h.prize,
                        ticketId: h.winnerId,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                      <XAxis
                        dataKey="time"
                        stroke="#60a5fa"
                        tick={{ fill: "#60a5fa" }}
                      />
                      <YAxis stroke="#60a5fa" tick={{ fill: "#60a5fa" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e1b4b",
                          border: "none",
                          borderRadius: "0.5rem",
                          padding: "0.5rem",
                        }}
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 p-2 rounded border border-slate-700">
                                <p className="text-blue-400">
                                  Lottery {data.time}
                                </p>
                                <p className="text-sm text-slate-300">
                                  Ticket #{data.ticketId}
                                </p>
                                {data.isWin ? (
                                  <p className="text-green-400">
                                    Won: {data.prize} SOL
                                  </p>
                                ) : (
                                  <p className="text-red-400">
                                    Lost:{" "}
                                    {(
                                      lottery?.ticketPrice / 1000000000
                                    ).toFixed(2)}{" "}
                                    SOL
                                  </p>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="netGain"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        dot={{
                          stroke: "#4f46e5",
                          strokeWidth: 2,
                          r: 4,
                          fill: ({ isWin }) => (isWin ? "#4ade80" : "#ef4444"),
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* {wallet.connected && (
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
                disabled={lottery && !lottery.winnerId}
              >
                Create New Lottery
              </button>
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  );
};

export default LotteryDapp;
