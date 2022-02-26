import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useState } from "react";
import { listBlogsWithCategoriesAndTags } from "../../actions/blog";
import { API } from "../../config";
import React from 'react'
import moment from "moment";
import ReactHtmlParser from 'react-html-parser';
import Select from 'react-select';
const Blogs = ({ blogs, categories, tags, size }) => {
    const options = [
        { label: 'Swedish', value: 'sv' },
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
    ];
    const showAllBlogs = () => {
        return blogs.map((blog, idx) => {
            return <article key={idx}>
                <div className="lead pb-4">
                    <Select options={options} value="sv" name="language" placeholder="Choose your language" />
                    <header>
                        <Link href={`/blogs/${blog.slug}`}><a><h2>{blog.title}</h2></a></Link>
                    </header>
                    <section>
                        <p className="mark ml-1 pt-2 pb-2">Written by {blog.postedBy.name} | Published {moment(blog.updatedAt).fromNow()}</p>
                    </section>
                    <section>
                        <p>blog categories and tags</p>
                    </section>
                    <div className="row">
                        <div className="col-md-4">image</div>
                        <div className="col-md-8">
                            <section>
                                <div className="pb-3">{ReactHtmlParser(blog.excerpt)}</div>
                                <Link href={`/blogs/${blog.slug}`}><a className="btn btn-primary pt-2">Read more</a></Link>
                            </section>
                        </div>
                    </div>
                </div>
                <hr />
            </article>
        })
    }
    return (
        <Layout>
            <main>
                <div className="container-fluid">
                    <header>
                        <div className="col-md-12 pt-3">
                            <h1 className="display-4 font-weight-bold text-center">Programming blogs and tutorials</h1>
                        </div>
                        <section>
                            <p>show categories and tags</p>
                        </section>
                    </header>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">{showAllBlogs()}</div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

Blogs.getInitialProps = () => {
    return listBlogsWithCategoriesAndTags().then(data => {
        if (data.error) {
            console.log(data.error)
        } else {
            return {
                blogs: data.blogs, categories: data.categories, tags: data.tags, size: data.size
            }
        }
    }).catch(err => { console.log(err) })
}

export default Blogs
