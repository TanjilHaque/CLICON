import { FaChevronDown, FaFacebook, FaInstagram, FaPinterestP, FaReddit, FaTwitter, FaYoutube } from "react-icons/fa"

const WelcomeBar = () => {
    const handleLanguageDropdownBtn = () => { }
    const handleCurrencyDropdownBtn = () => { }
    return (
        <div className="bg-secondary-700 py-[16px] shadow-[inset_0_-1px_0_rgba(255,255,255,0.16)]">
            <div className="container mx-auto flex justify-between items-center">
                <div className="font-public-sans text-[14px] font-normal leading-5 text-white">
                    Welcome to Clicon online eCommerce store.
                </div>
                <div className="flex justify-center items-center gap-[48px]">
                    <div className="socials flex justify-center items-center gap-[12px]">
                        <div className="font-public-sans text-[14px] font-normal leading-5 text-white">Follow us:</div>
                        <div className="flex justify-center items-center gap-[12px] text-white">
                            <span className="cursor-pointer"><FaTwitter /></span>
                            <span className="cursor-pointer"><FaFacebook /></span>
                            <span className="cursor-pointer"><FaPinterestP /></span>
                            <span className="cursor-pointer"><FaReddit /></span>
                            <span className="cursor-pointer"><FaYoutube /></span>
                            <span className="cursor-pointer"><FaInstagram /></span>
                        </div>
                    </div>
                    <div className="dropDowns flex justify-center items-center gap-[24px] text-white">
                        <div className="languages">
                            <button onClick={handleLanguageDropdownBtn} className="flex justify-center items-center gap-[6px] cursor-pointer">
                                <span className="font-public-sans text-[14px] font-normal leading-5 text-white">Eng</span>
                                <span className="text-[12px] text-[#80A4BB]"><FaChevronDown /></span>
                            </button>
                        </div>
                        <div className="currency">
                            <button onClick={handleCurrencyDropdownBtn} className="flex justify-center items-center gap-[6px] cursor-pointer">
                                <span className="font-public-sans text-[14px] font-normal leading-5 text-white">USD</span>
                                <span className="text-[12px] text-[#80A4BB]"><FaChevronDown /></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WelcomeBar