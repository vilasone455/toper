import React from 'react'

export default function TabMenu() {
    return  (

        <div className="fluent-menu" data-role="fluentmenu" style={{borderBottom: 'solid 1px rgb(217, 217, 217)'}}>

          <div style={{position: 'absolute', width: '100%', marginTop: '2px'}}>
            <span style={{fontSize: '0.8rem', marginLeft: '40%', zIndex: 10}}>Save mesage</span>
          </div>
          <ul className="tabs-holder">
            <li className="special">
              <a>File</a>
            </li>
            <li className="active" >
              <a href="#tab_home">Home</a>
            </li>
            <li >
              <a href="#tab_mailings">Edit</a>
            </li>
            <li >
              <a href="#tab_folder">Account</a>
            </li>
            <div style={{textAlign: 'right'}}>
             
            </div>
          </ul>
          <div className="tabs-content" ></div>
        </div>
        
      );
}
