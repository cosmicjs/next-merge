import { removeMergeContent } from '@/lib/merge'

export default function RemoveMergeContentBanner () {
  return <div className="text-center pt-5 pb-5 bg-black text-white">You are previewing merge content. <span className="cursor-pointer" onClick={() => removeMergeContent() }>Click here to remove</span>.</div>
}