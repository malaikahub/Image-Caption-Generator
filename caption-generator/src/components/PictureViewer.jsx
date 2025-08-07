import React, { useState, useEffect } from 'react';
import "./PictureViewer.css"

const PictureViewer = ({ imageUrl }) => {
    const [url, setUrl] = useState(null);
    useEffect(() => {
        setUrl(imageUrl)
    }, [imageUrl])
    return (
        <div className="picture-viewer">
            {
                url ?
                    <img src={imageUrl} alt="Upload" className="picture-viewer-image" />
                    : <h1 className="picture-viewer-header">No image Selected </h1>
            }
        </div>
    )
}

export default PictureViewer