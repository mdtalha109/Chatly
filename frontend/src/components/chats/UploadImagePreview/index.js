import React from 'react'
import { Button } from '../../ui'

const UploadImagePreview = ({image}) => {
    return (
        <div className='relative shadow-lg' style={{ width: "max-content" }}>
            <img
                src={image}
                alt='uploaded_image'
                className='object-contain w-max'
                style={{ height: "250px", backgroundPosition: "center" }}
            />

            <Button className='bg-black absolute top-2 left-2'>
                X
            </Button>
        </div>
    )
}

export default UploadImagePreview