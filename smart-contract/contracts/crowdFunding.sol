// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract crowdFunding{
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        string imageUrl;
        uint256 amountContributed; 
        bool claimed;
        bool ended;
        address[] donors;
        mapping(address => uint256) contributions;
    }

    //Global variables && mapping
    uint256 public campaignCount;

    mapping(uint256 => Campaign) public Campaigns;

    //Events
    event ContractCreated(uint256 campaignId, address owner, string title, uint256 goal, uint256 deadline, string imageUrl);
    event CampaignContribution(uint256 campaignId, address owner, uint256 amount);
    event FundsClaimed(uint256 campaignId, address owner, uint256 amount);
    event FundsRefunded(uint256 campaignId, address contributor, uint256 amount);


    //modifier
    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId < campaignCount, "Campaign does not exist");
        _;
    }

    modifier beforeDeadline(uint256 _campaignId) {
        require(block.timestamp < Campaigns[_campaignId].deadline, "Campaign reached deadline");
        _;
    }

    modifier afterDeadline(uint256 _campaignId) {
        require(block.timestamp > Campaigns[_campaignId].deadline, "Campaign is still active");
        _;
    }

    //Functions

    function createCampaign( address _owner,
                            string memory _title,
                            string memory _description,
                            uint256 _goal,
                            uint256 _deadline,
                            string memory _imageUrl
                            ) 
                            public returns(uint256){

        require(_goal > 0, "Amount should be greater than zero");
        
        uint256 campaignId = campaignCount++;
        Campaign storage campaign = Campaigns[campaignId];

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.goal = _goal;
        campaign.deadline = _deadline;
        campaign.imageUrl = _imageUrl;
        campaign.amountContributed = 0;
        campaign.claimed = false;
        campaign.ended = false;

        emit ContractCreated(campaignId, _owner, _title, _goal, _deadline, _imageUrl);

        return campaignId;
    }

    function contributeToCampaign( uint256 _campaignId) payable public 
            campaignExists(_campaignId)
            beforeDeadline(_campaignId){

        uint256 amount = msg.value;        
        Campaign storage campaign = Campaigns[_campaignId];

        require(amount > 0, "Amount must be more than zero");

        if(campaign.contributions[msg.sender] == 0) {
            campaign.donors.push(msg.sender);
        }
        
        campaign.contributions[msg.sender] += amount;
        campaign.amountContributed += amount;

        emit CampaignContribution(_campaignId, msg.sender, amount);
    }

    function claimFund(uint256 _campaignId ) 
            payable public 
            campaignExists(_campaignId) 
            afterDeadline(_campaignId){

        Campaign storage campaign = Campaigns[_campaignId];

        require(!campaign.claimed, "Funds already claimed");
        require(msg.sender == campaign.owner, "Funds can only be claimed by the owner");
        require(campaign.amountContributed >= campaign.goal, "Goal not reached!");

        campaign.claimed = true;
        campaign.ended = true;

        payable(campaign.owner).transfer(campaign.amountContributed);

        emit FundsClaimed(_campaignId, campaign.owner, campaign.amountContributed);
    }

    function getRefund(uint256 _campaignId) payable public 
            campaignExists(_campaignId) 
            afterDeadline(_campaignId){

        Campaign storage campaign = Campaigns[_campaignId];

        require(!campaign.ended, "Funds already claimed");
        require(campaign.goal > campaign.amountContributed, "Goal amount reached");

        uint256 contributionAmount = campaign.contributions[msg.sender];
        require(contributionAmount > 0, "No contributio found");

        campaign.contributions[msg.sender] = 0;
        payable(msg.sender).transfer(contributionAmount);

        emit FundsRefunded(_campaignId, msg.sender, contributionAmount);
    }

    function getAllCampaigns() public view returns(
        address[] memory owners,
        string[] memory titles,
        string[] memory descriptions,
        string[] memory imageUrls,
        uint256[] memory goals,
        uint256[] memory deadlines,
        uint256[] memory amountsContributed,
        bool[] memory claimeds,
        bool[] memory endeds) {

        owners = new address[](campaignCount);
        titles = new string[](campaignCount);
        descriptions = new string[](campaignCount);
        imageUrls = new string[](campaignCount);
        goals = new uint256[](campaignCount);
        deadlines = new uint256[](campaignCount);
        amountsContributed = new uint256[](campaignCount);
        claimeds = new bool[](campaignCount);
        endeds = new bool[](campaignCount);
        
        for(uint256 i = 0; i < campaignCount; i++) {
            Campaign storage campaign = Campaigns[i];
            owners[i] = campaign.owner;
            titles[i] = campaign.title;
            descriptions[i] = campaign.description;
            imageUrls[i] = campaign.imageUrl;
            goals[i] = campaign.goal;
            deadlines[i] = campaign.deadline;
            amountsContributed[i] = campaign.amountContributed;
            claimeds[i] = campaign.claimed;
            endeds[i] = campaign.ended;
        }
    }

    function getDonatorDetails(uint256 _campaignId) public view 
        campaignExists(_campaignId) 
        returns (address[] memory donors, uint256[] memory amounts) {
        Campaign storage campaign = Campaigns[_campaignId];
        address[] memory donatorList = campaign.donors;
        uint256[] memory amountList = new uint256[](donatorList.length);
        
        // Populate the amounts array with corresponding contributions
        for(uint256 i = 0; i < donatorList.length; i++) {
            amountList[i] = campaign.contributions[donatorList[i]];
        }
        
        return (donatorList, amountList);
    }
}


//   function getDonators(uint256 _campaignId) public view 
//         campaignExists(_campaignId) 
//         returns (address[] memory) {

//         return Campaigns[_campaignId].donors;
//     }

//     function getContribution(uint256 _campaignId, address _contributor) public view 
//         campaignExists(_campaignId) 
//         returns (uint256) {

//         return Campaigns[_campaignId].contributions[_contributor];
//     }