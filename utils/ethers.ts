import { ethers } from 'ethers';
import { abi, address as contractAddress } from '../abis/MyGasslessToken.json';

const ownerPrivateKey = process.env.OWNER_PRIVATE_KEY || '';
const spenderPrivateKey = process.env.SPENDER_PRIVATE_KEY || '';

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545');

// 토큰의 소유권을 가지고 있는 계정
export const owner = new ethers.Wallet(ownerPrivateKey, provider);
// Owner에게서 허가를 받고, 토큰을 사용할 가스비 대납 계정
export const spender = new ethers.Wallet(spenderPrivateKey, provider);
// spender가 transferFrom으로 owner에게서 토큰을 전송할 계정
export const recipient = ethers.Wallet.createRandom();

// Owner의 시점에서 사용할 MyGasslessToken 컨트랙트
export const contractByOwner = new ethers.Contract(contractAddress, abi, owner);
// Spender의 시점에서 사용할 MyGasslessToken 컨트랙트
export const contractBySpender = new ethers.Contract(
  contractAddress,
  abi,
  spender
);

export const ownerBalance = async () => {
  return await provider.getBalance(owner.address);
};

// 위의 코드는 수정하지 않습니다.

export const getBalance = async (address: string) => {
  try {
    // Todo: getBalance는 인자로 받는 address의 잔액을 리턴해야 합니다.(balanceOf)
  } catch (error) {
    console.error('Error in getBalance:', error);
  }
};

export const getAllowance = async (owner: string, spender: string) => {
  try {
    // Todo: getAllowance는 인자로 들어오는 owner가 spender에게 허용한 금액을 리턴해야 합니다.(allowance)
  } catch (error) {
    console.error('Error in allowance:', error);
  }
};

export const permit = async () => {
  try {
    /*
        Todo: 
        permit 함수는 [domain], [types], [message]를 정의하여 가스 대납자의 시점(contractBySpender)에서 permit을 실행합니다.
        owner가 가진 전체 Balance를 spender에게 permit 시킵니다.
    */
  } catch (error) {
    console.error('Error in permit:', error);
  }
};

export const tranferFrom = async (from: string, to: string, value: bigint) => {
  try {
    // Todo: from이 to에게 value만큼 가스 대납자의 시점(contractBySpender)에서 transferFrom을 실행합니다.
  } catch (error) {
    console.error('Error in tranferFrom:', error);
  }
};
