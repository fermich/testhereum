var ProofContract = artifacts.require("./Proof.sol"); 

module.exports = function(deployer) { 
	  deployer.deploy(ProofContract); 
};

