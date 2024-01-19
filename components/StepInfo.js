import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import Typography from '@mui/material/Typography';
import StepLabel from '@mui/material/StepLabel';
import CustomizedSteppers from './Bet/Progress'
import ReactLoading from 'react-loading'
import {  useState, useEffect} from "react";
import {useRouter} from 'next/router'

import styles from "../styles/Bet.module.css"


const useStepInfo = () => {
    const [stepNodes, setStepNodes] = useState({})
    const [stepInfo, setStepInfo] = useState({stepName: '', active: 0, isShow: false, stepTitle: '', stepMsg: '', buttonContent: ''})

    const StepInfo = ()=>{
        const {stepName, active, isShow, stepTitle, stepMsg, buttonContent} = stepInfo
        const router = useRouter()
        return <>{ isShow && 
        <div className={`${isShow?styles.display:styles.displayNone} ${styles.umask}`}>
            <div className={styles.loading_container}>
              <div style={{font: '700 18px normal sans-serif', padding: '0px 0 40px 0'}}>{stepTitle?stepTitle.charAt(0).toUpperCase() + stepTitle.slice(1):''}</div>
              {!isShow?
                <ReactLoading type='spinningBubbles' color='#06FC99' height={'16%'} width={'12%'} />:
                <CustomizedSteppers steps={stepNodes[stepName]} curStep={active} />}
              {stepMsg && <div style={{color: '#AAAAAA', textAlign: 'left', width: '90%', font: '650 16px normal sans', paddingBottom: '8px'}}>{stepTitle? (stepTitle=='approve'? 'Bet' : stepTitle.charAt(0).toUpperCase() + stepTitle.slice(1)):''} {(stepTitle && stepTitle=='bet' && (tipInfo.status==BetStatus.win || tipInfo.status==BetStatus.failed))?'Result': 'Information'}</div>}
              {stepMsg &&<div className={styles.tipContent}>
                {stepMsg}
              </div>}
              <button disabled={(!stepInfo || !stepTitle || stepInfo?.active !== stepNodes[stepName]?.length)? true : false} style={{height: '48px', border: 'none', cursor: 'pointer', width: '90%', marginTop: '8px', backgroundColor: (!stepInfo || !stepTitle || stepInfo?.active != stepNodes[stepName]?.length)? '#333':'#f40000'}}  onClick={()=>{
                setStepInfo((pre)=>{return {...pre, isShow: false}})
                router.push("/mypool")
              }}>
                { active != stepNodes[stepName]?.length? 
                    "Processing...": buttonContent
                }
              </button>
            </div>
        </div>
        }
        </>
    }

    return {setStepInfo, setStepNodes, StepInfo}
}

export default useStepInfo;