pragma solidity ^0.4.2;

contract TheLotteryGaming {

  address public owner;

  struct Bet {
    uint8[5] Nums;
    bool Drawn;  //default is false
  }

  struct Category {
    uint Bingo1;
    uint Bingo2;
    uint Bingo3;
    uint Bingo4;
    uint Bingo5;    
    uint8 WinningNum1;
    uint8 WinningNum2;
    uint8 WinningNum3;
    uint8 WinningNum4;
    uint8 WinningNum5;
    uint PriceOfTicket;
    mapping(address => Bet) nBet;
  }

  Category public nCategory;

  function TheLotteryGaming()
  {
    owner=msg.sender;
  }

  modifier OnlyOwner()
  { //Modifier
    if (msg.sender != owner) throw;
    _;
  }

  function next_draw(uint priceofticket, uint nBingo1, uint nBingo2, uint nBingo3, uint nBingo4, uint nBingo5)
    OnlyOwner
    {
      nCategory.PriceOfTicket=priceofticket;
      nCategory.Bingo1=nBingo1;
      nCategory.Bingo2=nBingo2;
      nCategory.Bingo3=nBingo3;
      nCategory.Bingo4=nBingo4;
      nCategory.Bingo5=nBingo5;// first prize
      NewDrawReadyToPlay(priceofticket, nBingo5);  //event
    }


  function announce_numbers(uint8 no1, uint8 no2, uint8 no3, uint8 no4, uint8 no5)
    OnlyOwner
    {
      nCategory.WinningNum1 = no1;
      nCategory.WinningNum2 = no2;
      nCategory.WinningNum3 = no3;
      nCategory.WinningNum4 = no4;
      nCategory.WinningNum5 = no5;
      DrawReadyToPayout(no1, no2, no3, no4, no5); //event
    }

  function Play(uint8 MyNum1, uint8 MyNum2, uint8 MyNum3, uint8 MyNum4, uint8 MyNum5)
  {
    if(msg.value != nCategory.PriceOfTicket || //to play you need to pay 
      nCategory.nBet[msg.sender].Nums[4] != 0) //if your bet already exist
      throw;

    nCategory.nBet[msg.sender].Nums[0]=MyNum1;
    nCategory.nBet[msg.sender].Nums[1]=MyNum2;
    nCategory.nBet[msg.sender].Nums[2]=MyNum3;
    nCategory.nBet[msg.sender].Nums[3]=MyNum4;
    nCategory.nBet[msg.sender].Nums[4]=MyNum5;
    nCategory.nBet[msg.sender].Drawn=true;  
  }
  
  function WithDraw() payable 
  {
    if(msg.value!=0)
      throw;
      //return false;

    if(nCategory.nBet[msg.sender].Drawn==false)
      throw;  //throw if player did not played
      //return false;

    //default is equal to 0
    if(nCategory.WinningNum5==0)
      throw;  //check if the numbers were announced
      //return false;
    
    uint256 WinningMoney=0;
    uint8 hits=0;
    uint8 i=0;
    uint8 j=0;
    uint8[5] memory playernum=nCategory.nBet[msg.sender].Nums;
    uint8[5] memory winningnum;
    (winningnum[0], winningnum[1], winningnum[2], winningnum[3], winningnum[4])=
    (nCategory.WinningNum1, nCategory.WinningNum2, nCategory.WinningNum3, nCategory.WinningNum4, nCategory.WinningNum5);
    
    while(i<5)  //count player hits
      { 
        while(j<5) ++j;
        if(j==5) break; //break loop here becouse there is nothing more to check
        if(playernum[j] == winningnum[i]) ++hits;
        ++i;
      }

    if(hits==0)
      throw;

    if(hits==1) WinningMoney=nCategory.Bingo1;
    if(hits==2) WinningMoney=nCategory.Bingo2;
    if(hits==3) WinningMoney=nCategory.Bingo3;
    if(hits==4) WinningMoney=nCategory.Bingo4;
    if(hits==5) WinningMoney=nCategory.Bingo5;

    nCategory.nBet[msg.sender].Drawn=false;

    if(!msg.sender.send(WinningMoney)) //payment
      throw;

    PlayerWon(WinningMoney); //event
    //return true;
  }

function MyBet(address PlayerAddress) constant returns (uint8[5] Nums)
{ //check your nums
  return nCategory.nBet[PlayerAddress].Nums;
}

event NewDrawReadyToPlay(uint PriceOfTicketInWei, uint WeiToWin);
event DrawReadyToPayout(uint8 WinningNumber1, uint8 WinningNumber2, uint8 WinningNumber3, uint8 WinningNumber4, uint8 WinningNumber5);
event PlayerWon(uint Wei);

}//contract end