//load contract ABI:
var contractFactory = eth.contract([{"constant":false,"inputs":[{"name":"fileHash","type":"string"}],"name":"get","outputs":[{"name":"timestamp","type":"uint256"},{"name":"owner","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"string"},{"name":"fileHash","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"bool"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"owner","type":"string"},{"indexed":false,"name":"fileHash","type":"string"}],"name":"logFileAddedStatus","type":"event"}])

//load contract bytecode:
var proofCompiled = "0x" + "6060604052341561000f57600080fd5b6107a58061001e6000396000f30060606040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063693ec85e14610051578063e942b5161461012e575b600080fd5b341561005c57600080fd5b6100ac600480803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506101ce565b6040518083815260200180602001828103825283818151815260200191508051906020019080838360005b838110156100f25780820151818401526020810190506100d7565b50505050905090810190601f16801561011f5780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b341561013957600080fd5b6101cc600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061035a565b005b60006101d86106c0565b6000836040518082805190602001908083835b60208310151561021057805182526020820191506020810190506020830392506101eb565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600001546000846040518082805190602001908083835b60208310151561027f578051825260208201915060208101905060208303925061025a565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600101808054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561034a5780601f1061031f5761010080835404028352916020019161034a565b820191906000526020600020905b81548152906001019060200180831161032d57829003601f168201915b5050505050905091509150915091565b600080826040518082805190602001908083835b602083101515610393578051825260208201915060208101905060208303925061036e565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060000154141561059d576040805190810160405280428152602001838152506000826040518082805190602001908083835b60208310151561041d57805182526020820191506020810190506020830392506103f8565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000820151816000015560208201518160010190805190602001906104769291906106d4565b509050507f0d3bbc3c02da6ed436712ca1a0f626f1269df703a105f034e4637c7b10fb7ba5600142848460405180851515151581526020018481526020018060200180602001838103835285818151815260200191508051906020019080838360005b838110156104f45780820151818401526020810190506104d9565b50505050905090810190601f1680156105215780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b8381101561055a57808201518184015260208101905061053f565b50505050905090810190601f1680156105875780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390a16106bc565b7f0d3bbc3c02da6ed436712ca1a0f626f1269df703a105f034e4637c7b10fb7ba5600042848460405180851515151581526020018481526020018060200180602001838103835285818151815260200191508051906020019080838360005b838110156106175780820151818401526020810190506105fc565b50505050905090810190601f1680156106445780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b8381101561067d578082015181840152602081019050610662565b50505050905090810190601f1680156106aa5780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390a15b5050565b602060405190810160405280600081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061071557805160ff1916838001178555610743565b82800160010185558215610743579182015b82811115610742578251825591602001919060010190610727565b5b5090506107509190610754565b5090565b61077691905b8082111561077257600081600090555060010161075a565b5090565b905600a165627a7a723058204b80da4177b5b37d6b59afb1c22073588a9ab1a3a34f90990bd15b6d643db3830029"

//unlock default user:
web3.eth.defaultAccount = web3.eth.accounts[0];
personal.unlockAccount(web3.eth.defaultAccount);

//start miner to create contract:
miner.start();

//estimate gas usage:
var contractData = contractFactory.new.getData({data: proofCompiled});
var gasUsageEstimate = web3.eth.estimateGas({data: contractData})

//deploy:
var deployedContract = contractFactory.new({from:eth.accounts[0],data:proofCompiled,gas:gasUsageEstimate}, function(e, contract) {
  if(!e) {
    if(!contract.address) {
      console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
    } else {
      console.log("Contract mined! Address: " + contract.address);
      console.log(contract);
    }
  }
})

//stop miner when contract is ready:
miner.stop();

//get another instance by address known to others:
var proofInstance = contractFactory.at(deployedContract.address);

//register event listener:
proofInstance.logFileAddedStatus().watch(function(error, result) { 
  if(!error) { 
    if(result.args.status) { 
      console.log("Contract result: " + result); 
    } else {
      console.log("Contract error: + error");
    }}});

//run transaction:
proofInstance.set.sendTransaction("OwnerName", "0x666", {from:eth.accounts[0]}, function(err, transactionHash) {
  if (!err) console.log(transactionHash); 
});

//run miner to add the transacion to blockchain:
miner.start()

//find owner in blockchain via direct call to ethereum node:
proofInstance.get.call("0x666");

//stop miner if the transaction record is in blockchain
miner.stop()

//check the block the transaction has been committed:
eth.getTransaction("0x955421475cc75439ae6e2e67487306db843c9f61a0937d302eeec6d98ad79ecc");

