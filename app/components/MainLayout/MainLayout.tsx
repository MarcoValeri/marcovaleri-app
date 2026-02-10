import Sidebar from "../Sidebar/Sidebar";

const MainLayout = () => {
    return (
        <main className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-[60%]">
                <h2>Main</h2>
            </div>
            <div className="w-full lg:w-[40%]">
                <Sidebar />
            </div>
        </main>
    )
}

export default MainLayout;