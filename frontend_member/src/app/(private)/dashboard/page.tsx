import Header from '../../../components/header.tsx';
import Sidebar from '../../../components/sidebar.tsx';



function DashboardPage() {
  return (
    <>
      <Header />
      <Sidebar />
      <div className="ml-[250px] mt-[78px] p-4">
        <h1 className="text-xl font-bold">Dashboard Page</h1>
        {/* Other content here */}
      </div>
    </>
  );
}

export default DashboardPage;

