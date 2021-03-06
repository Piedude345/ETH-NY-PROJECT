import Axios from "axios";
/*

{
    "block_signed_at": "2022-06-24T16:10:24Z",
    "block_height": 15019128,
    "tx_hash": "0xe45d20cd9f2e7fd5360fae66bc5e8f9b27b8369f3b8f02f22b2b323f43b6f9c1",
    "tx_offset": 66,
    "successful": true,
    "from_address": "0xb5f1319d3f3eb4b091829fbd54426e4ba8440eaf",
    "from_address_label": null,
    "to_address": "0x9e96ba603b8eb6d47233dcc298a3623ca4e19cb7",
    "to_address_label": null,
    "value": "0",
    "value_quote": 0,
    "gas_offered": 46657,
    "gas_spent": 46346,
    "gas_price": 48279304481,
    "fees_paid": "2237552645476426",
    "gas_quote": 2.7538553540375807,
    "gas_quote_rate": 1230.744384765625,
    "log_events": [
        {
            "block_signed_at": "2022-06-24T16:10:24Z",
            "block_height": 15019128,
            "tx_offset": 66,
            "log_offset": 150,
            "tx_hash": "0xe45d20cd9f2e7fd5360fae66bc5e8f9b27b8369f3b8f02f22b2b323f43b6f9c1",
            "raw_log_topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x000000000000000000000000b5f1319d3f3eb4b091829fbd54426e4ba8440eaf",
                "0x000000000000000000000000d8791b6abdb7c5d564018ebb93ad8a092b1d8abd",
                "0x00000000000000000000000000000000000000000000000000000000000002b8"
            ],
            "sender_contract_decimals": 0,
            "sender_name": "2309-WhitelistAirdrop",
            "sender_contract_ticker_symbol": "2309-WhitelistAirdrop",
            "sender_address": "0x9e96ba603b8eb6d47233dcc298a3623ca4e19cb7",
            "sender_address_label": null,
            "sender_logo_url": "https://logos.covalenthq.com/tokens/1/0x9e96ba603b8eb6d47233dcc298a3623ca4e19cb7.png",
            "raw_log_data": null,
            "decoded": {
                "name": "Transfer",
                "signature": "Transfer(indexed address from, indexed address to, uint256 value)",
                "params": [
                    {
                        "name": "from",
                        "type": "address",
                        "indexed": true,
                        "decoded": true,
                        "value": "0xb5f1319d3f3eb4b091829fbd54426e4ba8440eaf"
                    },
                    {
                        "name": "to",
                        "type": "address",
                        "indexed": true,
                        "decoded": true,
                        "value": "0xd8791b6abdb7c5d564018ebb93ad8a092b1d8abd"
                    },
                    {
                        "name": "value",
                        "type": "uint256",
                        "indexed": false,
                        "decoded": false,
                        "value": null
                    }
                ]
            }
        }
    ]
}
*/

export interface TransactionReciept {
  to_address: string;
  from_address: string;
  log_events: [];
}
export interface TransactionResponseInterface {
  address: string;
  items: Array<TransactionReciept>;
}

const COVALENT_API_KEY = "ckey_831994ea5e524962bc9a27acfad";
//>>> curl -X GET https://api.covalenthq.com/v1/ENDPOINT/?key=API_KEY
const CHAIN_ID = 1;
const COVALENT_REQUEST_URI = "https://api.covalenthq.com/v1";
const COVALENT_BASE_URI = `${COVALENT_REQUEST_URI}/${CHAIN_ID}`;

/*Get transaction data from API*/
export const fetchTransactionData = async (address: string) => {
  const requestUri = `${COVALENT_BASE_URI}/address/${address}/transactions_v2/?key=${COVALENT_API_KEY}`;
  const response = await Axios.get(requestUri);

  console.log(response);
  return response.data.data as TransactionResponseInterface;
  //console.log(parsedResponse.items);
};
export interface addressMetadata {
  numberOfTransactions: number;
  isContract: boolean;
}

export interface pairTransactionData {
  block_signed_at: string;
  from_address: string;
  to_address: string;
  fees_paid: number;
  gas_price: number;
}

export interface TransactionArray extends Array<pairTransactionData> {}

/* Transcation map */
/* functionality: creates map of all transactions addressees and number of times transacted with */
export const parseIntoMap = (
  jsonResponse: TransactionResponseInterface,
  userAddress: string
) => {
  console.log("parseintoMap called");

  const transactionCountMap = new Map<string, addressMetadata>();
  //transaction map
  jsonResponse.items.forEach((o) => {
    //iterate through each transaction
    if (o.to_address != userAddress) {
      //initial user is sender
      const address = o.to_address; //get to_address of trxn
      const logEvents = o.log_events; //gets array of log events
      /* get transaction count */
      if (transactionCountMap.has(address)) {
        transactionCountMap.set(address, {
          numberOfTransactions:
            (transactionCountMap.get(address) as addressMetadata)
              .numberOfTransactions + 1,
          isContract: false,
        });
      } else {
        transactionCountMap.set(address, {
          numberOfTransactions: 1,
          isContract: false,
        });
      }
      //set isContract to be true if there is any info in log_events
      if (logEvents.length > 0) {
        transactionCountMap.set(address, {
          numberOfTransactions: (
            transactionCountMap.get(address) as addressMetadata
          ).numberOfTransactions,
          isContract: true,
        });
      }
    } else if (o.to_address == userAddress) {
      //initial user is recipient
      const address = o.from_address; //get to_address of trxn
      const logEvents = o.log_events; //gets array of log events
      /* get transaction count */
      if (transactionCountMap.has(address)) {
        transactionCountMap.set(address, {
          numberOfTransactions:
            (transactionCountMap.get(address) as addressMetadata)
              .numberOfTransactions + 1,
          isContract: false,
        });
      } else {
        transactionCountMap.set(address, {
          numberOfTransactions: 1,
          isContract: false,
        });
      }
    }
  });
  console.log(transactionCountMap); //output to console

  return transactionCountMap;
};

// export const parseTransactionList = (
//   jsonResponse: TransactionResponseInterface,
//   userAddress: string,
//   pairAddress: string
// ) => {
//     const transactionListMap = new Map<string, TransactionArray>();
//     jsonResponse.items.forEach((o) => {
//         if(o.from_address==)
//     }
// };
