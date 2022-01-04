import React from "react";
import "./SearchFail.css";
import {Result, Button, Breadcrumb} from 'antd';

function SearchFail() {
    return (
        <div id={"search-content"}>
            <Breadcrumb style={{margin: '16px 0'}}>
                <Breadcrumb.Item>Src</Breadcrumb.Item>
                <Breadcrumb.Item>Components</Breadcrumb.Item>
                <Breadcrumb.Item>Search</Breadcrumb.Item>
            </Breadcrumb>
            <div id="image-content">
                <Result
                    status="404"
                    title="Data doesn't exist."
                />
            </div>
        </div>
    );
}

export default SearchFail;