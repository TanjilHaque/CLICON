import { icons } from "../../helpers/iconProvider"

const Button = ({ px = 32, text = "SHOP NOW",
    btnIcon = icons.arrowRight, bgColor = "primary-500", fontSize = 16,
    leading = 48,
}) => {
    return (
        <div className={`px-[${px}px] bg-${bgColor} rounded-[2px] flex justify-center items-center gap-[12px]`}>
            <span className={`text-[${fontSize}px] font-bold leading-[${leading}px]
             tracking-[1.2%]`}>{text}</span>
            <span className="text-[20px]">{btnIcon}</span>
        </div>
    )
}

export default Button