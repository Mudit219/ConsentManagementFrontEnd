pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;
import "./ConsentFile.sol";

// /* 
//  * This is the consent factory contract that handles consents and version of
//  * consents.
//  *
//  * It basically provides an interface to be able to create consents based on
//  * a specific purpouse for a specific user. And always using the latest version
//  * and always puts newly generated consents into a persons consent file.
//  *
//  */

contract ConsentManagementSystem {

  
  /* The owner of this contract */
  address payable private owner;  /* Who owns this CMS*/
  address private creator; /* Who created this CMS */
  string  private company;  /* Company that created this CMS */
  
  enum Role {
    doctor,
    patient,
    nominee
  }

  mapping(address => address) Patients;
  mapping(address => address) Doctors;
  
  mapping(address => mapping(address => uint)) private ConnectionDoctorPatient;
  mapping(address => mapping(address => uint)) private ConnectionDoctorPatientInv;
  // mapping(address => mapping(address => Consent)) private ConsentDoctorPatient;
  // mapping(address => mapping(address => Consent)) private ConsentDoctorPatientInv;

  mapping(address => ConsentFile) UserToConsentFile;
  // mapping(address =>mapping(address => address)) PatientDoctorToConsentFile;
  
  
  /* Events generated when the consent has been created */
  event CMSConsentCreatedEvent(address indexed factory, address indexed owner, address indexed user, address file, address consent);
  event CMSFileCreatedEvent(address indexed factory, address indexed owner, address indexed user, address file);
  // event CMSFailedEvent(address indexed factory, address indexed owner, address indexed user, Error error);
  event CMSConsentStatusChangedEvent (address indexed factory, address indexed owner, address indexed user, Consent consent, Consent.Status status);
  
  /* A modifier */
  modifier onlyBy(address _account) 
  { 
    require(tx.origin == _account);
    _;
  }
  
  modifier PatientAccountExists(address _account)
  {
    require(Patients[_account] == _account);
    _;
  }

  modifier DoctorAccountExists(address _account)
  {
    require(Doctors[_account] == _account);
    _;
  }

  /* Constructor for the consent factory */
  constructor (string memory _company) public
  {
    owner = tx.origin;
    creator = msg.sender;
    company = _company;
  }
  function memcmp(bytes memory a, bytes memory b) internal pure returns(bool){
    return (a.length == b.length) && (keccak256(a) == keccak256(b));
  }
  function strcmp(string memory a, string memory b) internal pure returns(bool){
    return memcmp(bytes(a), bytes(b));
  }

  function AddNewUser(address payable _user,string memory role) onlyBy(owner) public {
    if(strcmp(role,"doctor")) {
      Doctors[_user] = _user;
      createConsentFile(_user,ConsentFile.Role.doctor);
    }
    else {
      Patients[_user] = _user;
      createConsentFile(_user,ConsentFile.Role.patient);
    }
  }

  function DoctorExists() DoctorAccountExists(tx.origin) public view returns(bool){
    return true;
  }


  function GetConsentFile() public view returns(ConsentFile) {
    return UserToConsentFile[tx.origin];
  }
  /* Create a file that holds a users all consents.
   * 
   * This is the file that holds all consents regardless of their state. Should have a modifier for the company.
   */
  function createConsentFile(address payable _user,ConsentFile.Role role) onlyBy(owner) public
  {
    ConsentFile file = new ConsentFile(_user,role,address(this));
    UserToConsentFile[_user] = file;
    // emit CMSFileCreatedEvent(address(this), owner, _user, file);
  }

  modifier ConnectionExists(address patient,address doctor) {
    require ((ConnectionDoctorPatient[patient][doctor] == 1) || (ConnectionDoctorPatientInv[patient][doctor] == 1));
    _;
  }
  
  /* Create a consent for a specific purpouse of the latest version, language and country.
   *
   * Country and Purpouse must exist otherwise it will fail, if language is not there it will
   * default to countrys default language if it exists otherwise it will fail. It adds
   * the consent to the users file as well. Should have a modifier for the company only.
   */

  function requestConsent(string memory requestedDesc,address fromPatient)  public{
    ConsentFile DoctorConsentFile = UserToConsentFile[tx.origin];
    ConsentFile PatientConsentFile = UserToConsentFile[fromPatient];

    Consent _consent;
    bool status;
    (status,_consent) = DoctorConsentFile.getAssociatedConsent(fromPatient);
    
    if(!status) {
      DoctorConsentFile.addConsent(_consent);
      PatientConsentFile.addConsent(_consent);
    }
    
    _consent.setRequestStatus(requestedDesc);
    
  }

  function GetConsents() public view returns(Consent[] memory) {
    ConsentFile UserConsents = UserToConsentFile[tx.origin];
    Consent[] memory _consents = UserConsents.getListOfConsents();
    return _consents;
  }

  function createConsent(address _doctor, string[] memory records) PatientAccountExists(tx.origin) DoctorAccountExists(_doctor) public
  {

    ConsentFile PatientConsentFile = UserToConsentFile[tx.origin];
    ConsentFile DoctorConsentFile = UserToConsentFile[_doctor];

    Consent _consent;
    bool state;
    (state,_consent) = PatientConsentFile.getAssociatedConsent(_doctor);

    if(!state) {
      PatientConsentFile.addConsent(_consent);
      DoctorConsentFile.addConsent(_consent);
    }

    _consent.setConsentedRecords(records);

  }
  
  /* This function tests wether a consent for a specific purpouse exists or not */
  // function getTemplate (string memory _purpouse, string memory _languageCountry) view internal returns (ConsentTemplate)
  // {
  //   /* Get the consents for a specific purpouse and language, country*/
  //   uint ix = consentTemplates[_purpouse][_languageCountry];
  //   if (ix == 0) {
      
  //     /* Fallback here is to only go for the default language of the country */
  //     /* So we need to strip the language from the country */
  //     bytes memory b = bytes (_languageCountry);
  //     if (b.length==5) {
	// if (uint8(b[2]) == 45) {
  //   	  bytes memory c = new bytes(2);
	  
	//   /* Get the country */
  //   	  c[0] = b[3];
  //   	  c[1] = b[4];
  //   	  ix = consentTemplates[_purpouse][string(c)];
  //   	}
  //     }
  //   }

  //   /* Return the consent template if we found any */
  //   if (ix>0)
  //     return ConsentTemplate(listOfActiveConsentTemplates[ix-1]);
  //   else
  //     return ConsentTemplate(address(0));
  // }

  // /* Change the status of the consent */
  // function setConsentStatus(Consent _consent, Consent.Status _status) onlyBy (_consent.getGiver()) public
  // {
  //   if(_status == Consent.Status.accepted || _status == Consent.Status.denied) {
  //     _consent.setStatus (_status);
  //     emit ConsentFactoryConsentStatusChangedEvent (address(this), _consent.getOwner(), _consent.getGiver(), _consent, _status);
  //   } else {
  //     emit ConsentFactoryFailedEvent (address(this), _consent.getOwner(), _consent.getGiver(), Error.only_accepted_or_denied);
  //   }
  // }
  
  // /* Cancel the consent */
  // function cancelConsent(Consent _consent) onlyBy (_consent.getOwner()) public
  // {
  //   _consent.cancel();
  //   emit ConsentFactoryConsentStatusChangedEvent (address(this), _consent.getOwner(), _consent.getGiver(), _consent, Consent.Status.cancelled);
  // }

  // /* The company who has this factory */
  // function getCompany() public view returns (string memory)
  // {
  //   return company;
  // }

  // /* Returns the owner for the factory */
  // function getOwner() public view returns (address)
  // {
  //   return owner;
  // }
  
  // /* Function to recover the funds on the contract */
  // function kill() public { if (msg.sender == owner) selfdestruct(owner); }
}

/*
 * END
 */