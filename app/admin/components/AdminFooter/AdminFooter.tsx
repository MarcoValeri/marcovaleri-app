interface AdminFooterProps {
    userEmail: string | undefined;
    signOut: () => void;
}

const AdminFooter = ({ userEmail, signOut }: AdminFooterProps) => {
    return (
        <div className="mt-15 lg:mt-auto p-4 border-t bg-black">
            <p className="text-xs text-white mb-2">User: {userEmail}</p>
            <button onClick={signOut} className="text-red-600 text-sm font-bold cursor-pointer">
                Sign Out
            </button>
        </div>
    )
}

export default AdminFooter;