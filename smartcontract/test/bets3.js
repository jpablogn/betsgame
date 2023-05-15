const hre = require("hardhat");

const PRICE = "0.001";

async function bet(contract, number){
  let tx = await contract.bet(number, {value: ethers.utils.parseEther(PRICE)});   
  await tx.wait();
  console.log('-> ', number);
}

async function main() {

  [owner, account1, account2, account3] = await hre.ethers.getSigners();

  const Bets = await hre.ethers.getContractFactory("Bets");
  const bets = Bets.attach(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3" // The deployed contract address
  );

  console.log("Live Address:\t" + bets.address);

  const [a, b] = await bets.connect(account3).getLastGameData();
  const a2 = parseInt(Number(a));

  console.log(a2, b);  

  // owner bets for: 0...10, 12...50  (se salta el 11)    
  let i=0;
  let contract = bets.connect(owner);
  for(i=0; i<51; i++){
    if (i!=11){
        await bet(contract, i);
    }
  }  

  // account 1 bets for: 50...99
  contract = bets.connect(account1);
  for(i=50; i<100; i++){
    await bet(contract, i);
  }

  // account 2 bets for: 0...49 => 11 winner 
  contract = bets.connect(account2); 
  for(i=0; i<50; i++){       
      await bet(contract, i);        
  }
  
  // account 3 bets for: 12...61
  contract = bets.connect(account3);
  for(i=12; i<62; i++){ 
    await bet(contract, i);
  }   

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Run test:
// npx hardhat run test/bets2.js --network localhost
