import * as React from 'react';
import { useCallback, useState, useRef, useEffect, useContext} from "react";
import {Box, Card, CardActionArea, Typography, Button} from '@mui/material'
import { styled } from '@mui/material/styles';
import Image from 'next/image'
import { formatAmount, n1e18 } from "../utils";
import BaseLink from "../Head/BaseLink"
import { useGameContract } from "../../data/game";
import { useTokenContract } from "../../data/token";


const PoolItem = ({poolPro, my=false}) => {
    const [value, setValue] = React.useState(0);
    const [pool, setPool] = React.useState(poolPro);
    const {token} = useTokenContract();

    return <>
        {
        <Box  width='100%'>
            <Box  width='100px' height='32px' sx={{position: 'relative',  top: '8px', left: '10px', textAlign: 'center', border: '1px solid orange', borderRadius: '50px', font: "700 normal 14px Arial", lineHeight: '32px', color: 'white', backgroundColor: 'orange' }} >
                    #00{Number(pool.id)} Pool
            </Box>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '128px', border: '1px solid orange', backgroundColor: 'transparent' , borderRadius: '10px'}}>
                <Box alignItems='center' sx={{display: 'flex', flexDirection: 'column', paddingRight: '28px', borderRight: '1px solid orange', width:'58%'}}>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '28px', color: 'orange', width: '100%'}}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', padding: '0 24px 0 32px', textAlign: 'left', width: '50%'}}>
                            Initial Pool Fund
                        </Typography>
                        <Typography component='div' sx={{fontSize: '18px', fontWeight: '650'}}>
                            {formatAmount(pool?.initBalance/n1e18)} {token?.symbol}
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '28px', color: 'orange',width: '100%'}}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', padding: '0 24px 0 32px', textAlign: 'left', width: '50%'}}>
                            Current Pool Balance
                        </Typography>
                        <Typography component='div' sx={{fontSize: '18px', fontWeight: '650'}}>
                            {formatAmount(pool?.remainBalance/n1e18)} {token?.symbol}
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '28px', color: 'orange', width: '100%'}}>
                        <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', padding: '0 24px 0 32px', textAlign: 'left', width: '50%'}}>
                            Bet count
                        </Typography>
                        <Typography component='div' sx={{fontSize: '18px', fontWeight: '650'}}>
                            {pool.betCount}
                        </Typography>
                    </Box>
                </Box>
                { !my?
                <Box sx={{display: 'flex', flexDirection: 'column',  alignItems: 'center', width:'42%'}}>
                    <BaseLink href={"/pool/"+pool.id} style={{width: "64%"}} >
                        <Button variant="contained" sx={{width: "100%", height:'48px', backgroundColor: 'orange', borderRadius: '150px'}} >
                                Bet
                        </Button>
                    </BaseLink>
                </Box>
                    :
                <Box sx={{display: 'flex', flexDirection: 'row',  alignItems: 'center', color: 'orange', marginLeft: '28px', width:'42%'}}>
                    <Typography component='div' sx={{fontSize: '14px', fontWeight: '400', paddingRight: '32px'}}>
                        Start Time
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '650'}}>
                        {/* {new Date(Number(pool['startTimestamp']))} */} 10110010101
                    </Typography>
                </Box>}
            </Card>
        </Box>}
    </>
}

export default PoolItem;