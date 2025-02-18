import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import boons from './all_boons.json'


const Popup = ({ isOpen, setIsOpen, boonData, position }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y + 8}px`
      }}
    >
      <DialogPanel>
        {boonData && (
          <>
            <DialogTitle>{boonData.name}</DialogTitle>
            <p>
              {boonData.description}
              </p>
              {boonData.prerequisites?.prereqs && boonData.prerequisites.prereqs.length > 0 && (
              <div>

                <h3>Prerequisites ({boonData.prerequisites.type}):</h3>
                {console.log(boonData.prerequisites)}
                {boonData.prerequisites.prereqs.map((prereq, index) => {
                  return (
                    <div key={index}>
                      {prereq.boon}
                    </div>
                  );
                })}
              </div>
            )}
            
          </>
        )}
      </DialogPanel>
    </Dialog>
  );

};


export default Popup;
