import { removeMergeContent } from '@/lib/merge'

export default function RemoveMergeContentBanner () {
  return <div className="text-center pt-5 pb-5 bg-black text-white cursor-pointer" onClick={() => removeMergeContent() }>You are previewing merge content. Click here to remove.</div>
}