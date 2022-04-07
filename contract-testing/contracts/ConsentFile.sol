pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;
import "./Consent.sol";

contract ConsentFile {

  address CMS;

  /* The owner of the file */
  address private user;
  
  enum Role {
    doctor,
    patient,
    nominee
  }
  

  Role private role;

  /* The list of all consents */
  Consent[] private listOfConsents;

  /* Events that are sent when things happen */
  event ConsentFileConsentAdded(address indexed file, address indexed user, Role indexed role, address consent);

  /* A modifier */
  modifier onlyByUser()
  {
    require(tx.origin == user);
    _;
  }
  
  modifier CMSorUser()
  {
    require ((tx.origin == user) || (msg.sender == CMS));
    _;
  }

  /* The constructor of the file. Also attaches it to an owner */
  constructor (address _user,Role _role,address _CMS) public
  {
    CMS = _CMS;
    user = _user;
    role = _role;
  }

  /* Adds a new consent to the file */
  function addConsent(Consent _consent) CMSorUser() public 
  {
    listOfConsents.push(_consent);
    emit ConsentFileConsentAdded(address(this), user, role, address(_consent));
  }

  /* Retrieve a list of all consents in the file */
  function getListOfConsents () onlyByUser() public view returns (Consent[] memory)
  {
    return listOfConsents;
  }

  /* Retrieves the owner */
  function getOwner () public view returns (address)
  {
    return user;
  }
  
}
