/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from 'axios';
import { apiUrl } from "../Config";

const Setting = () => {
  const [tokens, setTokens] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [sellPercent, setSellPercent] = useState(10);
  useEffect(() => {
    // console.log("here")
    const getData = async () => {
      const res = await axios.get(apiUrl + "getTokenList");
      setTokens(res.data.data);
    }
    const getConfigData = async () => {
      const res = await axios.get(apiUrl + "getConfig");
      setSellPercent(res.data.sellPercent);
    }
    getData();
    getConfigData();
  }, [refresh]);

  const setTokenScore = (value, index) => {
    console.log(value, index)
    const tmpTokens = [...tokens];
    for (let i = 0; i < tmpTokens.length; i++) {
      if (tmpTokens[i]._id === index) {
        tmpTokens[i].score = value;
      }
    }
    setTokens(tmpTokens);
  }

  const updateScore = async (index) => {
    try {
      await axios.post(apiUrl + "/setScore", { selectedToken: tokens[index] })
      setRefresh(!refresh);
    } catch (e) {
      console.log(e)
    }
  }

  const updateSellPercent = async () => {
    try {
      await axios.post(apiUrl + "/setSellPercent", { value: sellPercent })
      setRefresh(!refresh);
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div className="text-center">
        <p className='text-2xl text-white pb-5'>Setting</p>
      </div>
      <div className="grid grid-cols-2 gap-4 pb-5 items-center">
        <div className="grid grid-cols-6 gap-4">
          <div><label className="block mb-2 text-sm font-medium text-white text-left">Sell Percent</label></div>
          <div className="col-span-4">
            <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={sellPercent} onChange={(e) => setSellPercent(e.target.value)} />
          </div>
          <div>
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={updateSellPercent}>Update</button>
          </div>
        </div>
        <div className="..."></div>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                coin
              </th>
              <th scope="col" className="px-6 py-3">
                score
              </th>
              <th scope="col" className="px-6 py-3">
                action
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
                    <input type="number" className="w-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={token.score} onChange={(e) => setTokenScore(e.target.value, token._id)} />
                  </td>
                  <td className="px-6 py-4 text-white">
                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => {updateScore(index)}}>Update</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      </>
  )
}

export default Setting;