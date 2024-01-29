//SPDX-License-Identifier:MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMinter is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;


    Counters.Counter _tokenIds;
    address public admin;
    address public Owner;

    struct RenderToken{
        uint256 id;
        string uri;
    }

    mapping(uint256 => string)public _tokenURIs;
    mapping(uint => bool)public isCertificateValid;
    constructor(address _admin) ERC721("Probinar", "PRO"){
        admin=_admin;
        Owner=msg.sender;
    }

    modifier OnlyOwner(){
        require(msg.sender==Owner,"Only admin can perform this function");
        _;
    }

    function setTokenURI(uint tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId]=_tokenURI;
    }

    function mintNFT(address recepient , string memory uri) public returns(uint256){
        require(msg.sender==admin,"only admin can Mint NFT Certification");
        uint256 newId= _tokenIds.current();
        _mint(recepient,newId);
        _tokenIds.increment();
        setTokenURI(newId, uri);
        isCertificateValid[newId]=true;
        return newId;

    }

    function tokenURI(uint CertificationID) public view virtual override returns(string memory){
        require(isCertificateValid[CertificationID],"Certification ID not exist");
        return _tokenURIs[CertificationID];
    }

    function getAllToken() public view returns(RenderToken[] memory){
        uint256 latestID = _tokenIds.current();
        uint256 counter=0;
        RenderToken[] memory res= new RenderToken[](latestID);
        for(uint256 i=0;i<latestID;i++){
            if(isCertificateValid[counter]){
                string memory uri = tokenURI(counter);
                res[counter] = RenderToken(counter, uri);
            }
            counter++;
        }
        return res;

    }

    

    function changeAdmin(address _admin) external OnlyOwner returns(address) {
        admin=_admin;
        return admin;
    }
}