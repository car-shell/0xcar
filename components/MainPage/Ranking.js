import * as React from 'react';
import {Tabs, Tab, Box, Card, Typography, IconButton, CardActionArea, Checkbox} from '@mui/material'
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Image from 'next/image'
import StickyHeadTable from "../Bet/Table";
import {getUrl} from "../../pages/api/axios";
import { styled } from '@mui/material/styles';
import {formatAmount} from "../utils"
import { ADDRESSES } from '../../config/constants/address' 
import { defaultChainId } from "../../config/constants/chainId";
import { useNetwork, useAccount } from "wagmi";


// Generate Order Data
function createData(ranking, address, count,  total) {
  return { id: address, ranking: ranking, address: address, count: count, total: total };
}

function preventDefault(event) {
  event.preventDefault();
}

export default function Ranking({width = '920px'}) {
  const [value, setValue] = React.useState(0);
  const [winRows, setWinRows] = React.useState([]);
  const [betRows, setBetRows] = React.useState([]);
  const [pointsRows, setPointsRows] = React.useState([]);
  const [countdown, setCountdown] = React.useState('--:--:--');
  
  const [showPointsRules, setShowPointsRules] = React.useState(false);
  const moreRef = React.useRef()

  const {chain, chains} = useNetwork()
  const {address} = useAccount()
  const chainId = React.useMemo(()=>{ return chain != undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) != -1 ? chain.id : defaultChainId}, [chain])
  const addressGameContract = ADDRESSES[chainId]?.game;

  const handleChange = (event, newValue) => {
      setValue(newValue);
  };
  React.useEffect(()=>{
    setWinRows([])
    getWinLogs()

    setBetRows([])
    getBetLogs()
  }, [address])

  React.useEffect(()=>{
    const i = setInterval(() => {
      let now = new Date()
      let start = new Date("2023-09-12 00:00:00Z")
      let end = new Date("2023-09-20 00:00:00Z")
      let rm = (24*3600) - ((now/1000) % (24*3600))  
      if (now > start && now < end) {
        let dur = `${(Math.floor(rm/3600)-1).toString().padStart(2,0)}:${(Math.floor((rm%3600)/60)-1).toString().padStart(2,0)}:${(Math.floor(rm%60)).toString().padStart(2,0)}`
        setCountdown(dur)
      }
    }, 1000);

    return ()=>clearInterval(i)
  }, [])

    const shutdown = (event)=>{
      console.log(`${showPointsRules}`);
     
      setShowPointsRules((pre)=>{
        if( pre ) {
          return false;
        }
      })
    }

    React.useEffect(() => {
      document.body.addEventListener('click', shutdown)
      return () => {
            document.body.removeEventListener('click', shutdown);
        };
    }, []);
  
  const getWinLogs = React.useCallback(async ()=>{
    try {
      const logs = await getUrl("/bet_ranking", {params : {type: "win"}})
      console.log(logs);
      let r = logs.data.map((item, i)=>{
        return createData(i+1, item["address"], item["win_count"], item["total_win"])
      })
      let my = null
      if ( address && address != undefined) {
        my = r.find((el)=> el["address"].toLowerCase()==address.toLowerCase())
        r = r.filter((el)=> el["address"].toLowerCase()!=address.toLowerCase())
      }
      let t = my!=null?[my,...r]:r
      console.log(`[[[[[[${JSON.stringify(t)}]]]]]]`);

      setWinRows(t)
    } catch (error) {
      console.log(error);
    }
  }, [address])

  const getBetLogs = React.useCallback(async ()=>{
    try {
      const logs = await getUrl("/bet_ranking", {params : {type: "bet"}})
      console.log(logs);
      let r = logs.data.map((item, i)=>{
        return { id: i+1, ranking: i+1, address: item["address"], count: item["bet_count"], total: item["total_bet"],
            total_points: item['total_point'] }; //createData(i+1, item["address"], item["bet_count"], item["total_bet"])
      })
      
      const pr = await getUrl("/points_record")
      if (pr.data.length != 0) {
        console.log(r);
        let l = pr.data.map((item)=>{
          for(let record_bet of r) {
            if (record_bet['address'] == item['player']) {
              return {...record_bet, yesterday: item['points']}
            }
          }
        })

        let my = null
        if ( address && address != undefined ) {
          my = l.find((el)=> el["address"].toLowerCase()==address.toLowerCase())
          l = l.filter((el)=> el["address"].toLowerCase()!=address.toLowerCase())
        }

        setBetRows(my!=null?[my, ...l]:l)
      } else {
        let my = null
        if ( address && address != undefined ) {
          my = r.find((el)=> el["address"].toLowerCase()==address.toLowerCase())
          r = r.filter((el)=> el["address"].toLowerCase()!=address.toLowerCase())
        }
        setBetRows(my!=null?[my, ...r]:r)
      }
    
    } catch (error) {
      console.log(error);
    }
      
  }, [address])

  React.useEffect(()=>{
    getBetLogs()
    getWinLogs()
    // getPointsLogs()
    const i = setInterval(() => {
      getWinLogs()
      getBetLogs()
      // getPointsLogs()
    }, 30000);

    return ()=>clearInterval(i)
  }, [])

  const stopPropagation = (e) => {
    e.nativeEvent.stopImmediatePropagation();
  }
  const handleShowTip = (e) => {
    stopPropagation(e);
    setShowPointsRules((pre)=>{
      return !pre
    })
    
  }
  const betColumns = React.useMemo(
        () => [
            {
                Header: "Ranking",
                accessor: "ranking",
                align: "center"
            },
            {
                Header: "Player",
                accessor: "address",
                align: "center",
                format: (address)=>{
                    return address.slice(0, 12) + '...' + address.slice(38)
                }
            },
            {
                Header: "Bet Count",
                accessor: "count",
                align: "center",
            },
            {
                Header: "Bet Amount",
                accessor: "total",
                align: "center",
                format: (x)=>{
                  return formatAmount(x)
                }
            },
            {
                Header: "Yesterday Reward",
                accessor: "yesterday",
                align: "center",
                format: (i)=>{
                    return i===undefined?0:"+"+i
                }
            },
            {
                Header: "Total Points",
                accessor: "total_points",
                align: "center"
            }
        ],
        []
    )

  const winColumns = React.useMemo(
        () => [
            {
                Header: "Ranking",
                accessor: "ranking",
                align: "center"
            },
            {
                Header: "Player",
                accessor: "address",
                align: "center",
                format: (address)=>{
                    return address.slice(0, 12) + '...' + address.slice(38)
                }
            },
            {
                Header: "Win Count",
                accessor: "count",
                align: "center",
            },
            {
                Header: "Total Net Payout",
                accessor: "total",
                align: "center",
                format: (x)=>{
                  return formatAmount(x)
                }
            }
        ],
        []
    )

    const pointsColumns = React.useMemo(
        () => [
            {
                Header: "Ranking",
                accessor: "ranking",
                align: "center",
                
            },
            {
                Header: "Address",
                accessor: "address",
                align: "center",
                format: (address)=>{
                    return address.slice(0, 12) + '...' + address.slice(38)
                }
            },
            {
                Header: "Bet Count(24H)",
                accessor: "bet_count",
                align: "center",
            },
            {
                Header: "Bet Amount(24H)",
                accessor: "bet_amount",
                align: "center",
                format: (x)=>{
                  return formatAmount(x)
                }
            },
            {
                Header: "Points(24H)",
                accessor: "points",
                align: "center",
                // format: (x)=>{
                //   return formatAmount(x)
                // }
            },
            {
                Header: "Boost(24H)",
                accessor: "boost",
                align: "center",
                // format: (x)=>{
                //   return formatAmount(x)
                // }
            },
            {
                Header: "Total Points",
                accessor: "total_points",
                align: "center",
                // format: (x)=>{
                //   return formatAmount(x)
                // }
            }
            
        ],
        []
    )

  const StyledTabs = styled(Tabs)({
    // borderBottom: '1px solid #e8e8e8',
    '& .MuiTabs-indicator': {
      display: 'none',
    },
  });

  const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      textTransform: 'none',
      // fontWeight: theme.typography.fontWeightRegular,
      // fontSize: theme.typography.pxToRem(15),
      // marginRight: '48px',
      marginBottom: '32px',
      marginLeft: '16px',
      
      // border: '1px solid #06FC99',
      borderRadius: '75px',
      width: '180px',
      color: '#fff',
      font: '700 normal 16px sans',
      minHeight: '40px',
      height: '40px',
      border: '1px solid white',

      '&.Mui-selected': {
        backgroundColor: '#049659',
        borderColor: '#049659',
        color: '#fff',
      },
      '&.Mui-focusVisible': {
        color:'#fff',
      },
    }),
  );

  return (
    <React.Fragment>
      <Stack direction='row' alignItems='baseline' sx={{columnGap: '4px'}} >
        <Image  alt="" src='./fire.png' width='32' height='32' />
        <Typography component='div' sx={{marginTop: '18px', font: '700 normal 36px Arial'}}>
          Points Summit Challenge: Phase 1
        </Typography>
      </Stack>
      <Typography component='div' sx={{marginTop: '14px', font: '400 normal 20px Arial'}}>
        September 12 to September 30, 2023 (UTC+0)
      </Typography>
      <Typography component='div' sx={{marginTop: '14px', font: '700 normal 18px Arial'}} color='#aaaaaa'>
        Climb the leaderboard to boost your points!
      </Typography>
      <Typography component='div' sx={{ font: '700 normal 18px Arial'}} color='#aaaaaa'>
        The top 50 during the event will receive exclusive NFTs and special role rewards.  
        <a href="https://docs.0xcardinal.io/testnet-guides/ranking-rules" target="_blank" rel="noreferrer" style={{color: '#02A7F0', cursor: "pointer"}}> More&gt;&gt;</a>
      </Typography>
      <Typography component='div' sx={{marginTop: '14px', font: '700 normal 18px Arial'}} color='#aaaaaa'>
        <Stack direction='row' alignItems='baseline' sx={{columnGap: '8px'}} >
        Tally in: <span style={{font: '700 normal 28px Arial', color: 'yellow'}}>{countdown}</span>
        <Image  alt=""  ref={moreRef} src="./ask.png" width='18' height='18' style={{cursor: 'pointer'}} onClick={handleShowTip} />
        </Stack>
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', margin: '68px 0 0 0px' }} >
          <StyledTabs onChange={handleChange} value={value} selectionFollowsFocus={true}>
            {/* <StyledTab disableRipple label="Points Ranking" index={0} /> */}
            <StyledTab disableRipple label="Points Ranking" index={0} />
            <StyledTab disableRipple label="Winning Ranking" index={1} />
          </StyledTabs>
      </Box>
      
      {/* <Box hidden={value!==0} sx={{
        width: width,
      }}>
        <Typography ref={moreRef} component='div' sx={{font: '400 normal 14px Arial', textAlign: 'right', cursor:'pointer'}} color='#8080FF' onClick={()=>setShowPointsRules(!showPointsRules)}>
          Points Rules
        </Typography>
        <Box sx={{
          border: '1px solid #333333',
          borderRadius: '5px',
          borderTop: '1px solid #06FC99',
          boxShadow: '5px 5px 5px rgba(85, 85, 85, 0.34901960784313724)'
        }}>
        <StickyHeadTable columns={pointsColumns} data={pointsRows} maxHeight={null}/>
        </Box>
      </Box> */}
      <Box hidden={value!==1} sx={{
        width: width,
        border: '1px solid #333333',
        borderRadius: '5px',
        borderTop: '1px solid #06FC99',
        boxShadow: '5px 5px 5px rgba(85, 85, 85, 0.34901960784313724)',
      }}>
        <StickyHeadTable columns={winColumns} data={winRows} maxHeight={null} type='ranking'/>
      </Box>
      <Box hidden={value!==0} sx={{
        width: width,
        border: '1px solid #333333',
        borderRadius: '5px',
        borderTop: '1px solid #06FC99',
        boxShadow: '5px 5px 5px rgba(85, 85, 85, 0.34901960784313724)'
      }}>
        <StickyHeadTable columns={betColumns} data={betRows} maxHeight={null} type='ranking'/>
      </Box>
      {showPointsRules && <Box sx={{ position: 'absolute',
          left: moreRef.current.getBoundingClientRect().right + 2,
          top: moreRef.current.getBoundingClientRect().top,
          width: "360px",
          height: "270px",
          zIndex: '999',
          backgroundColor: "#272a2e",
          borderRadius: "8px"
          }} >
          <Typography component='div' color='yellow' sx={{ padding: '16px 16px 0px 16px', font: '500 normal 16px Arial'}}>
            Tips
          </Typography>
          <Typography component='div' sx={{ font: '400 normal 14px Arial'}}>
            <ul style={{padding: '0px 8px 0px 20px'}}>
            <li style={{margin: "8px"}}>
            Points are tallied daily at 24:00 (UTC+0).
            </li>
            <li style={{margin: "8px"}}>
            With the countdown timer, you can see in real-time how much time remains before the next tally, giving you the chance to improve your rank and earn additional points.
            </li>
             <li style={{margin: "8px"}}>
             Users ranked 1-10 in daily accumulated points will receive an extra 150 points the following day.
            </li>
             <li style={{margin: "8px"}}>
             Users ranked 11-25 in daily accumulated points will receive an extra 100 points the following day.
            </li>
             <li style={{margin: "8px"}}>
             Users ranked 26-50 in daily accumulated points will receive an extra 50 points the following day.
            </li>
            </ul>
          </Typography>
          {/* <Typography component='div' sx={{ font: '400 normal 14px sans'}}>
            * Users ranked 1-10 will get 2.0x their POINTS earned in 24H
          </Typography>
          <Typography component='div' sx={{ font: '400 normal 14px sans'}}>
            * Users ranked 11-25 will get 1.5x their POINTS earned in 24H
          </Typography>
          <Typography component='div' sx={{ font: '400 normal 14px sans'}}>
            * Users ranked 31-50 will get 1.2x their POINTS earned in 24H
          </Typography> */}
      </Box>}
    </React.Fragment>
  );
}
