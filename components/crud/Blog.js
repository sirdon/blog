import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { createBlog } from "../../actions/blog";
import { QuillFormats, QuillModules } from "../../helpers/quill";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";
const CreateBlog = ({ router }) => {
  const blogFromLS = () => {
    if (typeof window === "undefined") {
      return false;
    }
    if (typeof window !== undefined && localStorage.getItem("blog")) {
      return JSON.parse(localStorage.getItem("blog"));
    } else {
      return false;
    }
  };
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [checkedTags, setCheckedTags] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [body, setBody] = useState(blogFromLS());
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "",
    title: "",
    hidePublishButton: false,
  });
  const { error, sizeError, success, formData, title, hidePublishButton } =
    values;
  const token = getCookie("token");
  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
  }, [router]);
  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };
  const initTags = () => {
    getTags().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };
  const publishBlog = (e) => {
    e.preventDefault();
    // console.log("ready to publish blog");
    createBlog(formData, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: "" });
      } else {
        setBody("");
        setCheckedCategories([]);
        setCheckedTags([]);
        setValues({
          ...values,
          title: "",
          error: "",
          success: `A new blog titled ${data.title} is created`,
          formData: new FormData()
        });
      }
    });
  };
  const handleChange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: "" });
  };
  const handleBody = (e) => {
    // console.log(e.target.value);
    setBody(e);
    formData.set("body", e);
    if (typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(e));
    }
  };
  const handleToggle = (c) => () => {
    setValues({ ...values, error: "" });
    const clickedCategory = checkedCategories.indexOf(c);
    const cat = [...checkedCategories];
    if (clickedCategory == -1) {
      cat.push(c);
    } else {
      cat.splice(clickedCategory, 1);
    }
    setCheckedCategories(cat);
    formData.set("categories", cat);
  };
  const handleToggleTags = (t) => () => {
    setValues({ ...values, error: "" });
    const clickedTags = checkedTags.indexOf(t);
    const tag = [...checkedTags];
    if (clickedTags == -1) {
      tag.push(t);
    } else {
      tag.splice(clickedTags, 1);
    }
    setCheckedTags(tag);
    formData.set("tags", tag);
  };
  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => {
        return (
          <li key={i} className="list-unstyled">
            <input
              onChange={handleToggle(c._id)}
              value={c._id}
              type="checkbox"
              className="mr-2" checked={checkedCategories.includes(c._id)}
            />
            <label htmlFor="" className="form-ckeck-label">
              {c.name}
            </label>
          </li>
        );
      })
    );
  };
  const showTags = () => {
    return (
      tags &&
      tags.map((t, i) => {
        return (
          <li key={i} className="list-unstyled">
            <input
              onChange={handleToggleTags(t._id)}
              type="checkbox" value={t._id}
              className="mr-2" checked={checkedTags.includes(t._id)}
            />
            <label htmlFor="" className="form-ckeck-label">
              {t.name}
            </label>
          </li>
        );
      })
    );
  };
  const createBlogForm = () => {
    return (
      <>
        <form onSubmit={publishBlog}>
          <div className="form-group">
            <label htmlFor="" className="text-muted">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              onChange={handleChange("title")}
              value={title}
            />
          </div>
          <div className="form-group">
            <ReactQuill
              modules={QuillModules}
              formats={QuillFormats}
              value={body}
              placeholder="Write something..."
              onChange={handleBody}
            />

          </div>
          {showSuccess()}
          {showError()}
          <div className="">
            <button className="btn btn-primary">Publish</button>
          </div>
        </form>
      </>
    );
  };
  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );
  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8">{createBlogForm()}</div>
          <div className="col-md-4">
            <div className="">
              <div className="form-group pb-2">
                <h5>Featured image</h5>
                <hr />
                <small className="text-muted">Max size:1mb</small>
                <label className="btn btn-outline-info">
                  Upload featured image
                  <input
                    onChange={handleChange("photo")}
                    type="file"
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>
            </div>
            <div className="">
              <h5>Categories</h5>
              <hr />
              <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
                {showCategories()}
              </ul>
            </div>
            <div className="">
              <h5>Tags</h5>
              <hr />
              <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
                {showTags()}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(CreateBlog);
