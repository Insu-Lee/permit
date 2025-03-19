import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { ethers } from 'hardhat';
import hardhatConfig from '../hardhat.config';
import { HttpNetworkUserConfig } from 'hardhat/types';

describe('Deploy 검사', function () {
  let mytoken: any;
  let owner: any;
  let otherAccount: any;

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const MytokenFactory = await ethers.getContractFactory('MyToken');
    mytoken = await MytokenFactory.deploy();
    await mytoken.waitForDeployment();
  });

  describe('환경 셋팅 검사', function () {
    it('@openzeppelin/contracts가 설치되어야 합니다.', function () {
      const packageJsonPath = path.join(__dirname, '../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};

      const isInstalled =
        '@openzeppelin/contracts' in dependencies ||
        '@openzeppelin/contracts' in devDependencies;

      expect(isInstalled).to.be.true;
    });

    it('가나슈 네트워크에 정상적으로 연결이 되어야 합니다.(hardhat.config.ts)', async function () {
      const ganache = hardhatConfig.networks?.ganache as HttpNetworkUserConfig;
      const ganacheUrl = ganache?.url;
      expect(ganacheUrl?.toUpperCase()).to.equal('HTTP://127.0.0.1:7545');
    });
  });

  describe('컨트랙트 구현', function () {
    it('컨트랙트에서 SPDX 주석으로 라이선스가 있어야 합니다.', async function () {
      const contractPath = path.join(__dirname, '../contracts/MyToken.sol');
      const sourceCode = fs.readFileSync(contractPath, 'utf8');
      expect(sourceCode.match(/\/\/ SPDX-License-Identifier:/)).to.not.be.null;
    });

    it('컨트랙트에서 Solidity 버전이 0.8.0 이상, 0.9.0 미만이어야 합니다.', async function () {
      const contractPath = path.join(__dirname, '../contracts/MyToken.sol');
      const sourceCode = fs.readFileSync(contractPath, 'utf8');

      const versionMatch = sourceCode.match(/pragma solidity\s+([^;]+);/);
      expect(versionMatch).to.not.be.null;

      const solidityVersion = versionMatch![1].trim();
      const validVersions = ['>=0.8.0 <0.9.0', '^0.8.0'];

      expect(validVersions.includes(solidityVersion)).to.be.true;
    });

    it('컨트랙트에서 @openzeppelin/contracts/token/ERC20/ERC20.sol을 import 해야 합니다.', function () {
      const contractPath = path.join(__dirname, '../contracts/MyToken.sol');
      const sourceCode = fs.readFileSync(contractPath, 'utf8');
      const importRegex =
        /import\s+["']@openzeppelin\/contracts\/token\/ERC20\/ERC20\.sol["'];/i;
      expect(sourceCode.match(importRegex)).to.not.be.null;
    });

    it('MyToken 컨트랙트는 ERC20을 상속받아 구현해야 합니다.(is, constructor)', async function () {
      const tokenName = await mytoken.name();
      const tokenSymbol = await mytoken.symbol();

      expect(tokenName.length).to.be.greaterThan(0);
      expect(tokenSymbol.length).to.be.greaterThan(0);
    });

    it('MyToken 컨트랙트 배포시 배포 주소에 토큰이 민팅되어야 합니다.(constructor, _mint)', async function () {
      const balance = await mytoken.balanceOf(owner.address);
      expect(balance > 0n).to.be.true;
    });
  });
});
