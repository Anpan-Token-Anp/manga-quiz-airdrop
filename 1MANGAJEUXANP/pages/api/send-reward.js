import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NextResponse } from "next/server";
import { ethers } from "ethers";

export async function POST(req) {
  const body = await req.json();
  const { address } = body;

  if (!address) {
    return NextResponse.json({ error: "Adresse manquante" }, { status: 400 });
  }

  try {
    const sdk = ThirdwebSDK.fromPrivateKey(
      process.env.PRIVATE_KEY,
      "mumbai",
      {
        secretKey: process.env.THIRDWEB_SECRET_KEY,
      }
    );

    const contract = await sdk.getContract(process.env.CONTRACT_ADDRESS);

    const amount = ethers.utils.parseUnits("10", 18); // 10 tokens

    await contract.erc20.transfer(address, amount);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur d'envoi de token:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

