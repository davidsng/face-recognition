import React, { Component } from 'react'
import './FaceRecognition.css';

export class FaceRecognition extends Component {
    render() {
        const { imageUrl, box } = this.props
        return (
            <div className='center ma'>
                <div className='absolute mt2'>
                    <img id='inputimage' alt='' src={imageUrl} width='500px' heigh='auto' />
                    {box.map(b => {
                        return <div key={b.topRow} className='bounding-box' style={{ top: b.topRow, right: b.rightCol, bottom: b.bottomRow, left: b.leftCol }}></div>
                    })
                    }
                </div>
            </div>
        );
    }
}

export default FaceRecognition;