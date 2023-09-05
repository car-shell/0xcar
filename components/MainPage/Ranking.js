import * as React from 'react';
import {Tabs, Tab, Box, Card, Typography, IconButton, CardActionArea, Checkbox} from '@mui/material'
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
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

  const {chain, chains} = useNetwork()
  const chainId = React.useMemo(()=>{ return chain != undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) != -1 ? chain.id : defaultChainId}, [chain])
  const addressGameContract = ADDRESSES[chainId]?.game;

  const handleChange = (event, newValue) => {
      setValue(newValue);
  };

  const getPointsLogs = React.useCallback(async ()=>{
    try {
      const logs = await getUrl("/points_ranking")
      console.log(logs);
      const r = logs.data.map((item, i)=>{
        return {ranking: item['last_24_ranking'], address: item['player'], bet_count: item['last_24_bet_counts'], bet_amount: item["last_24_bet_amounts"], points: item['last_24'], total_points: item['total']}
      })
      
      setPointsRows(r)
    } catch (error) {
      console.log(error);
    }
      
  }, [winRows])

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
        return createData(i+1, item["address"], item["bet_count"], item["total_bet"])
      })
      setBetRows(r)
    } catch (error) {
      console.log(error);
    }
      
  }, [betRows])

  React.useEffect(()=>{
    value==0?getWinLogs():getBetLogs()
    getPointsLogs()
    const i = setInterval(() => {
      value==0?getWinLogs():getBetLogs()
      getPointsLogs()
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
                Header: "Win Count",
                accessor: "count",
                align: "center",
            },
            {
                Header: "Total Netwin",
                accessor: "total",
                align: "center",
                format: (x)=>{
                  return formatAmount(x)
                }
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
                Header: "Total Netwin",
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
      
      // border: '1px solid #06FC99',
      borderRadius: '75px',
      width: '180px',
      color: '#fff',
      font: '700 normal 16px sans',
      minHeight: '40px',
      height: '40px',

      '&.Mui-selected': {
        backgroundColor: '#049659',
        color: '#fff',
      },
      '&.Mui-focusVisible': {
        color:'#fff',
      },
    }),
  );

  return (
    <React.Fragment>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', padding: '8px 0 0 0px' }} >
          <StyledTabs onChange={handleChange} value={value} selectionFollowsFocus={true}>
            <StyledTab disableRipple label="Points Ranking" index={0} />
            <StyledTab disableRipple label="Winning Ranking" index={1} />
            <StyledTab label="Bet Ranking" index={2} />
          </StyledTabs>
      </Box>
      <Box hidden={value!==0} sx={{
        width: width,
        border: '1px solid #333333',
        borderRadius: '5px',
        borderTop: '1px solid #06FC99',
        boxShadow: '5px 5px 5px rgba(85, 85, 85, 0.34901960784313724)'
      }}>
        <StickyHeadTable columns={pointsColumns} data={pointsRows} maxHeight={null}/>
      </Box>
      <Box hidden={value!==1} sx={{
        width: width,
        border: '1px solid #333333',
        borderRadius: '5px',
        borderTop: '1px solid #06FC99',
        boxShadow: '5px 5px 5px rgba(85, 85, 85, 0.34901960784313724)',
      }}>
        <StickyHeadTable columns={winColumns} data={winRows} maxHeight={null}/>
      </Box>
      <Box hidden={value!==2} sx={{
        width: width,
        border: '1px solid #333333',
        borderRadius: '5px',
        borderTop: '1px solid #06FC99',
        boxShadow: '5px 5px 5px rgba(85, 85, 85, 0.34901960784313724)'
      }}>
        <StickyHeadTable columns={betColumns} data={betRows} maxHeight={null}/>
      </Box>
    </React.Fragment>
  );
}
