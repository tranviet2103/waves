import React, { useEffect, useState } from "react"; // import React, useEffect and useState hooks from 'react' package
import "./App.css";
import { ethers } from "ethers";  // import ethers package
import abi from "./utils/WavePortal.json"; // import WavePortal contract ABI


const getEthereumObject = () => window.ethereum; // A function that returns the Ethereum object from the browser window


 //This function returns the first linked account found. If there is no account linked, it will return null.
const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    /*
     * First make sure we have access to the Ethereum object.
     */
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }


    console.log("We have the Ethereum object", ethereum); //This line logs a message to the console indicating that the ethereum object was successfully retrieved from MetaMask


    const accounts = await ethereum.request({ method: "eth_accounts" }); //This line calls the request method on the ethereum object with the argument { method: "eth_accounts" }. This sends a JSON-RPC request to the Ethereum provider (e.g. MetaMask), asking for the list of Ethereum accounts that the user has authorized the dApp to access. The await keyword is used to pause execution of the function until a response is received from the Ethereum provider.





//This block checks if the accounts array returned from the Ethereum provider is not empty. If it is not empty, the first account in the array is selected and logged to the console. This account is then returned. If the accounts array is empty, an error message is logged to the console and null is returned.
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }


    
  //This block catches any errors that occur during the execution of the try block. If an error occurs, it is logged to the console and null is returned  
  } catch (error) {
    console.error(error);
    return null;
  }
};



// App function
function App() {
  const [currentAccount, setCurrentAccount] = useState(""); // declare state variable for current account
  
  const [allWaves, setAllWaves] = useState([]); // declare state variable for all waves

  const [totalWaves, setTotalWaves] = useState(0); // declare state variable for total waves

  const [totalTransactions, setTotalTransactions] = useState(0); //Define a state variable for the total number of transactions:

  
  //const contractAddress = "0x94b81A63b2BBa1cC75F50F64cd77FceBbc138237"; //Create a variable here that holds the contract address after you deploy!
    const contractAddress = "0x12160f0231bd3e6cd044E64c339ec3190363F6d3"; //Create a variable here that holds the contract address after you deploy!
  
  
  const contractABI = abi.abi; //Create a variable here that references the abi content!





  //Create a method that gets all waves from your contract
  const getAllWaves = async () => {
   
    //This block of code checks if the window object contains the ethereum property. If it does, it means that the user has a compatible Ethereum wallet installed and connected to their browser. The ethereum object is then destructured from the window object for convenience.
    try {
      const { ethereum } = window;
      if (ethereum) {
       
        //These lines use the ethers.js library to create an Ethereum provider and signer object, and a contract instance that is connected to the provider and signer. The contractAddress and contractABI variables are passed to the Contract constructor to specify the address and ABI of the smart contract.
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      
        //This line calls the getAllWaves method of the smart contract using the contract instance created earlier, and stores the returned waves data in a variable called waves. The await keyword is used to wait for the method call to complete before proceeding with the next line of code.   
        const waves = await wavePortalContract.getAllWaves();

        // get the total number of waves
        const numWaves = waves.length;

         // update the state of totalWaves
        setTotalWaves(numWaves);
        
        //These lines process the raw wave data returned from the smart contract and transform it into a more readable format that contains only the necessary information (the waver's address, timestamp, and message). The processed data is stored in an array called wavesCleaned.
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
        
        //This line calls the setAllWaves function, which is a React state setter function that updates the component's state with the new data. The wavesCleaned data is passed to this function to update the state with the latest waves data.
        setAllWaves(wavesCleaned);
       
      } else {
        console.log("Ethereum object doesn't exist!")
      }

      //This block of code handles any errors that may occur during the function execution and logs them to the console for debugging purposes.
    } catch (error) {
      console.log(error);
    }
  }


  



  //defines an async function called connectWallet that is used to connect to a user's Ethereum wallet using MetaMask
  const connectWallet = async () => { //This declares a new connectWallet function as an async function.

    try {
      const ethereum = getEthereumObject(); //This line calls the getEthereumObject function to retrieve the ethereum object from the MetaMask browser extension.

      //This checks whether the ethereum object exists. If it does not exist, an alert is displayed asking the user to install the MetaMask extension, and the function returns.
      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      //This line prompts the user to connect their MetaMask wallet to the dApp, and returns the list of connected accounts. The await keyword is used to wait for the ethereum.request function to finish before moving on to the next line of code.
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      
      console.log("Connected", accounts[0]);//This logs the first account in the accounts array to the console.
     
      setCurrentAccount(accounts[0]);//This sets the currentAccount state variable to the first account in the accounts array.
      
    } catch (error) {
      console.error(error);
    }
  };


  
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      
        /*
        * Execute the actual wave from your smart contract
        */
        //const waveTxn = await wavePortalContract.wave("this is a message from Simon1993 - a Great Blockchain developer");
        const waveTxn = await wavePortalContract.wave(document.getElementById('message_input').value);

        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
         
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}

//Create a function to fetch the total number of transactions. In this example, the getTotalTransactions function uses ethers.js library to interact with the smart contract and call the getTotalWaves method to fetch the total number of transactions. Once the total number is fetched, it updates the state using the setTotalTransactions method.
  const getTotalTransactions = async () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, provider);

    const totalTxnCount = await wavePortalContract.getTotalWaves();
    setTotalTransactions(totalTxnCount.toNumber());
  } else {
    console.log("Ethereum object doesn't exist!");
  }
};



  //Call the getTotalTransactions function to fetch the total number of transactionn. You can call the getTotalTransactions function in the useEffect hook to fetch the total number of transactions when the component is mounted:
  useEffect(() => {
  getTotalTransactions();
  }, []);

  useEffect(() => {
    // call the getAllWaves method when the component mounts
    getAllWaves();
  }, []);
  
   //This runs our function when the page loads. More technically, when the App component "mounts".
  useEffect(async () => {
    const account = await findMetaMaskAccount();
    if (account !== null) {
      setCurrentAccount(account);
    }
  }, []);


  /**
 * Listen in for emitter events!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);
  

    //<div class='container'>    
    //<input type='text' id='message_input' />      
    //</div> 

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header" style={{color: 'red'}}>
          👋 Hey there!
        </div>


    <div className="bio" style={{ 
      textAlign: 'center', 
      fontFamily: 'Calibri', 
      fontSize: '20px', 
      fontWeight: 'bold', 
      color: '#0074D9', 
      marginBottom: '20px' 
    }}>
      Hello, I'm Alex, This is my first web3 page on the Internet. Connect your  wallet and wave to me 😊
    </div>

 

    <textarea type='text' id='message_input' rows="5" cols="30" ></textarea>
    

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

    <h4>Total Transactions: {totalTransactions}</h4> 

    <table>
      <thead>
        <tr>
          <th>Address</th>
          <th>Timestamp</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {allWaves.map((wave, index) => (
          <tr key={index}>
            <td>{wave.address}</td>
            <td>{wave.timestamp.toString()}</td>
            <td>{wave.message}</td>
          </tr>
        ))}
      </tbody>
    </table>

            
        
      </div>
    </div>

    
  );


};

export default App;