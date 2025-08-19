import { FaChevronDown } from "react-icons/fa"
import { HiArrowPath } from "react-icons/hi2"
import { PiHeadphones, PiInfo, PiMapPinLineLight, PiPhoneCall } from "react-icons/pi"

const Navbar = () => {
    return (
        <div className="bg-white py-[16px] shadow-[inset_0_-1px_0_rgba(228,231,233)]">
            <div className="flex justify-between items-center container mx-auto">
                <div>
                    <ul className="navItems flex justify-center items-center gap-[24px]">
                        <li className="flex justify-center items-center gap-[8px] cursor-pointer font-public-sans bg-gray-50 py-[14px] px-[24px]">
                            <span className="text-[14px] font-medium text-blackk leading-[20px]">All Category</span>
                            <span className="text-blackk font-[16px]"><FaChevronDown /></span>
                        </li>
                        <li className="flex justify-center items-center gap-[8px] cursor-pointer font-public-sans text-gray-600">
                            <span className="text-[24px] text-gray-600"><PiMapPinLineLight /></span>
                            <span className="text-[14px] font-normal text-gray-600 leading-[20px]">Track Order</span>
                        </li>
                        <li className="flex justify-center items-center gap-[8px] cursor-pointer font-public-sans text-gray-600">
                            <span className="text-[24px] text-gray-600"><HiArrowPath /></span>
                            <span className="text-[14px] font-normal text-gray-600 leading-[20px]">Compare</span>
                        </li>
                        <li className="flex justify-center items-center gap-[8px] cursor-pointer font-public-sans text-gray-600">
                            <span className="text-[24px] text-gray-600"><PiHeadphones /></span>
                            <span className="text-[14px] font-normal text-gray-600 leading-[20px]">Customer Support</span>
                        </li>
                        <li className="flex justify-center items-center gap-[8px] cursor-pointer font-public-sans text-gray-600">
                            <span className="text-[24px] text-gray-600"><PiInfo /></span>
                            <span className="text-[14px] font-normal text-gray-600 leading-[20px]">Need Help</span>
                        </li>
                    </ul>
                </div>
                <div className="phoneNumber flex justify-center items-center gap-[8px]">
                    <span className="text-[28px] text-blackk"><PiPhoneCall /></span>
                    <span className="text-blackk font-public-sans text-[18px] leading-[24px] tracking-[0%] font-normal">+1-202-555-0104</span>
                </div>
            </div>
        </div>
    )
}

export default Navbar