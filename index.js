import {
  Cl,
  makeContractCall,
  broadcastTransaction,
  PostConditionMode,
  principalCV,
  makeStandardSTXPostCondition,
  contractPrincipalCV,
  cvToValue,
  cvToJSON,
  callReadOnlyFunction,
  uintCV,
} from "@stacks/transactions";
import "dotenv/config";

import { waitForTxConfirmation } from "./wait-tx.js";

const networkUrl = "https://api.testnet.hiro.so"; // or mainnet

//lock Sip10
const STACKS_BRIDGE_ADDRESS = "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV";
const STACKS_BRIDGE_NAME = "bridge008";
const sip10Decimals = 1000000;
const stacksNetwork = "testnet";
const privateKey = process.env.STX_PRIVATE_KEY;
async function lockStx(amount) {
  const microStx = amount * sip10Decimals;
  // Part 1: Lock SIP-10 tokens on Stacks

  const lockOptions = {
    contractAddress: STACKS_BRIDGE_ADDRESS,
    contractName: STACKS_BRIDGE_NAME,
    functionName: "lock-stx",
    functionArgs: [Cl.uint(microStx)],
    senderKey: privateKey,
    validateWithAbi: true,
    network: stacksNetwork,
    postConditionMode: PostConditionMode.Allow,
    fee: 2000n,
  };

  const lockTx = await makeContractCall(lockOptions);
  const result = await broadcastTransaction(lockTx, stacksNetwork);

  //   console.log("stx tokens locked successfully. Tx hash:",result);
  if ("txid" in result) {
    const txid = result.txid;
    console.log("Stx lock TxID:", txid);

    await waitForTxConfirmation(txid, networkUrl);
  }
  // const solAmountToUnlock =await getConvertedAmount(txDetails.sip10Amount / sip10Decimals)

  return {
    result,
  };
}
async function callUnlockSTX(amount, lockId, recipient) {
  // const amount = Cl.uint(700000); // 0.7 STX in microstacks
  // const lockId = Cl.uint(2);
  // const recipient = principalCV("ST11SKCKNE62GT113W5GZP4VNB47536GFH9QWNJW2");
  const microStx = amount * sip10Decimals;
  const unlockOptions = {
    contractAddress: STACKS_BRIDGE_ADDRESS,
    contractName: STACKS_BRIDGE_NAME,
    functionName: "unlock-stx",
    functionArgs: [
      Cl.uint(microStx), // convert STX to microstacks
      Cl.uint(lockId),
      principalCV(recipient),
    ],
    senderKey: privateKey,
    validateWithAbi: true,
    network: stacksNetwork,
    postConditionMode: PostConditionMode.Allow,

    fee: 200000n,
  };
  const unlockTx = await makeContractCall(unlockOptions);
  const result = await broadcastTransaction(unlockTx, stacksNetwork);

  //   console.log("stx tokens locked successfully. Tx hash:",result);
  if ("txid" in result) {
    const txid = result.txid;
    console.log("Stx unlock TxID:", txid);

    await waitForTxConfirmation(txid, networkUrl);
  }
  // const solAmountToUnlock =await getConvertedAmount(txDetails.sip10Amount / sip10Decimals)

  return {
    result,
  };
}
// lockStx(2);
// callUnlockSTX(0.57, 1, "ST11SKCKNE62GT113W5GZP4VNB47536GFH9QWNJW2");
async function getUnlockById(lockId) {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: STACKS_BRIDGE_ADDRESS,
      contractName: STACKS_BRIDGE_NAME,
      functionName: "get-unlock-by-id",
      senderAddress: "ST11SKCKNE62GT113W5GZP4VNB47536GFH9QWNJW2",
      network: stacksNetwork,
      functionArgs: [uintCV(lockId)],
    });

    const readable = cvToJSON(result);
    console.log("Unlock details:", JSON.stringify(readable, null, 2));
  } catch (error) {
    console.error("Error calling get-unlock-by-id:", error);
  }
}

// getUnlockById(2);

async function getTotalUnlockedSTX() {
  const result = await callReadOnlyFunction({
    contractAddress: STACKS_BRIDGE_ADDRESS,
    contractName: STACKS_BRIDGE_NAME,
    functionName: "get-total-unlocked-stx",
    senderAddress: "ST11SKCKNE62GT113W5GZP4VNB47536GFH9QWNJW2",
    network: stacksNetwork,
    functionArgs: [],
  });

  const unlocked = cvToValue(result);
  console.log("Total Unlocked STX:", unlocked);
}

// getTotalUnlockedSTX();

async function getTotallockedSTX() {
  const result = await callReadOnlyFunction({
    contractAddress: STACKS_BRIDGE_ADDRESS,
    contractName: STACKS_BRIDGE_NAME,
    functionName: "get-total-locked-amount",
    senderAddress: "ST11SKCKNE62GT113W5GZP4VNB47536GFH9QWNJW2",
    network: stacksNetwork,
    functionArgs: [],
  });

  const unlocked = cvToValue(result);
  console.log("Total Unlocked STX:", unlocked);
}

// getTotallockedSTX();
async function withdrawStx(amount) {
  const microStx = amount * sip10Decimals;
  // Part 1: Lock SIP-10 tokens on Stacks

  const lockOptions = {
    contractAddress: STACKS_BRIDGE_ADDRESS,
    contractName: STACKS_BRIDGE_NAME,
    functionName: "withdraw-stx",
    functionArgs: [Cl.uint(microStx)],
    senderKey: privateKey,
    validateWithAbi: true,
    network: stacksNetwork,
    postConditionMode: PostConditionMode.Allow,
    fee: 2000n,
  };

  const lockTx = await makeContractCall(lockOptions);
  const result = await broadcastTransaction(lockTx, stacksNetwork);

  //   console.log("stx tokens locked successfully. Tx hash:",result);
  if ("txid" in result) {
    const txid = result.txid;
    console.log("Stx lock TxID:", txid);

    await waitForTxConfirmation(txid, networkUrl);
  }
  // const solAmountToUnlock =await getConvertedAmount(txDetails.sip10Amount / sip10Decimals)

  return {
    result,
  };
}
// withdrawStx(0.5);
