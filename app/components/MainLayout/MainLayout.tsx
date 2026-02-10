import Sidebar from "../Sidebar/Sidebar";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <main className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-[60%]">
                {children}
            </div>
            <div className="w-full lg:w-[40%]">
                <Sidebar />
            </div>
        </main>
    )
}

export default MainLayout;