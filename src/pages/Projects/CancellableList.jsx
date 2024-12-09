import React from 'react';

function CancellableList({leftSideItem, rightSideItem, clickfuntion,value,type}) {

    return (
        <div style={{display:'flex',flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:'3px 10px', border:'1px solid #F1F1F1', borderRadius:'5px', margin: '5px 0',minHeight:'50px', 
        background: '#F1F1F1', color: '#8C959F'}}>
            <div style={{display:'flex',flexDirection:'row',alignItems:'center', width:'100%'}}>
                { leftSideItem }
            </div>
            {
                rightSideItem && <div onClick={()=>clickfuntion(value,type)} style={{cursor:'pointer'}}>{rightSideItem}</div>
            }
        </div>
    )
}

export default CancellableList
