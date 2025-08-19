import { FiShoppingCart } from "react-icons/fi"
import { GoHeart } from "react-icons/go"
import { LuSearch } from "react-icons/lu"
import { PiUser } from "react-icons/pi"

const SearchBar = () => {
    return (
        <div className="bg-secondary-700 py-[20px]">
            <div className="container mx-auto flex justify-between items-center">
                <div className="logo flex justify-center items-center gap-[8px]">
                    <div className="icon w-[48px] h-[48px] rounded-full bg-white relative">
                        <div className="absolute text-white w-[24px] h-[24px] rounded-full top-[25%] left-[25%] border-secondary-700 border-4"></div>
                    </div>
                    <div className="name font-bold font-public-sans text-[32px] leading-[40px] tracking-[-2%] text-white">CLICON</div>
                </div>
                <div className="searchBox py-[14px] px-[20px] bg-white flex justify-between items-center">
                    <input type="text"
                        className="w-[578px] placeholder:font-public-sans placeholder:text-[14px]
                         placeholder:leading-[20px] text-gray-500
                          outline-none focus:text-blackk
                        "
                        placeholder="Search for anything..."
                    />
                    <span className="text-[20px] text-gray-900 cursor-pointer"><LuSearch /></span>
                </div>
                <div className="options flex justify-center items-center gap-[24px]">
                    <span className="cursor-pointer text-[32px] text-white"><FiShoppingCart /></span>
                    <span className="cursor-pointer text-[32px] text-white"><GoHeart /></span>
                    <span className="cursor-pointer text-[32px] text-white"><PiUser /></span>
                </div>
            </div>
        </div>
    )
}

export default SearchBar