pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

contract ConsentTemplate {

  address private patient;      /* Creator of this template */
  address private doctor;      /* Creator of this template */  
  string[]  private recordIds;     /* What purpouse the template is for */
  string  private requestedRecordDesc;        /* The title of the consent */
  uint8 version;

  /* Creates the contract and set the values of the contract. */
  constructor (address _patient, address _doctor) public 
  {
    patient = _patient;
    doctor = _doctor;
    // recordIds = [];
    requestedRecordDesc = "";
    version = 0;
  }

  /* A modifier */
  modifier onlyByDoctor()
  {
    require(tx.origin == doctor);
    _;
  }

   modifier onlyByBoth()
    {
      require((doctor == tx.origin) || (patient == tx.origin));
      _;
    }

  modifier onlyByPatient()
  {
    require(tx.origin == patient);
    _;
  }

  function SettingRequestedDesc(string memory desc) onlyByDoctor() public{
    requestedRecordDesc = desc;
  }

  function setConsentedRecords(string[] memory _recordIds) onlyByPatient() public {
    recordIds = _recordIds;
  }

  /* Set of getters for the contract */
  function GetConsentedRecords()  onlyByBoth()  public view returns(string[] memory)
  {
    return recordIds;
  }

  function GetRequestedDesc() onlyByBoth() public view returns  (string memory)
  {
    return requestedRecordDesc;
  }
  
}
