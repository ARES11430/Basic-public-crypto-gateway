import React, { Component } from 'react'
import Web3 from 'web3'
import PaymentGateWay from '../abis/PaymentGateWay.json'
import CreateGateway from '../abis/CreateGateway.json'
import ERC20 from '../abis/IERC20.json'
import Navbar from './Navbar'
import Main from './Main'
import Loading from './Loading'
import './App.css'

class App extends Component {

  async componentWillMount() {
    
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    

    let web3
    if (window.ethereum) {
      web3 = new Web3(window.ethereum)
      await window.ethereum.enable();
      this.setState({web3: web3})
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    web3.eth.handleRevert = true;
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    console.log("network ID", networkId)

    // Load Payment GateWay
    const paymentGatewayData = PaymentGateWay.networks[networkId]
   
    if(paymentGatewayData) {
      const paymentGateway = new web3.eth.Contract(PaymentGateWay.abi, paymentGatewayData.address)
      this.setState({ paymentGateway })

      let owner = await paymentGateway.methods.owner().call({from: this.state.account})
      console.log("owner is : ", owner)
      let wallet = await paymentGateway.methods.wallet().call({from: this.state.account})
      this.setState({wallet: wallet})
      this.setState({oldOwner: owner})

      let etherBalance = await web3.eth.getBalance(paymentGatewayData.address)
      this.setState({balanceOfEther: etherBalance})

      let token1Balance = await this.state.paymentGateway.methods.getBalance("0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02").call({from: this.state.account})
      let token1Amount = web3.utils.fromWei(token1Balance,'ether')
      this.setState({ balanceOfToken1: token1Amount})

      // if decimal of token is 18 use fromwei
      let token2Balance = await this.state.paymentGateway.methods.getBalance("0xc7ad46e0b8a400bb3c915120d284aafba8fc4735").call({from: this.state.account})
      let token2Amount = web3.utils.fromWei(token2Balance,'ether')
      this.setState({ balanceOfToken2: token2Amount})


    } else {
      window.alert('paymentGateway contract not deployed to detected network.')
    }

    this.setState({ loading: false })

    // Load ERC20 tokens
    if(5777 || 4) {

      // load token 1
      const ERC20Contract1 = new web3.eth.Contract(ERC20.abi,"0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02")      
      this.setState({ erc20token1 : ERC20Contract1 })
      // load token 2
      const ERC20Contract2 = new web3.eth.Contract(ERC20.abi,"0xc7ad46e0b8a400bb3c915120d284aafba8fc4735")      
      this.setState({ erc20token2 : ERC20Contract2 })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }
      this.setState({ loading: false })

    // Load Create Gateway
    const createGatewayData = CreateGateway.networks[networkId]
    if(createGatewayData) {
      const createGateway = new web3.eth.Contract(CreateGateway.abi, createGatewayData.address)
      this.setState({ createGateway })
    } else {
      window.alert('createGateway contract not deployed to detected network.')
    }
    this.setState({ loading: false })

}
    
  

  transferOwnership = (newOwner) => {
    this.setState({ loading: true })
    this.state.paymentGateway.methods.transferOwnership(newOwner).send({from: this.state.account}).on('receipt', function(receipt){
            console.log("events of transfer ownership" , receipt.events)
         })
        .on('error', function(error, receipt) {
         alert(error.message);  // object error
       });
        
        this.state.paymentGateway.events.OwnershipTransferred(function(error, event){  
        console.log(event); 
        })
        .on('data', function(event){
          let oldOwner = event.returnValues[0];
          let newOwner = event.returnValues[1];
          console.log("old owner is:  ",oldOwner)
          console.log("new owner is:  ",newOwner)     
        }.bind(this))
        .on('changed', function(event){
          // remove event from local database
        })
        .on('error', function(error, receipt) {
         // parse the error 
      });

      console.log("this is the new owner ",this.state.newOwner.toString());
      this.setState({ loading: false })
  }

  changeWallet = (address) => {
    this.setState({ loading: true })   
    this.state.paymentGateway.methods.changeWallet(address).send({from: this.state.account}).on('transactionHash', function(hash){
      console.log("events of transfer ownership" , hash)
         })
        .on('error', function(error, receipt) {
         alert(error.message);  // object error
       });
        
        this.state.paymentGateway.events.WalletChanged(function(error, event){   
        })
        .on('data', function(event){
          // do something with data      
        }.bind(this))
        .on('changed', function(event){
          // remove event from local database
        })
        .on('error', function(error, receipt) {
         // parse the error 
      });

      this.setState({ loading: false })
  }
  
  deposit = (weiAmount, address) => {    // (deposit) transfers the amount to gateway, but (buy) trasnfers the amout directly to wallet 
    let amountForTokensWith0Decimals = this.state.web3.utils.fromWei(weiAmount,'ether')          // use this if the decimal of token is 0, use uint if decimal is 18
    this.setState({ loading: true })  
    if (address === "0x0000000000000000000000000000000000000000") {          // ether
        this.state.paymentGateway.methods.deposit(weiAmount, address).send({from: this.state.account, value: weiAmount}).on('receipt', function(receipt){
  
        })
        .on('error', function(error, receipt) {     // deposite method error
        alert(error.message);  // object error
        });
       
        this.state.paymentGateway.events.CoinTransferred(function(error, event){   
        })
        .on('data', function(event){
         // do something with data
         console.log("transfer ether event:", event)  
        }.bind(this))
        .on('changed', function(event){
         // remove event from local database
        })
        .on('error', function(error, receipt) {
        // parse the error 
        });
        this.setState({ loading: false })
      } else if (address === "0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02") {         // token 1
        this.state.erc20token1.methods.approve(this.state.paymentGateway._address, weiAmount).send({from: this.state.account}).on('receipt', (receipt) => {
          console.log(receipt)  
          this.state.paymentGateway.methods.deposit(weiAmount, address).
            send({from: this.state.account}).on('receipt', function(receipt){
                this.setState({ loading: false })
            }).on('error', function(error, receipt) {   // deposite method error
              alert(error.message);  // object error
              }); 
              
              this.setState({ loading: false }) 
        })
          .on('error', function(error, receipt) {   // approve method error
          alert(error.message);  // object error
          }); 
          
          this.state.paymentGateway.events.TokenTransferred(function(error, event){    // transfer from event
          })
          .on('data', function(event){
            // do something with data   
            console.log("transfer token 1 event:", event)   
           }.bind(this))
           .on('changed', function(event){
            // remove event from local database
           })
           .on('error', function(error, receipt) {
           // parse the error 
           });
      } 
      else if (address === "0xc7ad46e0b8a400bb3c915120d284aafba8fc4735") {         // token 2
        this.state.erc20token2.methods.approve(this.state.paymentGateway._address, weiAmount).send({from: this.state.account}).on('receipt', (receipt) => {
            this.state.paymentGateway.methods.deposit(weiAmount, address)
            .send({from: this.state.account}).on('receipt', function(receipt){
                this.setState({ loading: false })
            }).on('error', function(error, receipt) {   // deposite method error
              alert(error.message);  // object error
              }); 
              
              

              this.setState({ loading: false }) 
        })
        .on('error', function(error, receipt) {   // approve method error
          alert(error.message);  // object error
          }); 
          
          this.state.paymentGateway.events.TokenTransferred(function(error, event){    // transfer from event
          })
          .on('data', function(event){
            // do something with data   
            console.log("transfer token 2 event:", event)   
           }.bind(this))
           .on('changed', function(event){
            // remove event from local database
           })
           .on('error', function(error, receipt) {
           // parse the error 
           });
      }
  }

  buy = (uint, address) => {    // (deposit) transfers the amount to gateway, but (buy) trasnfers the amout directly to wallet 
    let amountForTokensWith0Decimals = this.state.web3.utils.fromWei(uint,'ether')          // use this if the decimal of token is 0, use uint if decimal is 18
    this.setState({ loading: true })  
    if (address === "0x0000000000000000000000000000000000000000") {          // ether
        this.state.paymentGateway.methods.buy(uint, address).send({from: this.state.account, value: uint}).on('receipt', function(receipt){
  
        })
        .on('error', function(error, receipt) {     // buy method error
        alert(error.message);  // object error
        });
       
        this.state.paymentGateway.events.CoinTransferred(function(error, event){   
        })
        .on('data', function(event){
         // do something with data
         console.log("transfer ether event:", event)  
        }.bind(this))
        .on('changed', function(event){
         // remove event from local database
        })
        .on('error', function(error, receipt) {
        // parse the error 
        });
        this.setState({ loading: false })
      } else if (address === "0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02") {         // token 1
        this.state.erc20token1.methods.approve(this.state.paymentGateway._address, uint).send({from: this.state.account}).on('receipt', (receipt) => {
            this.state.paymentGateway.methods.buy(uint, address)
            .send({from: this.state.account, gas:70000}).on('receipt', function(receipt){
                this.setState({ loading: false })
            }).on('error', function(error, receipt) {   // buy method error
              alert(error.message);  // object error
              }); 
              
              this.setState({ loading: false }) 
        })
        .on('error', function(error, receipt) {   // approve method error
          alert(error.message);  // object error
          }); 
          
          this.state.paymentGateway.events.TokenTransferred(function(error, event){    // transfer to wallet event
          })
          .on('data', function(event){
            // do something with data   
            console.log("transfer token 1 event:", event)   
           }.bind(this))
           .on('changed', function(event){
            // remove event from local database
           })
           .on('error', function(error, receipt) {
           // parse the error 
           });
      } 
      else if (address === "0xc7ad46e0b8a400bb3c915120d284aafba8fc4735") {         // token 2
        this.state.erc20token2.methods.approve(this.state.paymentGateway._address, uint).send({from: this.state.account}).on('receipt', (receipt) => {
            this.state.paymentGateway.methods.buy(uint, address)
            .send({from: this.state.account, gas:70000}).on('receipt', function(receipt){
                this.setState({ loading: false })
            }).on('error', function(error, receipt) {   // buy method error
              alert(error.message);  // object error
              }); 

              this.setState({ loading: false }) 
        })
        .on('error', function(error, receipt) {   // approve method error
          alert(error.message);  // object error
          }); 
          
          this.state.paymentGateway.events.TokenTransferred(function(error, event){    // transfer to wallet event
          })
          .on('data', function(event){
            // do something with data   
            console.log("transfer token 2 event:", event)   
           }.bind(this))
           .on('changed', function(event){
            // remove event from local database
           })
           .on('error', function(error, receipt) {
           // parse the error 
           });
      }
  }

  withdraw = (weiAmount, address) => {     
    let amountForTokensWith0Decimals = this.state.web3.utils.fromWei(weiAmount,'ether')          // use this if the decimal of token is 0, use uint if decimal is 18
    this.setState({ loading: true })  
    if (address === "0x0000000000000000000000000000000000000000") {          // ether
        this.state.paymentGateway.methods.withdraw(weiAmount, address).send({from: this.state.account})
        .on('receipt', function(receipt){
  
        })
        .on('error', function(error, receipt) {     // withdraw method error
        alert(error.message);  // object error
        });
       
        this.state.paymentGateway.events.CoinTransferred(function(error, event){   
        })
        .on('data', function(event){
         // do something with data
         console.log("transfer ether event:", event)  
        }.bind(this))
        .on('changed', function(event){
         // remove event from local database
        })
        .on('error', function(error, receipt) {
        // parse the error 
        });
        this.setState({ loading: false })
      } else if (address === "0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02") {         // token 1
          this.state.paymentGateway.methods.withdraw(weiAmount, address).send({from: this.state.account}).on('receipt', function(receipt){
               
          }).on('error', function(error, receipt) {   // withdraw method error
              alert(error.message);  // object error
              }); 
              
              this.setState({ loading: false }) 
          
          this.state.paymentGateway.events.TokenTransferred(function(error, event){    // transfer to wallet event
          })
          .on('data', function(event){
            // do something with data   
            console.log("transfer token 1 event:", event)   
           }.bind(this))
           .on('changed', function(event){
            // remove event from local database
           })
           .on('error', function(error, receipt) {
           // parse the error 
           });
      } 
      else if (address === "0xc7ad46e0b8a400bb3c915120d284aafba8fc4735") {         // token 2
        this.state.paymentGateway.methods.withdraw(weiAmount, address).send({from: this.state.account}).on('receipt', function(receipt){
               
        }).on('error', function(error, receipt) {   // withdraw method error
            alert(error.message);  // object error
            }); 
            
            this.setState({ loading: false }) 
        
        this.state.paymentGateway.events.TokenTransferred(function(error, event){    // transfer to wallet event
        })
        .on('data', function(event){
          // do something with data   
          console.log("transfer token 1 event:", event)   
         }.bind(this))
         .on('changed', function(event){
          // remove event from local database
         })
         .on('error', function(error, receipt) {
         // parse the error 
         });
      }
  }

  transferTo = (recipient, weiAmount ,currency) => {
    let amountForTokensWith0Decimals = this.state.web3.utils.fromWei(weiAmount,'ether')          // use this if the decimal of token is 0, use uint if decimal is 18
    this.setState({ loading: true })  
    if (currency === "0x0000000000000000000000000000000000000000") {          // ether
        this.state.paymentGateway.methods.transferTo(recipient,weiAmount, currency)
        .send({from: this.state.account}).on('receipt', function(receipt){
  // 0xDDDfECA42948ac67E4b2e9D3Fa0243d0516401e8
        })
        .on('error', function(error, receipt) {     // transferTo method error
        alert(error.message);  // object error
        });
       
        this.state.paymentGateway.events.CoinTransferred(function(error, event){   
        })
        .on('data', function(event){
         // do something with data
         console.log("transfer ether event:", event)  
        }.bind(this))
        .on('changed', function(event){
         // remove event from local database
        })
        .on('error', function(error, receipt) {
        // parse the error 
        });
        this.setState({ loading: false })
      } else if (currency === "0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02") {         // token 1
          this.state.paymentGateway.methods.transferTo(recipient,weiAmount, currency)
          .send({from: this.state.account}).on('receipt', function(receipt){
               
          }).on('error', function(error, receipt) {   // transferTo method error
              alert(error.message);  // object error
              }); 
              
              this.setState({ loading: false }) 
          
          this.state.paymentGateway.events.TokenTransferred(function(error, event){    // transfer to wallet event
          })
          .on('data', function(event){
            // do something with data   
            console.log("transfer token 1 event:", event)   
           }.bind(this))
           .on('changed', function(event){
            // remove event from local database
           })
           .on('error', function(error, receipt) {
           // parse the error 
           });
      } 
      else if (currency === "0xc7ad46e0b8a400bb3c915120d284aafba8fc4735") {         // token 2
        this.state.paymentGateway.methods.transferTo(recipient,weiAmount, currency)
        .send({from: this.state.account}).on('receipt', function(receipt){
               
        }).on('error', function(error, receipt) {   // withdraw method error
            alert(error.message);  // object error
            }); 
            
            this.setState({ loading: false }) 
        
        this.state.paymentGateway.events.TokenTransferred(function(error, event){    // transfer to wallet event
        })
        .on('data', function(event){
          // do something with data   
          console.log("transfer token 1 event:", event)   
         }.bind(this))
         .on('changed', function(event){
          // remove event from local database
         })
         .on('error', function(error, receipt) {
         // parse the error 
         });
      }
  }
  
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      paymentGateway: {},
      erc20token1: {},
      erc20token2: {},
      balanceOfToken1:'0',
      balanceOfToken2:'0',
      balanceOfEther: '0',
      createGateway: {},
      wallet:'',
      oldOwner:'',
      newOwner:'',
      web3: null,
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
    content =  <Loading />

    } else {
      content = <Main
        transferOwnership={this.transferOwnership}  
        newOwner = {this.state.newOwner} 
        oldOwner = {this.state.oldOwner}  
        wallet = {this.state.wallet}
        erc20token1 = {this.state.erc20token1}
        erc20token2 = {this.state.erc20token2} 
        changeWallet = {this.changeWallet}
        deposit = {this.deposit}
        buy = {this.buy}
        withdraw = {this.withdraw}
        transferTo = {this.transferTo}
        getBalance = {this.getBalance}
        balanceOfToken1 = {this.state.balanceOfToken1}
        balanceOfToken2 = {this.state.balanceOfToken2}
        balanceOfEther = {this.state.balanceOfEther}
        web3 = {this.state.web3}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.vistochain.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
