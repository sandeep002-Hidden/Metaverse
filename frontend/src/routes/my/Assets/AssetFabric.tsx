<<<<<<< HEAD
import React, { useEffect } from 'react'
=======
import ShapeEditor from '@/components/ShapeEditor/ShapeEditor'
import  { useEffect } from 'react'
>>>>>>> 4d81fdd (Saving progress before branch change)

export default function AssetFabric() {
  useEffect(()=>{
    const assetDetails=localStorage.getItem("AssetDetails")
    console.log(assetDetails)
  },[])
  return (
    <div>
<<<<<<< HEAD
      hello
=======
      <ShapeEditor />
>>>>>>> 4d81fdd (Saving progress before branch change)
    </div>
  )
}
