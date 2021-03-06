import type { NextPage } from 'next'
import React, {useEffect, useState}  from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import WalletConnect from 'walletconnect';
import {Grid, Button,Container} from "@mui/material";
import Web3 from "web3";
import {IProviderOptions} from "web3modal";
import Web3Modal from "web3modal";
import { useWallet, UseWalletProvider } from 'use-wallet'
import { connect } from 'http2';
import { fetchTransactionData } from '../../address-dashboard/src/api/covalantApi';
import CytoscapeComponent from 'react-cytoscapejs';

//import Flow, { FlowProps, initialNodeProps } from './components/flow';
//import { constructParentNode, wrapNodeProps } from './components/helper';

const testAddress = "0xd8791b6abdb7c5d564018ebb93ad8a092b1d8abd";

function truncate(str: String){
  return str.substring(0, 6) + "..." + str.substring(36,42);
};

const Home: NextPage = () => {
  const [isConnected, setConnection] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [userAddress, setUserAddress] = useState("");
  const connectOnClick = () => {
    //  Create WalletConnect SDK instance
    const wc = new WalletConnect();
    fetchTransactionData(testAddress).then(data => {
      
    }).catch(err => {

    })
    //  Connect session (triggers QR Code modal)
    wc.connect().then(data => {
      
      console.log(data);
      const userAddress = data.accounts[0];
      setConnection(true);
      setUserAddress(userAddress);
      fetchTransactionData(userAddress);
      
    }).catch(err =>{
      console.log(err);
    })
  }
  const disconnectOnClick = () => {
    const wc = new WalletConnect();
    //  Create WalletConnect SDK instance
    wc.connect().then(data => {
      data.killSession();
      
    }).catch(err =>{
      console.log(err);
    })
    setConnection(false);
    setUserAddress("");
    
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
      <Grid container spacing={2}>
      <Grid item xs={3}> </Grid>
      <Grid item xs={8} >
        <Container style={{}}>
      
        </Container>
       </Grid>

      <Grid item xs={3} > </Grid>


      <Grid item xs={11}>
      </Grid>
      <Grid item xs={1}>
        {!isConnected && <Button variant = "contained" onClick ={connectOnClick }> Connect </Button>}
        {isConnected && <Button variant = "contained" onClick ={disconnectOnClick }> Disconnect {truncate(userAddress)} </Button>}
      </Grid>


      
        
      {!isConnected && <Container> please connect wallet to generate affiliation network </Container> }

    </Grid>
    
      </Container >
      <div>
      {isConnected && 
      <Container style={{alignContent: 'center', alignItems: 'center', height:'800px', width: '100%'}}>  

        </Container>
      }
      
      </div>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
