import Private from "../../components/auth/Private";
import Layout from "../../components/Layout";
const UserIndex = () => {
  return (
    <Layout>
      <Private>
        <h2 className="abc">User Dashboard</h2>
      </Private>
    </Layout>
  );
};
export default UserIndex;
