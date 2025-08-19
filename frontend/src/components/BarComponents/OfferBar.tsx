import { useState } from "react"
import { GoArrowRight } from "react-icons/go"
import { RxCross2 } from "react-icons/rx"


const OfferBar = () => {
    const [offerBarStatus, setOfferBarStatus] = useState(true);
    const offerCancelBtn = () => {
        setOfferBarStatus(!offerBarStatus);
    }

    return (
        offerBarStatus ? (
            <div className="flex flex-col bg-blackk relative offerBar">
                <div className="container mx-auto w-full md:flex text-white justify-between items-center py-[16px] text-center">
                    <div className="offerName flex justify-center items-center gap-[12px]">
                        <span className="bg-warning-300 rotate-[-3deg] text-blackk py-[6px] px-[10px]
                             font-public-sans font-semi-bold text-[20px]">
                            Black
                        </span>
                        <span className="text-white text-[24px] font-public-sans font-semi-bold">Friday</span>
                    </div>
                    <div className="discountDetails flex justify-center items-center gap-[8px]">
                        <span className="font-public-sans font-medium text-[14px]">Up to</span>
                        <span className="font-public-sans font-semi-bold text-[40px] text-warning-500 leading-12">59%</span>
                        <span className="font-public-sans font-semi-bold text-[20px]">OFF</span>
                    </div>
                    <div className="flex justify-center items-center">
                        <button className="shopNow bg-warning-500 px-[24px] flex justify-center items-center gap-[8px]
                             cursor-pointer duration-300 hover:bg-warning-300 rounded-[2px]">
                            <span className="text-blackk leading-12 font-public-sans font-bold text-[14px]">Shop Now</span>
                            <span className="text-blackk text-[20px]"><GoArrowRight /></span>
                        </button>
                    </div>
                </div>
                <button onClick={offerCancelBtn} className="offerCancelBtn p-[8px] rounded-[2px] bg-dark-gray text-white
                     absolute right-[24px] top-[24px] cursor-pointer duration-300 hover:text-dark-gray hover:bg-white">
                    <span className="text-[16px]"><RxCross2 /></span>
                </button>
            </div>
        ) : (
            null
        )
    )


}

export default OfferBar