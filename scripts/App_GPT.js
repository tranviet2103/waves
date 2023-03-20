import React, { useEffect, useState } from "react"; // import React, useEffect and useState hooks from 'react' package
import { ethers } from "ethers"; // import ethers package
import abi from "./utils/WavePortal.json"; // import WavePortal contract ABI

export default function App() {
  const [currAccount, setCurrentAccount] = useState(""); // declare state variable for current account
  const [allWaves, setAllWaves] = useState([]); // declare state variable for all waves
  const [inputMessage, setInputMessage] = useState(""); // declare state variable for input message

  // create a function to check if the user has MetaMask installed
  const checkIfWalletIsConnected = async () => {
    try {
      // check if window.ethereum is defined
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask installed!");
        return;
      } else {
        console.log("We have the ethereum object: ", ethereum);
      }

      // check if the user is authorized to access the blockchain
      const accounts = await ethereum.request({ method: "eth_accounts" });

      // set the first authorized account as the current account
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // create a function to connect the user's MetaMask wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      // request access to the user's MetaMask wallet
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // create a function to handle form submission
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      // check if the user has entered a message
      if (!inputMessage) {
        alert("Please enter a message!");
        return;
      }

      // check if the user is authorized to access the blockchain
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveportalContract = new ethers.Contract(
          process.env.REACT_APP_CONTRACT_ADDRESS,
          abi.abi,
          signer
        );

        // send a transaction to the contract to create a new wave
        const waveTxn = await waveportalContract.wave(inputMessage, {
          gasLimit: 300000,
        });

        console.log("Mining...", waveTxn.hash);

        // wait for the transaction to be mined and then update the state
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        // clear the input message after the transaction has been mined
        setInputMessage("");
      } else {
        console.log("No ethereum object found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // create a function to fetch all waves from the contract
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web
