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
        <Box sx={{ borderBottom: 1, borderColor: 'divider', margin: '68px 0 0 0px' }} >
            <StyledTabs onChange={handleChange} value={value} selectionFollowsFocus={true}>
                <StyledTab disableRipple label="Sort By Balance" index={0} />
                <StyledTab disableRipple label="Sort By Polularity" index={1} />
            </StyledTabs>
        </Box>
        
        {pools && pools.map((item, i)=>{
            <PoolItem poolPro={item}/>
        })}
    </React.Fragment>);
}

export default PoolList;