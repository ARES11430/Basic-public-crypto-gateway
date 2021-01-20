import React, { Component } from 'react'
import eth from '../eth-logo.png';
import token1 from '../tether.png';
import token2 from '../dai.png';



class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">
      
        <p>Crypto Payment Gateway</p>
        <div>
          <p>Current owner: {this.props.oldOwner}</p>
          <p>Current wallet: {this.props.wallet}</p> 
          <p>Ether balance of contract: {this.props.web3.utils.fromWei(this.props.balanceOfEther,'ether')}</p>   
          <p>Tether Balance of contract: {this.props.balanceOfToken1}</p> 
          <p>Dai Balance of contract: {this.props.balanceOfToken2}</p> 
        </div>
        
        <div className="card mb-4">
          <div className="card-body">
            <form className="mb-3" onSubmit={(event) => {
                event.preventDefault()
                let newOwner 
                newOwner = this.input1.value          
                this.props.transferOwnership(newOwner)
              }}>
              <div>
                <label className="float-left"><b>Transfer OwnerShip</b></label>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input1) => { this.input1 = input1 }}
                  className="form-control form-control-lg"
                  placeholder="address of new Owner"
                  required />                            
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Transfer</button>
            </form>

            <form className="mb-3" onSubmit={(event) => {
                event.preventDefault()
                let address 
                address = this.input2.value           
                this.props.changeWallet(address)
              }}>
              <div>
                <label className="float-left"><b>Change Wallet</b></label>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input2) => { this.input2 = input2 }}
                  className="form-control form-control-lg"
                  placeholder="address of new wallet"
                  required />                            
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Change</button>
            </form>           
          </div>
        </div>

        <div className="card mb-4">
        <div className="card-body">
        <form className="mb-3" ref={form1 => this.form1 = form1} onSubmit={(event) => {
                event.preventDefault()
                let uint
                uint = this.input3.value
                let weiAmount = this.props.web3.utils.toWei(uint,'ether')
                const {currency1} = this.form1;
                let address = currency1.value           
                this.props.deposit(weiAmount,address)
              }}>
              <div>
                <label className="float-left"><b>Deposite</b></label>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input3) => { this.input3 = input3 }}
                  className="form-control form-control-lg"
                  placeholder="amount"
                  required />
                   </div>
                <div className="input-group mb-4">
                  <label>
                  <div className="input-group-text">
                    <img src={eth} height='32' width='32' alt=""/>&nbsp;&nbsp;
                    Ether &nbsp;
                    <input type="radio" value="0x0000000000000000000000000000000000000000" name="currency1"  checked= {true} />
                    </div>
                  </label>
                </div>
                <div className="input-group mb-4">
                  <label>
                  <div className="input-group-text">
                  <img src={token1} height='32' width='32' alt=""/>&nbsp;&nbsp;
                    USDT &nbsp;
                    <input type="radio" value="0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02" name="currency1" />
                    </div>
                  </label>
                </div>
                <div className="input-group mb-4">
                 <label>
                 <div className="input-group-text">
                 <img src={token2} height='32' width='32' alt=""/>&nbsp;&nbsp;
                   DAI &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="radio" value="0xc7ad46e0b8a400bb3c915120d284aafba8fc4735" name="currency1" />
                    </div>
                 </label>
                </div>
              
              <button type="submit" className="btn btn-primary btn-block btn-lg">Deposite</button>
            </form>
        </div>
        </div>


        <div className="card mb-4">
        <div className="card-body">
        <form className="mb-3" ref={form2 => this.form2 = form2} onSubmit={(event) => {
                event.preventDefault()
                let uint
                uint = this.input4.value
                let weiAmount = this.props.web3.utils.toWei(uint,'ether')
                const {currency2} = this.form2;
                let address = currency2.value           
                this.props.buy(weiAmount,address)
              }}>
              <div>
                <label className="float-left"><b>Buy</b></label>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input4) => { this.input4 = input4 }}
                  className="form-control form-control-lg"
                  placeholder="amount"
                  required />
                   </div>
                <div className="input-group mb-4">
                  <label>
                  <div className="input-group-text">
                    <img src={eth} height='32' width='32' alt=""/>&nbsp;&nbsp;
                    Ether &nbsp;
                    <input type="radio" value="0x0000000000000000000000000000000000000000" name="currency2"  checked= {true} />
                    </div>
                  </label>
                </div>
                <div className="input-group mb-4">
                  <label>
                  <div className="input-group-text">
                  <img src={token1} height='32' width='32' alt=""/>&nbsp;&nbsp;
                      USDT &nbsp;
                    <input type="radio" value="0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02" name="currency2" />
                    </div>
                  </label>
                </div>
                <div className="input-group mb-4">
                 <label>
                 <div className="input-group-text">
                 <img src={token2} height='32' width='32' alt=""/>&nbsp;&nbsp;
                     DAI &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="radio" value="0xc7ad46e0b8a400bb3c915120d284aafba8fc4735" name="currency2" />
                    </div>
                 </label>
                </div>
              
              <button type="submit" className="btn btn-primary btn-block btn-lg">Buy</button>
            </form>
        </div>
        </div>

        <div className="card mb-4">
        <div className="card-body">
        <form className="mb-3" ref={form3 => this.form3 = form3} onSubmit={(event) => {
                event.preventDefault()
                let uint
                uint = this.input5.value
                let weiAmount = this.props.web3.utils.toWei(uint,'ether')
                const {currency3} = this.form3;
                let address = currency3.value           
                this.props.withdraw(weiAmount,address)
              }}>
              <div>
                <label className="float-left"><b>Withdraw</b></label>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input5) => { this.input5 = input5 }}
                  className="form-control form-control-lg"
                  placeholder="amount"
                  required />
                   </div>
                <div className="input-group mb-4">
                  <label>
                  <div className="input-group-text">
                    <img src={eth} height='32' width='32' alt=""/>&nbsp;&nbsp;
                    Ether &nbsp;
                    <input type="radio" value="0x0000000000000000000000000000000000000000" name="currency3"  checked= {true} />
                    </div>
                  </label>
                </div>
                <div className="input-group mb-4">
                  <label>
                  <div className="input-group-text">
                  <img src={token1} height='32' width='32' alt=""/>&nbsp;&nbsp;
                     USDT &nbsp;
                    <input type="radio" value="0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02" name="currency3" />
                    </div>
                  </label>
                </div>
                <div className="input-group mb-4">
                 <label>
                 <div className="input-group-text">
                 <img src={token2} height='32' width='32' alt=""/>&nbsp;&nbsp;
                     DAI &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="radio" value="0xc7ad46e0b8a400bb3c915120d284aafba8fc4735" name="currency3" />
                    </div>
                 </label>
                </div>
              
              <button type="submit" className="btn btn-primary btn-block btn-lg">Withdraw</button>
            </form>
        </div>
        </div>

        <div className="card mb-4">
        <div className="card-body">
        <form className="mb-3" ref={form4 => this.form4 = form4} onSubmit={(event) => {
                event.preventDefault()
                let uint
                uint = this.input6.value
                let weiAmount = this.props.web3.utils.toWei(uint,'ether')
                const {currency4} = this.form4;
                let currency = currency4.value  
                let recepient = this.input7.value        
                this.props.transferTo(recepient,weiAmount,currency)
              }}>
              <div>
                <label className="float-left"><b>Transfer To</b></label>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input6) => { this.input6 = input6 }}
                  className="form-control form-control-lg"
                  placeholder="amount"
                  required />
                   </div>
                   <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input7) => { this.input7 = input7 }}
                  className="form-control form-control-lg"
                  placeholder="address recepient"
                  required />
                   </div>
                <div className="input-group mb-4">
                  <label>
                  <div className="input-group-text">
                    <img src={eth} height='32' width='32' alt=""/>&nbsp;&nbsp;
                    Ether &nbsp;
                    <input type="radio" value="0x0000000000000000000000000000000000000000" name="currency4"  checked= {true} />
                    </div>
                  </label>
                </div>
                <div className="input-group mb-4">
                  <label>
                  <div className="input-group-text">
                  <img src={token1} height='32' width='32' alt=""/>&nbsp;&nbsp;
                     USDT &nbsp;
                    <input type="radio" value="0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02" name="currency4" />
                    </div>
                  </label>
                </div>
                <div className="input-group mb-4">
                 <label>
                 <div className="input-group-text">
                 <img src={token2} height='32' width='32' alt=""/>&nbsp;&nbsp;
                    DAI &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="radio" value="0xc7ad46e0b8a400bb3c915120d284aafba8fc4735" name="currency4" />
                    </div>
                 </label>
                </div>
              
              <button type="submit" className="btn btn-primary btn-block btn-lg">Transfer To</button>
            </form>
            </div>
            </div>

      </div>
    );
  }
}

export default Main;
