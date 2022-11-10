# 作业二

## 1. 功能与实现分析



### 1.1 Contract的实现

contract主要有一些函数构成,首先是一些变量的定义

```solidity
 uint256 constant public PASS_REWARD = 10000;
    uint256 constant public VOTE_PRICE = 3000;

    struct Proposal {
        uint256 index;      // index of this proposal
        address proposer;  // who make this proposal
        uint256 startTime; // proposal start time
        uint256 duration;  // proposal duration
        uint256 endTime;
        string name;       // proposal name
        uint32 yes;
        uint32 no;
        // ...
        // TODO add any member if you want
    }

    MyERC20 studentERC20;
    
    // mapping(uint32 => Proposal[]) proposals; // A map from proposal index to proposal
    Proposal[] proposals;
   
```

上图定义了一些变量如下：

- 常量。如投票需要的ERC以及通过提案可以获得的ERC。
  
- Proposal结构体。记录一个投票提案需要的信息，如索引，发起人，起止时间，赞成还有反对票数，提案内容。
  
- ERC相关变量。是本合约使用的代币。与demo中的MyERC20相同。
  

然后是一些函数，主要如下：

- `function createProposal(string memory _name) public` 给定内容创建一个提案
  
- `function vote(uint8 _proposal, uint32 index) public`投票
  
- `function getYes(uint32 index) public view returns(uint256)`得到赞同某个提案的人数
  
- `function getNo(uint32 index) public view returns(uint256)``得到反对某个提案的人数
  
- `function getLengths() public view returns(uint256)`返回提案个数
  
- `function getProposals() public view returns(Proposal[] memory)`得到所有提案
  
- `function getERC20() public view returns(uint)`得到用户的ERC20代币数目。
  

### 1.2 前端的实现

**在lottery的demo上修改而成**

主要修改了如下部分：

1. 最开始加载页面时要载入所有的提案以及相关信息
2. 投票的逻辑，赞同或者反对，每次投票花费一定数额ERC20，以此限制投票次数

## 2. 运行

1. contract是在remix里运行，部署在Ganache上
2. 前端的运行。首先把contract里的adddress和abi如同demo项目中那样复制到对应位置，然后在前端文件夹中运行 `npm run start`启动，浏览器中可以看见前端。**注意：小狐狸需要添加和Ganache相关的账户，否则会因为gas不够调用合约失败**。
3. 具体操作视频中给出

## 3. 运行截图
见视频
