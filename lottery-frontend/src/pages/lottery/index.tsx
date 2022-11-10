import {Button, Image} from 'antd';
import {Header} from "../../asset";
import {UserOutlined} from "@ant-design/icons";
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import {useEffect, useState} from 'react';
import {lotteryContract, myERC20Contract, web3,studentSocietyContract} from "../../utils/contracts";
import './index.css';
import { isRestParameter } from 'typescript';
import { click } from '@testing-library/user-event/dist/click';

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

const LotteryPage = () => {

    const [account, setAccount] = useState('')
    const [accountBalance, setAccountBalance] = useState(0)
    const [playAmount, setPlayAmount] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [playerNumber, setPlayerNumber] = useState(0)
    const [managerAccount, setManagerAccount] = useState('')
    const [proposals, setProposals] = useState([] as any)
    const [lengths, setLengths] = useState(0)

    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                console.log(accounts)
                if(accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            }
        }

        initCheckAccounts()
    }, [])

   

    //  get all proposals
    useEffect(() => {

        const getProposalsInfo =async () => {
            console.log('Student:')
            console.log(studentSocietyContract)

           if(studentSocietyContract){
            // console.log('111111')
            const lengths = await studentSocietyContract.methods.getLengths().call();
            const balance = await studentSocietyContract.methods.getERC20().call();
            console.log(balance)
            console.log(lengths)
            setLengths(lengths)
            setAccountBalance(balance)
            const proposals_struct = await studentSocietyContract.methods.getProposals().call()
            const proposals: any[] = []
            for(var i = 0 ; i < lengths; i++)
            {
                proposals.push(proposals_struct[i])
            }
            setProposals(proposals)
           }
        }

         getProposalsInfo()
    }
    ,[])

    useEffect(() => {
        const getAccountInfo = async () => {
            if (myERC20Contract) {
                const ab = await myERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
            } else {
                alert('Contract not exists.')
            }
        }

        if(account !== '') {
            getAccountInfo()
        }
    }, [account])

    const onClaimTokenAirdrop = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (myERC20Contract) {
            try {
                await myERC20Contract.methods.airdrop().send({
                    from: account
                })
                alert('You have claimed ZJU Token.')
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

  
    const onVote =async (type:any, index:any) => {
        console.log(`type, ${type}, index: ${index}`);
       await studentSocietyContract.methods.vote(type,index).send({
        from: account
       }); }
    
    const onCreateProposal =async (_name:string) => {
        console.log(`name:${_name}`)
        await studentSocietyContract.methods.createProposal(_name).send({from: account})
        
    }

const onPassReward = async (index:any) =>{
    await studentSocietyContract.methods.getPassReward(index).send({from:account})
}

    
    const onClickConnectWallet = async () => {
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        // @ts-ignore
        const {ethereum} = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }

        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            if (ethereum.chainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // Chain-ID
                    chainName: GanacheTestChainName, // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({ method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            }

            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            await ethereum.request({method: 'eth_requestAccounts'});
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({method: 'eth_accounts'});
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }
    }

    return (
        <div className='container'>
            <Image
                width='100%'
                height='150px'
                preview={false}
                src={Header}
            />
            <div className='main'>
                <h1>浙大社团活动投票</h1>
                <Button onClick={onClaimTokenAirdrop}>领取积分投票</Button>
                {/* <div>s：{managerAccount}</div> */}
                <div>
                <form onSubmit={()=>{
                    const name = (document.getElementById('newProposal')  as HTMLInputElement).value;
                    onCreateProposal(name);
                }}>
                <input id='newProposal' type="text" />
                 <input type="submit" value="Submit"  />
                </form>
                </div>
                <div className='account'>
                    {account === '' && <Button onClick={onClickConnectWallet}>连接钱包</Button>}
                    <div>当前用户：{account === '' ? '无用户连接' : account}</div>
                    <div>剩余积分:{account === '' ? '无用户连接' : accountBalance}</div>
                    {/* <div>当前：{account === '' ? 0 : accountBalance}</div> */}
                </div>
                <div>
                    投票(每次5000积分)：
                {
                    proposals.map((item:any)=>item && 
                    <li key = {item}>
                        <div>编号:{item.index}</div>
                        <div>发起人:{item.proposer}</div>
                        <div>截止时间:{item.endTime}</div>
                        <div>内容:{item.name}</div>
                        <div>赞成人数:{item.yes}</div>
                        <div>反对人数:{item.no}</div>
                        <button  onClick={()=>{ onVote(1,item.index)}}>赞成</button>
                        <button onClick={()=>{ onVote(0,item.index)}}>反对</button>
                        <button onClick={()=>{onPassReward(item.index)}}>领取奖励</button>
                        </li>)
                }
                </div>   
            </div>
        </div>
    )
    }
export default LotteryPage;