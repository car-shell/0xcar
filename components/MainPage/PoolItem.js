import * as React from 'react';
import { useCallback, useState, useRef, useEffect, useContext} from "react";
import {Box, Card, CardActionArea, Typography, Button} from '@mui/material'
import { styled } from '@mui/material/styles';
import Image from 'next/image'


import { useGameContract } from "../../data/game";

const PoolItem = ({poolPro, my = true}) => {
    const [value, setValue] = React.useState(0);
    const [pool, setPool] = React.useState(poolPro);

    const click = () => {
        
    };
    return <>
        {
        <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '128px', width: '100%', marginTop: '48px', border: '1px solid orange', backgroundColor: 'transparent'}}>
            <Box alignItems='center' sx={{display: 'flex', flexDirection: 'column', paddingRight: '28px', borderRight: '1px solid orange', width:'70%'}}>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '28px', color: 'orange'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingRight: '32px'}}>
                        Initial Pool Fund
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '650'}}>
                        {pool['initBalance']} CDNL
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '28px', color: 'orange'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingRight: '32px'}}>
                        Initial Pool Fund
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '650'}}>
                        {pool['remainBalance']} CDNL
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '28px', color: 'orange'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingRight: '32px'}}>
                        Bet count
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '650'}}>
                        {pool['betCount']}
                    </Typography>
                </Box>
            </Box>
            { !my?
            <Box sx={{display: 'flex', flexDirection: 'column',  alignItems: 'center' }}>
                <Button variant="outlined" sx={{marginLeft: '28px', width:'80%', height:'48px', backgroundColor: 'orange'}} onClick={click}>
                    Bet
                </Button>
            </Box>
                :
            <Box sx={{display: 'flex', flexDirection: 'column',  alignItems: 'center' }}>
                <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingRight: '32px'}}>
                    Start Time
                </Typography>
                <Typography component='div' sx={{fontSize: '18px', fontWeight: '650'}}>
                    {new Date(pool['startTimestamp'])}
                </Typography>
            </Box>}
        </Card>}
    </>
}

export default PoolItem;