
// Gold economy management for the Pyrameme game
// This simulates interaction with a WAX blockchain smart contract

// Smart contract wallet that manages the game's gold
export const GAME_CONTRACT_ACCOUNT = "pyrameme.wam";
// Developer wallet that receives a portion of the revenue
export const DEVELOPER_ACCOUNT = "devaccount.wam"; // This should be replaced with the actual developer account

// Revenue distribution percentages
export const TREASURE_REVENUE_PERCENT = 50;
export const DEVELOPER_REVENUE_PERCENT = 50;

// Track the game's treasury (in a real implementation, this would be stored on the blockchain)
let gameTreasury = 100000; // Starting with 100,000 gold in the treasury

// Conversion rates
export const GOLD_TO_PGL_RATE = 1000; // 1000 gold = 1 PGL

// Add gold to the treasury (from cell claims, etc)
export const addToTreasury = (amount: number): void => {
  gameTreasury += amount;
  console.log(`Added ${amount} gold to treasury. New balance: ${gameTreasury}`);
};

// Remove gold from the treasury (for treasures, etc)
export const removeFromTreasury = (amount: number): boolean => {
  if (amount > gameTreasury) {
    console.log(`Insufficient funds in treasury. Requested: ${amount}, Available: ${gameTreasury}`);
    return false;
  }
  
  gameTreasury -= amount;
  console.log(`Removed ${amount} gold from treasury. New balance: ${gameTreasury}`);
  return true;
};

// Get current treasury balance
export const getTreasuryBalance = (): number => {
  return gameTreasury;
};

// Calculate how much gold should be available for treasures based on claimed cells revenue
export const calculateTreasureAllocation = (claimRevenue: number): number => {
  return Math.floor(claimRevenue * (TREASURE_REVENUE_PERCENT / 100));
};

// Calculate developer's share from cell claims
export const calculateDeveloperShare = (claimRevenue: number): number => {
  return Math.floor(claimRevenue * (DEVELOPER_REVENUE_PERCENT / 100));
};

// Convert gold to PGL
export const convertGoldToPgl = (goldAmount: number): number => {
  return goldAmount / GOLD_TO_PGL_RATE;
};

// Simulate a blockchain transaction for cell claiming
export const processCellClaim = (cost: number): { treasuryAmount: number, developerAmount: number } => {
  const treasuryAmount = calculateTreasureAllocation(cost);
  const developerAmount = calculateDeveloperShare(cost);
  
  addToTreasury(treasuryAmount);
  
  return {
    treasuryAmount,
    developerAmount
  };
};

// Simulate parking fee transaction
export const processParking = (amount: number, ownerAccount: string | null): void => {
  if (ownerAccount) {
    // In a real implementation, this would send gold to the cell owner's account
    console.log(`Sending ${amount} gold to cell owner: ${ownerAccount}`);
  } else {
    // If no owner, gold goes to the treasury
    addToTreasury(amount);
    console.log(`Adding ${amount} gold from parking to treasury`);
  }
};

// Simulate treasure reward from treasury
export const processTreasureReward = (amount: number): boolean => {
  return removeFromTreasury(amount);
};
