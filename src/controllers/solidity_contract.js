// call smart contract
const Web3 = require('web3')
const fs = require('fs');
const solc = require('solc');

const buildContract = async(req,res,next) => {
    try{
        // // infura url
        // const url = 'https://rinkeby.infura.io/v3/34e4897b55e344b79a408be52ff87712'

        // // local url
        const url = 'http://127.0.0.1:9545/'
        const web3 = new Web3(url)

        // source to load the contract
        const source = fs.readFileSync('./contracts/lottery.sol', "utf8");

        // input config fro solc to build the contract
        const input = {
        language: "Solidity",
        sources: {
            'lottery.sol': {
            content: source,
            },
        },
        settings: {
            outputSelection: {
            "*": {
                "*": ["*"],
            },
            },
        },
        };

        // etract the abi and evm form builded contract
        const {abi,evm} = JSON.parse(solc.compile(JSON.stringify(input))).contracts['lottery.sol'].Lottery

        // local account
        const accounts = await web3.eth.getAccounts();
        
        // conctract
        const contract = new web3.eth.Contract(abi);
        // set evm data to the contract
        contract.options.data = evm.bytecode.object;

        // to deploy the contract to the block network
        const deployTx = contract.deploy();
        const deployedContract = await deployTx.send({
            from: accounts[0],
            gas: await deployTx.estimateGas() + 100000,
        }).once("transactionHash", (txhash) => {
            console.log(`Mining deployment transaction ...`);
            console.log(txhash);
        });

        return res.send(`Contract deployed at ${deployedContract.options.address}`)
    }
    catch(err){
        console.error(err)
        return res.send(err)
    }
}

const enterTheLotteryGame = async(req,res,next) => {
    try{
        // // infura url
        // const url = 'https://rinkeby.infura.io/v3/34e4897b55e344b79a408be52ff87712'

        //local node url
        const url = 'http://127.0.0.1:9545/'

        const web3 = new Web3(url)

        // source to load the contract
        const source = fs.readFileSync('./contracts/lottery.sol', "utf8");

        // input config fro solc to build the contract
        const input = {
        language: "Solidity",
        sources: {
            'lottery.sol': {
            content: source,
            },
        },
        settings: {
            outputSelection: {
            "*": {
                "*": ["*"],
            },
            },
        },
        };

        // etract the abi and evm form builded contract
        const {abi} = JSON.parse(solc.compile(JSON.stringify(input))).contracts['lottery.sol'].Lottery

        //conctract
        const contract = new web3.eth.Contract(abi,'0xf20345709843C20B7b86c8Bfd7813a1f9eFC12ac');

        // accounts
        const accounts = await web3.eth.getAccounts();

        const entered = await contract.methods.enter().send({from:accounts[0],value:10000000000000000})

        console.log(entered)

        return res.send(entered)
    }
    catch(err){
        console.error(err)
        return res.send(err)
    }
}

const getPlayers = async(req,res,next) => {
    try{
        // // infura url
        // const url = 'https://rinkeby.infura.io/v3/34e4897b55e344b79a408be52ff87712'

        //local node url
        const url = 'http://127.0.0.1:9545/'

        const web3 = new Web3(url)

        // source to load the contract
        const source = fs.readFileSync('./contracts/lottery.sol', "utf8");

        // input config fro solc to build the contract
        const input = {
        language: "Solidity",
        sources: {
            'lottery.sol': {
            content: source,
            },
        },
        settings: {
            outputSelection: {
            "*": {
                "*": ["*"],
            },
            },
        },
        };

        // etract the abi and evm form builded contract
        const {abi} = JSON.parse(solc.compile(JSON.stringify(input))).contracts['lottery.sol'].Lottery

        //conctract
        const contract = new web3.eth.Contract(abi,'0xf20345709843C20B7b86c8Bfd7813a1f9eFC12ac');

        const players = await contract.methods.getPlayers().call()

        console.log(players)
        
        return res.send(players)
    }
    catch(err){
        console.error(err)
        return res.send(err)
    }
}

module.exports = {
    buildContract,
    enterTheLotteryGame,
    getPlayers
}