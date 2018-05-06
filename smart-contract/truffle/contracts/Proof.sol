pragma solidity ^0.4.0;

contract Proof
{
    struct FileDetails
    {
        uint timestamp;
        bytes32 owner;
    }

    mapping (string => FileDetails) files;

    event logFileAddedStatus(bool status, uint timestamp, string owner, string fileHash);

    function set(string owner,string fileHash)
    {
        if (files[fileHash].timestamp == 0)
        {
            files[fileHash] = FileDetails(block.timestamp, stringToBytes32(owner));
            logFileAddedStatus(true, block.timestamp, owner, fileHash);
        }
        else
        {
            logFileAddedStatus(false, block.timestamp, owner, fileHash);
        }
    }

    function get(string fileHash) returns (uint timestamp, bytes32 owner)
    {
        return (files[fileHash].timestamp, files[fileHash].owner);
    }

    function stringToBytes32(string memory source) returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
}

