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
import { useNetwork } from "wagmi";

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
  const [showPointsRules, setShowPointsRules] = React.useState(false);
  // const pointsRulesRef = React.useRef()

  const {chain, chains} = useNetwork()
  const chainId = React.useMemo(()=>{ return chain != undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) != -1 ? chain.id : defaultChainId}, [chain])
  const addressGameContract = ADDRESSES[chainId]?.game;

  const handleChange = (event, newValue) => {
      setValue(newValue);
  };

  const getWinLogs = React.useCallback(async ()=>{
    try {
      const logs = await getUrl("/bet_ranking", {params : {type: "win"}})
      console.log(logs);
      const r = logs.data.map((item, i)=>{
        return createData(i+1, item["address"], item["win_count"], item["total_win"])
      })

      setWinRows(r)
    } catch (error) {
      console.log(error);
    }
      
  }, [winRows])

  const getBetLogs = React.useCallback(async ()=>{
    try {
      const logs = await getUrl("/bet_ranking", {params : {type: "bet"}})
      console.log(logs);
      const r = logs.data.map((item, i)=>{
        return { id: i+1, ranking: i+1, address: item["address"], count: item["bet_count"], total: item["total_bet"],
            total_points: item['total_point'] }; //createData(i+1, item["address"], item["bet_count"], item["total_bet"])
      })

      const pr = await getUrl("/points_record")
      if (pr.data.length != 0) {
        console.log(r);
        const l = pr.data.map((item)=> {
          for(let record_bet of r) {
            if (record_bet['address'] == item['player']) {
              return {...record_bet, yesterday: item['points']}
            }
          }
        })
        setBetRows(l)
      } else {
        setBetRows(r)
      }
    
      
    } catch (error) {
      console.log(error);
    }
      
  }, [betRows])

  React.useEffect(()=>{
    value==0?getBetLogs():getWinLogs()
    // getPointsLogs()
    const i = setInterval(() => {
      value==0?getWinLogs():getBetLogs()
      // getPointsLogs()
    }, 30000);

    return ()=>clearInterval(i)
  }, [value])

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
                Header: "Total Net Win",
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
        <Image src='./fire.png' width='32' height='32' />
        <Typography component='div' sx={{marginTop: '18px', font: '700 normal 36px Arial'}}>
          ROLLING LEADERBOARD: Phase 1
        </Typography>
      </Stack>
      <Typography component='div' sx={{marginTop: '14px', font: '400 normal 20px Arial'}}>
        Duration: September 10 - 30, 2023
      </Typography>
      <Typography component='div' sx={{marginTop: '14px', font: '700 normal 18px Arial'}} color='#aaaaaa'>
        Climb the leaderboard to boost your points!
      </Typography>
      <Typography component='div' sx={{ font: '700 normal 18px Arial'}} color='#aaaaaa'>
        The top 50 during the event will receive exclusive NFTs and special role rewards
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
        <Typography ref={pointsRulesRef} component='div' sx={{font: '400 normal 14px Arial', textAlign: 'right', cursor:'pointer'}} color='#8080FF' onClick={()=>setShowPointsRules(!showPointsRules)}>
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
        <StickyHeadTable columns={winColumns} data={winRows} maxHeight={null}/>
      </Box>
      <Box hidden={value!==0} sx={{
        width: width,
        border: '1px solid #333333',
        borderRadius: '5px',
        borderTop: '1px solid #06FC99',
        boxShadow: '5px 5px 5px rgba(85, 85, 85, 0.34901960784313724)'
      }}>
        <StickyHeadTable columns={betColumns} data={betRows} maxHeight={null}/>
      </Box>
      {/* {showPointsRules && <Box sx={{ position: 'absolute',
          right: pointsRulesRef.current.getBoundingClientRect().left,
          top: pointsRulesRef.current.getBoundingClientRect().bottom,
          width: "360px",
          height: "200px",
          zIndex: '999',
          padding: '8px 0px 0px 8px',
          backgroundColor: "#272a2e"}}>
          <Typography component='div' sx={{ font: '400 normal 14px sans'}}>
            Points Rules
          </Typography>
          <Typography component='div' sx={{ font: '400 normal 14px sans'}}>
            * Points = (Bet count * 10) + (Bet Amount / 10)
          </Typography>
          <Typography component='div' sx={{ font: '400 normal 14px sans'}}>
            * Users ranked 1-10 will get 2.0x their POINTS earned in 24H
          </Typography>
          <Typography component='div' sx={{ font: '400 normal 14px sans'}}>
            * Users ranked 11-25 will get 1.5x their POINTS earned in 24H
          </Typography>
          <Typography component='div' sx={{ font: '400 normal 14px sans'}}>
            * Users ranked 31-50 will get 1.2x their POINTS earned in 24H
          </Typography>
      </Box>} */}
    </React.Fragment>
  );
}
