import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import Typography from '@mui/material/Typography';
import StepLabel from '@mui/material/StepLabel';
import CustomizedSteppers from './Progress'
import ReactLoading from 'react-loading'

import styles from "../../styles/Bet.module.css"

const StepInfo = ()=>{
    const [stepInfo, setStepInfo] = useState({steps: [], active: 0, isShow: false, stepTitle: '', stepMsg: ''})
    const {steps, active, isShow, stepTitle, stepMsg, costInfo} = stepInfo
    const [stepNodes, setStepNodes] = useState({})

    return <>
    <div className={`${isLoading?styles.display:styles.displayNone} ${styles.umask}`}>
        <div className={styles.loading_container}>
          <div style={{font: '700 18px normal sans-serif', padding: '0px 0 40px 0'}}>{stepTitle?stepTitle.charAt(0).toUpperCase() + stepTitle.slice(1):''} tracking</div>
          {!isShow?
            <ReactLoading type='spinningBubbles' color='#06FC99' height={'16%'} width={'12%'} />:
            <CustomizedSteppers steps={steps} curStep={active} />}
          <div style={{color: '#AAAAAA', textAlign: 'left', width: '90%', font: '650 16px normal sans', paddingBottom: '8px'}}>{stepTitle? (stepTitle=='approve'? 'Bet' : stepTitle.charAt(0).toUpperCase() + stepTitle.slice(1)):''} {(stepTitle && stepTitle=='bet' && (tipInfo.status==BetStatus.win || tipInfo.status==BetStatus.failed))?'Result': 'Information'}</div>
          <div className={styles.tipContent}>
            {stepMsg}
          </div>
          <button disabled={(!stepInfo || !stepTitle || stepInfo?.active !== stepNodes[stepTitle]?.length)? true : false} style={{height: '48px', border: 'none', cursor: 'pointer', width: '90%', marginTop: '8px', backgroundColor: (!stepInfo || !stepTitle || stepInfo?.active != stepNodes[stepTitle]?.length)? '#333':'#f40000'}}  onClick={()=>{}}>
            { stepInfo.active != stepNodes[stepTitle]?.length? 
                "Processing...": stepTitle
            }
          </button>
        </div>
    </div>
    </>
}