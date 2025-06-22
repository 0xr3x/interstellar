import { Client as SpaceManClient } from "spaceman";
import { Client as ISSClient } from "iss";

const Spaceman = new SpaceManClient({
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
  contractId: "CCORFIQVPI55SWQJXUHZCLXB5Q4FGU3LN222XGWMMUPKA7TPXJKBY6RV",
});

const ISS = new ISSClient({
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
  contractId: "CC4XOC2WQ6GQK7RQ3Q3DYIORMUTRP6CU7VWKVJWRE3HBUJY27GSFDWHR",
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
