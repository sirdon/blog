import Admin from "../../../components/auth/Admin";
import Layout from "../../../components/Layout";
import CreateBlog from "../../../components/crud/Blog";
const Blog = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Create a new Blog</h2>
              <div className="col-md-12">
                <CreateBlog />
              </div>
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};
export default Blog;
