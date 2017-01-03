pragma solidity ^0.4.0;

contract LotteryService {
  // 此合約的擁有者
  address public creator;
  uint8 constant etherPerBet = 10;
  //每一注為5個數字
  struct Bet {
    uint8 num1;
    uint8 num2;
    uint8 num3;
    uint8 num4;
    uint8 num5;
    uint timestamp; //下注時間
    bool draw; //是否完成開獎
  }
  // 記錄每個帳號下注的資料
  mapping (address => Bet[]) private players;

  //事件們
  event BettingSuccess(address player, uint timestamp);
  event BettingFailed(address player, string msg, uint timestamp);
  event BetLog(address player, uint8 num1, uint8 num2, uint8 num3, uint8 num4, uint8 num5, uint timestamp, bool draw);

  //建構子
  function LotteryService() {
    creator = msg.sender;
  }

  function betting(uint8[5] num) payable{
    if ((msg.value / 1 ether) == etherPerBet) {
      quickSort(num, 0, num.length - 1);

      players[msg.sender].push(Bet({
        num1: num[0],
        num2: num[1],
        num3: num[2],
        num4: num[3],
        num5: num[4],
        timestamp: now,
        draw: false,
      }));

      BettingSuccess(msg.sender, now);
    } else {
      if ((msg.value / 1 ether) > etherPerBet) {
        BettingFailed(msg.sender, "下注金額過多", now);
      } else {
        BettingFailed(msg.sender, "下注金額不足", now);
      }
    }
  }

  function checkBetLog(){
    Bet[] allBets = players[msg.sender];

    for(var i = 0 ; i < allBets.length ; i++){
      Bet bet = allBets[i];
      BetLog(msg.sender, bet.num1, bet.num2, bet.num3, bet.num4, bet.num5, bet.timestamp, bet.draw);
    }
  }

  //排序下注數字， 小 ~ 大
  function quickSort(uint8[5] arr, uint left, uint right) internal {
    uint i = left;
    uint j = right;
    uint pivot = arr[left + (right - left) / 2];
    while (i <= j) {
      while (arr[i] < pivot) i++;
      while (pivot < arr[j]) j--;
      if (i <= j) {
        (arr[i], arr[j]) = (arr[j], arr[i]);
        i++;
        j--;
      }
    }
    if (left < j)
      quickSort(arr, left, j);
    if (i < right)
      quickSort(arr, i, right);
  }

  // 結束合約，將餘額轉給建立者
  function remove() {
    if(msg.sender == creator) {
        selfdestruct(creator);
    }
  }
}