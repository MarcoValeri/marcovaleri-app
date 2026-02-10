import Sidebar from "../Sidebar/Sidebar";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <main className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-[60%] p-6">
                {children}
            </div>
            <div className="w-full lg:w-[40%] p-6">
                <Sidebar />
            </div>
        </main>
    )
}

export default MainLayout;