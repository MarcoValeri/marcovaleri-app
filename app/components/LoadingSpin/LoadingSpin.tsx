interface LoadingSpinProps {
    message: string;
}

const LoadingSpin = ({ message }: LoadingSpinProps) => {
    return (
        <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-[#171C32] font-sans font-medium leading-none text-[20px] mb-5 md:text-[30px]">{message}</p>
        </>
    )
}

export default LoadingSpin;