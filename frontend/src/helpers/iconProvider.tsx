// iconProvider.tsx
import { FaChevronDown, FaFacebook, FaInstagram, FaPinterestP, FaReddit, FaTwitter, FaYoutube } from "react-icons/fa";
import { HiArrowPath } from "react-icons/hi2";
import { PiHeadphones, PiInfo, PiMapPinLineLight, PiPhoneCall, PiUser } from "react-icons/pi";
import { GoArrowRight, GoHeart } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { FiShoppingCart } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";

export const icons = {
    chevronDown: <FaChevronDown />,
    arrowPath: <HiArrowPath />,
    headphones: <PiHeadphones />,
    info: <PiInfo />,
    mapPin: <PiMapPinLineLight />,
    phoneCall: <PiPhoneCall />,
    arrowRight: <GoArrowRight />,
    cross: <RxCross2 />,
    shoppingCart: <FiShoppingCart />,
    heart: <GoHeart />,
    search: <LuSearch />,
    user: <PiUser />,
    facebook: <FaFacebook />,
    instagram: <FaInstagram />,
    pinterest: <FaPinterestP />,
    reddit: <FaReddit />,
    twitter: <FaTwitter />,
    youtube: <FaYoutube />,
} as const;

export type IconName = keyof typeof icons;
