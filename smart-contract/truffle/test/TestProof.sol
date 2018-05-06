import "truffle/Assert.sol"; 
import "truffle/DeployedAddresses.sol"; 
import "../contracts/Proof.sol"; 

contract TestProof { 
  function testFileHashOwnershipContract() { 
    Proof proof = Proof(DeployedAddresses.Proof()); 
    proof.set("TestUser", "FileHash");

    var (, owner)  = proof.get("FileHash");
    var ownerBytes23 = proof.stringToBytes32("TestUser");
    Assert.equal(owner, ownerBytes23, "File hash owner should be recorded in blockchain.");
  } 
}

