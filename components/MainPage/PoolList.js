import * as React from 'react';
import { useCallback, useState, useRef, useEffect, useContext} from "react";
import {Tabs, Tab, Box, Card, Typography, Button, Stack} from '@mui/material'
import { styled } from '@mui/material/styles';
import Image from 'next/image'
import PoolItem from './PoolItem'


import { useGameContract } from "../../data/game";

const PoolList = () => {
    const {pools} = useGameContract();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);

        console.log(pools);
        if (newValue === 1 ) {
            pools.sort((a,b)=>{
                return a.betCount > b.betCount;
            })
        } else if ( newValue === 0 ) {
            pools.sort((a,b)=>{
                a.remainBalance > b.remainBalance;
            })
        }
    };
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
            // marginBottom: '32px',
            marginLeft: '30px',
            
            // border: '1px solid #06FC99',
            borderRadius: '150px',
            width: '200px',
            color: '#fff',
            font: '700 normal 16px sans',
            minHeight: '40px',
            height: '40px',
            maxWidth: '200px',
            border: '1px solid white',

            '&.Mui-selected': {
            backgroundColor: 'transparent',
            borderColor: '#F59A23',
            color: '#F59A23',
            },
            '&.Mui-focusVisible': {
            color:'#fff',
            },
        }),
    );

    return (
    <React.Fragment>
        <Stack width='80%' display='column' justifyContent='center' alignItems="center" sx={{ borderBottom: 1, borderColor: 'divider', margin: '32px 0 0 0px'}} >
            <StyledTabs onChange={handleChange} value={value} selectionFollowsFocus={true} >
                <StyledTab disableRipple label="Sort By Balance" index={0} />
                <StyledTab disableRipple label="Sort By Polularity" index={1} />
            </StyledTabs>
        </Stack>
        
        <Stack width='80%' direction='column' justifyContent="flex-between" alignItems="center" gap='16px' >
        {pools && pools.filter((item)=>{return item.isUsed}).map((item)=>{
           return <PoolItem key={item.id} poolPro={item} my={false}/>
        })}
        </Stack>
    </React.Fragment>);
}

export default PoolList;