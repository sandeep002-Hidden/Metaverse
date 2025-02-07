import React, { useEffect } from 'react'

export default function AssetFabric() {
  useEffect(()=>{
    const assetDetails=localStorage.getItem("AssetDetails")
    console.log(assetDetails)
  },[])
  return (
    <div>
      hello
    </div>
  )
}
