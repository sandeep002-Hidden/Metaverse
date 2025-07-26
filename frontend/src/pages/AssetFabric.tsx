import ShapeEditor from '@/components/ShapeEditor/ShapeEditor'
import  { useEffect } from 'react'

export default function AssetFabric() {
  useEffect(()=>{
    const assetDetails=localStorage.getItem("AssetDetails")
    console.log(assetDetails)
  },[])
  return (
    <div>
      <ShapeEditor />
    </div>
  )
}
