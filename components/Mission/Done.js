import * as React from 'react';
const Done = ({ location }) => {

  React.useEffect(()=>{
      setTimeout(() => {
        window.close()
      }, 3000);
    })
    return <div>Done</div>;
  };

export default Done