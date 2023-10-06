/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getPercent } from '../Util';

const apiUrl = "http://193.201.126.196/api/"
const ws = new WebSocket("wss://ws-feed.pro.coinbase.com");
const sellPercent = 1;

const Table = () => {
  const [tokens, setTokens] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    // console.log("here")
    const getData = async () => {
      const res = await axios.get(apiUrl + "getTokenList");
      setTokens(res.data.data);
      let tmpPairs = [];
      for (let i = 0; i < res.data.data.length; i++) {
        tmpPairs.push(`${res.data.data[i].symbol.toUpperCase()}-USD`);
      }
      setPairs(tmpPairs);      
    }
    getData();
  }, [refresh]);

  useEffect(() => {
    waitForSocketConnection(ws, () => {
      if (pairs.length > 0 && ws.readyState) {
        let msg = {
          type: "subscribe",
          product_ids: pairs,
          channels: ["ticker_batch"]
        };
        let jsonMsg = JSON.stringify(msg);
        ws.send(jsonMsg);
      }
    })
  }, [pairs]);

  useEffect(() => {
    if (tokens.length > 0) {
      ws.onmessage = (e) => {
        let data = JSON.parse(e.data);
        if (data.type !== "ticker" || data.product_id === undefined) {
          return;
        }
        const symbol = data.product_id.replace("-USD", "").toLowerCase();
        let tmpTokens = [...tokens];
        let selectedIndex = 0;
        tmpTokens.map((item, index) => {
          if (item.symbol === symbol) {
            selectedIndex = index;
          }
        });
        tmpTokens[selectedIndex].current_price = data.price;
        tmpTokens[selectedIndex].low_24h = data.low_24h;
        tmpTokens[selectedIndex].high_24h = data.high_24h;
        setTokens(tmpTokens);
      };
    }
  }, [tokens]);

  const waitForSocketConnection = (ws, callback) => {
    setTimeout(
        function(){
            if (ws.readyState === 1) {
                if(callback !== undefined){
                    callback();
                }
                return;
            } else {
                waitForSocketConnection(ws,callback);
            }
        }, 5);
  }

  const buyToken = async (tokenId, current_price) => {
    try {
      const res = await axios.post(apiUrl + "buyToken", { tokenId, current_price });
      setRefresh(!refresh)
    } catch (e) {
      console.log(e)
    }
  }
  const sellToken = async (tokenId, current_price) => {
    try {
      const res = await axios.post(apiUrl + "sellToken", { tokenId, current_price });
      setRefresh(!refresh)
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <>
      <table className="w-full text-sm text-left text-gray-400">
        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              coin
            </th>
            <th scope="col" className="px-6 py-3">
              current price
            </th>
            <th scope="col" className="px-6 py-3">
              buy price
            </th>
            <th scope="col" className="px-6 py-3">
              sell price
            </th>
            <th scope="col" className="px-6 py-3">
              lowest price(24h)
            </th>
            <th scope="col" className="px-6 py-3">
              highest price(24h)
            </th>
            <th scope="col" className="px-6 py-3">
              status
            </th>
            <th scope="col" className="px-6 py-3">
              profit
            </th>
            <th scope="col" className="px-6 py-3">
              profit %
            </th>
          </tr>
        </thead>
        <tbody>
            {tokens.map((token, index) => {
              return (
                <tr className="bg-gray-800 border-gray-700" key={index}>
                  <td className="px-6 py-4 text-white">
                    <div className="flex justify-start items-center">
                      <img src={token.image} alt="" className='w-[30px] mr-2'/>
                      <p className='font-medium'>{token.name.toUpperCase()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">
                    <p className="font-medium">${token.current_price}</p>
                  </td>
                  <td className="px-6 py-4 text-white">
                    <p className='font-medium'>{token.buy_price ? "$" + token.buy_price : "--"}</p>
                  </td>
                  <td className="px-6 py-4 text-white">
                    {(token.status === "sold") && (
                      <p className='font-medium'>{ "$" + token.sell_price }</p>
                    )}
                    {(!token.status || token.status === "bought") && (
                      <p className='font-medium'>--</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white"><p className='font-medium'>{"$" + token.low_24h}</p></td>
                  <td className="px-6 py-4 text-white"><p className='font-medium'>{"$" + token.high_24h}</p></td>
                  <td className="px-6 py-4 text-white">
                    {token.status === "bought" && (
                      <button className='text-white bg-red-700 hover:bg-red-800 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none' onClick={() => sellToken(token.id, token.current_price)}>Sell</button>
                    )}
                    {(!token.status || token.status=="sold") && (
                      <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none ' onClick={() => buyToken(token.id, token.current_price)}>Buy</button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {token.status === "bought" && (
                      <p className={`font-medium ${token.current_price - token.buy_price >= 0 ? 'text-green-500' : 'text-red-500'}`}>${Math.round((token.current_price - token.buy_price) * 10000) / 10000}</p>
                    )}
                    {token.status === "sold" && (
                      <p className={`font-medium ${token.sell_price - token.buy_price >= 0 ? 'text-green-500' : 'text-red-500'}`}>${Math.round((token.sell_price - token.buy_price) * 10000) / 10000}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {token.status === "bought" && (
                      <p className={`font-medium ${token.current_price - token.buy_price >= 0 ? 'text-green-500' : 'text-red-500'}`}>{Math.round(getPercent(token.buy_price, Math.round((token.current_price - token.buy_price) * 10000) / 10000) * 10000) / 10000}%</p>
                    )}
                    {token.status === "sold" && (
                      <p className={`font-medium ${token.sell_price - token.buy_price >= 0 ? 'text-green-500' : 'text-red-500'}`}>{Math.round(getPercent(token.buy_price, Math.round((token.sell_price - token.buy_price) * 10000) / 10000) * 10000) / 10000}%</p>
                    )}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </>
  )
};

export default Table;