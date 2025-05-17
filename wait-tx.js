export async function waitForTxConfirmation(txid, networkUrl) {
  const url = `${networkUrl}/extended/v1/tx/${txid}`;

  while (true) {
    const res = await fetch(url);
    const data = await res.json();

    if (data.tx_status === "success") {
      console.log("✅ Transaction confirmed!");
      break;
    } else if (
      data.tx_status === "abort_by_response" ||
      data.tx_status === "abort_by_post_condition" ||
      data.tx_status === "rejected"
    ) {
      console.error("❌ Transaction failed:", data.tx_status, data);
      break;
    } else {
      console.log("⏳ Still pending... waiting...");
      await new Promise((resolve) => setTimeout(resolve, 10000)); // wait 10 seconds
    }
  }
}
