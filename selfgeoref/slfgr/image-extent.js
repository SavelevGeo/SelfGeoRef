function imgExtForMapExt (
    imgDims, mapExt
  ) {
    let imgExtX, imgExtY
    
    const imgWidth_px = imgDims[0];
    const imgHeight_px = imgDims[1];
    const landscape = imgWidth_px > imgHeight_px;
    
    const mapExtX = [mapExt[0], mapExt[2]];
    const mapExtY = [mapExt[1], mapExt[3]];
    
    if (landscape) {
      //image horizontally fits map
      imgExtX = mapExtX;
      
      //calculating the vertical extent
      const mapSizeX = Math.abs(mapExtX[1] - mapExtX[0]);
      const mapCenterY = (mapExtY[1] + mapExtY[0]) / 2;
      
      const imgSizeX = mapSizeX;
      const imgSizeY = (imgHeight_px * imgSizeX) / imgWidth_px; //propotionally
      const imgHalfSizeY = imgSizeY / 2;
      
      imgExtY = [
          mapCenterY - imgHalfSizeY,
          mapCenterY + imgHalfSizeY
        ];
      
    } else {
      
    }  
    
    return [
        imgExtX[0], imgExtY[0],
        imgExtX[1], imgExtY[1]
      ] 
  }

export default imgExtForMapExt