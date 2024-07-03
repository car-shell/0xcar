import * as React from 'react';
const Failed = ({ location }) => {
    React.useEffect(()=>{
      setTimeout(() => {
        window.close()
      }, 3000);
    })
    return <div>failed</div>;
  };

export default Failed