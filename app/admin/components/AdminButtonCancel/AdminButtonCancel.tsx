interface AdminButtonCancelProps {
    onClick?: () => void;
    content: string;
    type?: 'button' | 'submit' | 'reset';
}

const AdminButtonCancel = ({ onClick, content, type = 'button' }: AdminButtonCancelProps) => {
    return (
        <button type={type} onClick={onClick} className="text-[#171C32] text-[18px] not-italic font-medium py-3 px-6 rounded-[10px] bg-gray-500 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-600 hover:text-[#FCFAF6] hover:shadow-lg hover:-translate-y-0.5 active:scale-95">{content}</button>
    )
}

export default AdminButtonCancel;