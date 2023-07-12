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

export default function Ranking() {
  const [value, setValue] = React.useState(0);
  const [winRows, setWinRows] = React.useState([]);
  const [betRows, setBetRows] = React.useState([]);

  const {chain, chains} = useNetwork()
  const chainId = React.useMemo(()=>{ return chain != undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) != -1 ? chain.id : defaultChainId}, [chain])
  const addressGameContract = ADDRESSES[chainId]?.game;

  const handleChange = (event, newValue) => {
      setValue(newValue);
  };

  const parseData = (datastr)=>{
    datastr = datastr.substr(2)
    let data = []
    for (let index = 0; index < datastr.length; index+=64) {
      data.push(parseInt(datastr.substr(index, 64), 16))
    }
    return data;
  }

  const makeRankingData = (ranking)=>{
    console.log(ranking);
    let arr = Object.keys(ranking).map((key)=>{
      return [key, ranking[key]]
    })
    
    arr.sort((a, b)=>{
      return b[1][0] - a[1][0]
    })

    const r = arr.map((item, i)=>{
      return createData(i+1, item[0], item[1][1], item[1][0])
    })
    console.log(r);
    return r
  }

  const getWinLogs = React.useCallback(async ()=>{
      const logs = await getUrl({params : {
          module: 'logs',
          action: 'getLogs',
          fromBlock: 30652902,
          address: addressGameContract,
          topic0: ADDRESSES[chainId].topic_win,
          apikey: "447AKQ7VAC9WVQ4NW41DH8I5YGD2MD72RE"}})

      console.log(logs.data);
      const results = logs.data['result']
      let ranking = {}
      for (let index = 0; index < results.length; index++) {
       const element = results[index];
        let address = '0x'+element['topics'][1].substr(26)
        let data = parseData(element['data'])
        
        ranking[address] = ranking[address] === undefined ? [data[2]/1e18, 1] : [ranking[address][0]+data[2]/1e18, ranking[address][1]+1]
      }
      setWinRows(makeRankingData(ranking))
  }, [winRows])

  const getBetLogs = React.useCallback(async ()=>{
      const logs = await getUrl({params : {
          module: 'logs',
          action: 'getLogs',
          fromBlock: 30652902,
          address: addressGameContract,
          topic0: ADDRESSES[chainId].topic_bet,
          apikey: "447AKQ7VAC9WVQ4NW41DH8I5YGD2MD72RE"}})

      const results = logs.data['result']
      let ranking = {}
      for (let index = 0; index < results.length; index++) {
        const element = results[index];
        let address = '0x'+element['topics'][1].substr(26)
        let data = parseData(element['data'])
        console.log(data);
        ranking[address] = ranking[address] === undefined ? [data[1]/1e18, 1] : [ranking[address][0]+data[1]/1e18, ranking[address][1]+1]
      }
      setBetRows(makeRankingData(ranking))
  }, [betRows])

  React.useEffect(()=>{
    value==0?getWinLogs():getBetLogs()
    const i = setInterval(() => {
      value==0?getWinLogs():getBetLogs()
    }, 30000);

    return ()=>clearInterval(i)
  }, [value])

  const winColumns = React.useMemo(
        () => [
            {
                Header: "Ranking",
                accessor: "ranking",
                align: "center",
                
            },
            {
                Header: "Player",
                accessor: "address",
                align: "center"
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

    const betColumns = React.useMemo(
        () => [
            {
                Header: "Ranking",
                accessor: "ranking",
                align: "center",
                
            },
            {
                Header: "Player",
                accessor: "address",
                align: "center"
            },
            {
                Header: "Bet Count",
                accessor: "count",
                align: "center",
            },
            {
                Header: "Total Bet",
                accessor: "total",
                align: "center",
                format: (x)=>{
                  return formatAmount(x)
                }
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
              <StyledTab disableRipple label="Winning Ranking" index={0} />
              <StyledTab label="Bet Ranking" index={1} />
          </StyledTabs>
      </Box>
      <Box hidden={value!==0} sx={{
        width: '920px',
        border: '1px solid #333333',
        borderRadius: '5px',
        borderTop: '1px solid #06FC99',
        boxShadow: '5px 5px 5px rgba(85, 85, 85, 0.34901960784313724)',
      }}>
        <StickyHeadTable columns={winColumns} data={winRows}/>
      </Box>
      <Box hidden={value!==1} sx={{
        width: '920px',
        border: '1px solid #333333',
        borderRadius: '5px',
        borderTop: '1px solid #06FC99',
        boxShadow: '5px 5px 5px rgba(85, 85, 85, 0.34901960784313724)'
      }}>
        <StickyHeadTable columns={betColumns} data={betRows}/>
      </Box>
    </React.Fragment>
  );
}
