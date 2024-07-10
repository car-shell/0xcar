import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import styles from './LuckyWheel.module.css';
import { getUrl, post } from "../../pages/api/axios";
import useToast from '../Toast'

const LuckyWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [totalSize, setTotalSize] = useState(0)
  const [segments, setSegments] = useState([])
  const {ToastUI, showToast} = useToast()
  const COLOR = ['#391099', '#9f2922', '#4d8280', '#417f60', '#8f46f4']
  useEffect( ()=>{
    const getList = async () => { 
        let resp = await getUrl("/activite/list")
        if (resp.status == 200) {
            let s = resp.data.filter(item=>item.atype.startsWith('wheel'))
            s = s.map((x, index)=>({...x, color: COLOR[index%5]}))
            setSegments(s)  
            let t = s.reduce((acc, segment) => acc + Number(segment.additional), 0)
            setTotalSize(t)
        }
    }
    getList()
  }, [])

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleSpin = async () => {
    if (spinning) return;

    let resp = await getUrl("/wheel/random")
    if (resp.status != 200 || resp.data.hit == -1 ) {
      showToast("You have checked today")
      return
    }
    console.log(segments)

    console.log(resp.data)
    let targetIndex = segments.findIndex((x)=>x.id==resp.data.hit);
    console.log(targetIndex)

    const newRotation = 10*360 - 360 / segments.length * (targetIndex + 0.5)
    setRotation(newRotation);
    setSpinning(true);

    setTimeout(() => {
      setSpinning(false);
      showToast(`You won ${segments[targetIndex].points} PTS!`);
    }, 4000);
  };

  const calculateRotation = (index) => {
    let cumulativeSize = 0;
    for (let i = 0; i < index; i++) {
      cumulativeSize += Number(segments[i].additional);
    }
   
    const segmentAngle = (cumulativeSize + Number(segments[index].additional) / 2) / totalSize * 360;
    return 360 - segmentAngle;
  }

  let cumulativeSize = 0;

  return (
    
    <Box display="flex" flexDirection="column" alignItems="center" marginTop='40px' rowGap='24px'>
        <ToastUI />
      {totalSize == 0? <></>: 
  
      <Box className={styles.wheelContainer}>
        <svg className={styles.wheel} viewBox="-190 -190 380 380" style={{ transform: `rotate(${rotation}deg)` }}>
          {segments.map((segment, index) => {
            const angle = 360 / segments.length;
            const largeArcFlag = angle > 180 ? 1 : 0;
            const x1 = 180 * Math.cos((angle * index * Math.PI) / 180);
            const y1 = 180 * Math.sin((angle * index * Math.PI) / 180);
            const x2 = 180 * Math.cos((angle * (index + 1) * Math.PI) / 180);
            const y2 = 180 * Math.sin((angle * (index + 1) * Math.PI) / 180);
            const textX = 100 * Math.cos((angle * (index + 0.5) * Math.PI) / 180);
            const textY = 100 * Math.sin((angle * (index + 0.5) * Math.PI) / 180);

            return (
              <g key={index}>
                <path
                  d={`M 0 0 L ${x1} ${y1} A 180 180 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={segment.color}
                  // transform={`rotate(${angle * index}, 0, 0)`}
                />
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize="24"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${angle * (index + 0.5)}, ${textX}, ${textY})`}
                  zIndex="9999"
                >
                  {segment.points}
                </text>
              </g>
            );
          })}
        </svg>
        {/* <svg className={styles.wheel} viewBox="-190 -190 380 380" style={{ transform: `rotate(${rotation}deg)` }}>
          {segments.map((segment, index) => {
            const startAngle = (cumulativeSize / totalSize) * 360 - 90;
            cumulativeSize += Number(segment.additional);
            const endAngle = (cumulativeSize / totalSize) * 360 - 90;
            const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;
            const x1 = 185 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 185 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 185 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 185 * Math.sin((endAngle * Math.PI) / 180);
            const textAngle = (startAngle + endAngle) / 2;
            const textX = 120 * Math.cos((textAngle * Math.PI) / 180);
            const textY = 120 * Math.sin((textAngle * Math.PI) / 180);
            return (
              <g key={index}>
                <path
                  d={`M 0 0 L ${x1} ${y1} A 185 185 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={segment.color}
                />
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize="12"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                >
                  {segment.points} PTS
                </text>
              </g>
            );
          })}
        </svg> */}
        <Box className={styles.pointer}></Box>
      </Box>}
      <Button variant="contained" color="primary" onClick={handleSpin} disabled={spinning}>
        Spin the Wheel
      </Button>
    
    </Box>
  );
};

export default LuckyWheel;
