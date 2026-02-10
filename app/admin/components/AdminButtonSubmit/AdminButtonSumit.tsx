interface AdminButtonSubmitProps {
    onClick?: () => void;
    content: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

const AdminButtonSubmit = ({ onClick, content, type = 'submit', disabled = false }: AdminButtonSubmitProps) => {
    return (
        <button 
            type={type} 
            onClick={onClick} 
            disabled={disabled}
            className={`text-[#FCFAF6] font-['Silka'] text-[18px] not-italic font-medium py-3 px-6 rounded-[10px] bg-[#00456B] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#F8AD41] hover:text-[#171C32] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#00456B] disabled:hover:text-[#FCFAF6] disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:active:scale-100`}
        >
            {content}
        </button>
    )
}

export default AdminButtonSubmit;