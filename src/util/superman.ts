import { Client as SpaceManClient } from "spaceman";
import { Client as ISSClient } from "iss";

export const Spaceman = new SpaceManClient({
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
  contractId: "CCORFIQVPI55SWQJXUHZCLXB5Q4FGU3LN222XGWMMUPKA7TPXJKBY6RV",
  publicKey: "GDXVLGC4FTGS4MXHTW2YQ3MRZPTTLS32UN35IM7LNGUIDYR6FZNAWREK",
});

export const ISS = new ISSClient({
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
  contractId: "CA6ADSUPRYDY6VCZIXNATWI37VYOKMEDWFJZN23DMRDZOKXNGQTGJ3I4",
  publicKey: "GDXVLGC4FTGS4MXHTW2YQ3MRZPTTLS32UN35IM7LNGUIDYR6FZNAWREK",
});

// Función para obtener los URIs de los tokens
const getTokenURIs = async () => {
  const tokenUris: { token_id: number; uri: string }[] = [];

  for (let i = 0; i < 6; i++) {
    try {
      const result = await Spaceman.token_uri({ token_id: i });
      const uri = result.result; // Asumo que 'result.result' contiene la URI

      tokenUris.push({ token_id: i, uri });
    } catch (error) {
      console.error("Error al obtener token_uri para token_id", i, error);
    }
  }

  // Ordenar por token_id
  const sortedTokenUris = tokenUris.sort((a, b) => a.token_id - b.token_id);

  return sortedTokenUris;
};

// Función para obtener el estado actual de la subasta (Highest Bid y Highest Bidder)
const getCurrentBidState = async () => {
  try {
    const highestBid = await ISS.get_current_highest_bid();
    const highestBidder = await ISS.get_current_highest_bidder();
    const tokenId = await ISS.get_current_token_id();

    const tokenUriResult = await Spaceman.token_uri({
      token_id: tokenId.result,
    });

    // Agrupar todos los datos en un objeto
    const bidState = {
      highestBid,
      highestBidder,
      tokenUri: tokenUriResult.result,
      tokenId,
    };

    return bidState;
  } catch (error) {
    console.error(
      "Error al obtener el estado de la subasta o el token_uri",
      error,
    );
  }
};

// Exportar ambas funciones
export default {
  getTokenURIs,
  getCurrentBidState,
};
